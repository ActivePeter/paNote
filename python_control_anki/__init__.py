from aqt import mw
from aqt import gui_hooks
from aqt import utils
import sys
from PyQt5 import QtCore
from PyQt5.QtWidgets import *
from PyQt5.QtGui import *
from PyQt5.QtCore import *
import threading
import socket
from PyQt5.QtCore import QObject, pyqtSignal, QThread,QTimer
from . import tcp_pack_construct
from . import handle_msg
from . import anki_util
from . import net_send
import json


# 信号对象
class QTypeSignal(QObject):
    # 生成一个信号
    sendmsg = pyqtSignal(object)

    def __init__(self):
        super().__init__()

    def emit_connect(self):
        # 发射信号
        self.sendmsg.emit('emit_connect')


global_send = QTypeSignal()
global_on = True
tcp_server_socket = None


def new_dic(name: str):
    panote_dic = mw.col.decks.id(name)

    if panote_dic is None:
        mw.col.decks.add_normal_deck_with_name(name)
    panote_dic = mw.col.decks.id(name)
    return panote_dic


def test():
    # txt=""
    # for key in mw.col.decks.decks.keys():
    #     (txt + ':' + mw.col.decks.select(key))
    father = new_dic("panote")
    child = new_dic("panote1")
    # list=[child]
    mw.col.decks.col._backend.reparent_decks(
        deck_ids=[child],
        new_parent=father
    )
    utils.showInfo(str(
        child
    ))


def thread_recv_msg(new_client_socket: socket, ip_port, send: QTypeSignal):
    pack_constructor = tcp_pack_construct.TcpPackConstructor()

    def pack_handle(pack_data: list):
        pack_data = bytearray(pack_data)
        str = pack_data.decode(encoding='UTF-8', errors='strict')
        try:
            jsonobj = json.loads(str)
            send.sendmsg.emit(jsonobj)
        except json.JSONDecodeError:
            send.sendmsg.emit(str)

        # print("recv:",jsonobj)
        # send.sendmsg.emit(jsonobj)
        # print("recv:", pack_data.decode(encoding='UTF-8', errors='strict'))

    pack_constructor.set_detahandle_callback(pack_handle)
    while global_on:
        #todo 这里要换成try，否则可能会崩掉
        recv_data = new_client_socket.recv(1024)
        # 判断是否有消息返回
        if recv_data:
            net_send.cur_tcp_socket=new_client_socket
            pack_constructor.handle_slice(list(recv_data))
            # recv_text = recv_data.decode('UTF-8')
            # print("来自【%s】的消息：%s" % (str(ip_port), recv_text))
        else:
            # 如果断开连接会执行这行代码，此时关闭socket的连接
            new_client_socket.close()
            # print("已经断开【%s】的连接" % (str(ip_port)))
            break


class NetCtx:
    send: QTypeSignal


netctx = NetCtx()


def thread_server(send: QTypeSignal):
    # global_send.emit_connect()
    global tcp_server_socket
    tcp_server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

    # 设置地址可复用
    # tcp_server_socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, True)
    # 绑定TCP端口
    tcp_server_socket.bind(("", 12357))
    # 设置监听 最多128个连接
    tcp_server_socket.listen(128)

    while global_on:
        try:
            new_client_socket, ip_port = tcp_server_socket.accept()
            # utils.showInfo("panote 客户端已经连接上anki插件")
            send.emit_connect();
            new_thread = threading.Thread(target=thread_recv_msg, args=(new_client_socket, ip_port, send))
            # 设置守护线程：在主线程关闭的时候 子线程也会关闭
            new_thread.setDaemon(True)

            new_thread.start()
        except:
            print('err')


# class TimerWorker(QObject):
    # 这是每个对象所包含的一个定时器函数
last_n_empty=False
def timerEvent():
    global last_n_empty
    if not anki_util.tasks.empty():
        # utils.showInfo("timer redo")
        job = anki_util.tasks.get()
        job()
        last_n_empty=True
    else:
        if last_n_empty:
            mw.deckBrowser.show()
        last_n_empty=False

def timer_event_1s():
    if not anki_util.tasks_1s.empty():
        job=anki_util.tasks_1s.get()
        job()

def timer_event_timed():
    # 计时
    anki_util.timed_time_cnt+=1
    while not anki_util.tasks_timed_add_queue.empty():
        anki_util.tasks_timed[anki_util.tasks_timed_next_key]=anki_util.tasks_timed_add_queue.get()
        anki_util.tasks_timed_next_key+=1
        # self.next_timed_task_id+=1
    if anki_util.tasks_timed:
        queue=[]
        for key in anki_util.tasks_timed:
            task:anki_util.TimedTask=anki_util.tasks_timed[key]
            if anki_util.timed_time_cnt-task.begin_time>=task.sleeptime:
                task.cb()
                queue.append(key)
                # del anki_util.tasks_timed[key]
        for key in queue:
            del anki_util.tasks_timed[key]

# tw = TimerWorker()
timer = QTimer()
timer_1s=QTimer()
timer_timed=QTimer()

# 插件生命周期
def init():
    timer.timeout.connect(timerEvent)
    timer.start(100)

    timer_1s.timeout.connect(timer_event_1s)
    timer_1s.start(1000)

    timer_timed.timeout.connect(timer_event_timed)
    timer_timed.start(10)

    # anki_util.add_review_one_card_hook()
    anki_util.init()

    # tw.startTimer(100)
    print('将信号绑定槽：')
    # 将信号绑定到槽函数上
    global_send.sendmsg.connect(handle_msg.slot_handle)

    thread = threading.Thread(target=thread_server, args=(global_send,))
    thread.start()


def about_2_quit():
    global tcp_server_socket, global_on
    global_on = False
    tcp_server_socket.close()
    # utils.showInfo("about_2_quit")


gui_hooks.main_window_did_init.append(init)
gui_hooks.profile_will_close.append(about_2_quit)
# mw.app.aboutToQuit.connect(about_2_quit)
