from aqt import mw
from aqt import gui_hooks
from aqt import utils

import logging
from .websocket_server import WebsocketServer
import threading
import socket
from PyQt5.QtCore import QObject, pyqtSignal, QThread
import tcp_pack_construct

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


def new_client(client, server):
    utils.showInfo("panote 客户端已经连接上anki插件")


def lost_client():
    utils.showInfo("panote anki插件 失去客户端连接")


def recv_msg(new_client_socket, ip_port, send):
    """
    接收消息 的函数
    :param new_client_socket: socket
    :param ip_port: ip地址元祖
    :return:
    """
    while global_on:
        recv_data = new_client_socket.recv(1024)
        # 判断是否有消息返回
        if recv_data:
            recv_text = recv_data.decode('UTF-8')

            # print("来自【%s】的消息：%s" % (str(ip_port), recv_text))
        else:
            # 如果断开连接会执行这行代码，此时关闭socket的连接
            new_client_socket.close()
            # print("已经断开【%s】的连接" % (str(ip_port)))
            break



class NetCtx:
    send: QTypeSignal


netctx = NetCtx()


def new_client1(client, server):
    server.send_message_to_all("Hey all, a new client has joined us")
    netctx.send.emit_connect()


def net_thread(send: QTypeSignal):
    # server = WebsocketServer(host='127.0.0.1', port=13254, loglevel=logging.INFO)
    # server.set_fn_new_client(new_client)
    # server.set_fn_client_left(lost_client)
    # server.run_forever()
    # 创建套接字

    # global_send.emit_connect()
    global tcp_server_socket
    tcp_server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    # 设置地址可复用
    # tcp_server_socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, True)
    # 绑定TCP端口
    tcp_server_socket.bind(("", 12359))
    # 设置监听 最多128个连接
    tcp_server_socket.listen(128)

    while global_on:
        try:
            new_client_socket, ip_port = tcp_server_socket.accept()
            # utils.showInfo("panote 客户端已经连接上anki插件")
            send.emit_connect();
            new_thread = threading.Thread(target=recv_msg, args=(new_client_socket, ip_port, send))
            # 设置守护线程：在主线程关闭的时候 子线程也会关闭
            new_thread.setDaemon(True)

            new_thread.start()
        except:
            print('err')


def init():
    print('将信号绑定槽：')
    # 将信号绑定到槽函数上
    global_send.sendmsg.connect(slot_handle)

    thread = threading.Thread(target=net_thread, args=(global_send,))
    thread.start()


def slot_handle(msg):
    utils.showInfo(msg + "panote 客户端已经连接上anki插件")


def about_2_quit():
    global tcp_server_socket, global_on
    global_on = False
    tcp_server_socket.close()
    # utils.showInfo("about_2_quit")


gui_hooks.main_window_did_init.append(init)
gui_hooks.profile_will_close.append(about_2_quit)
# mw.app.aboutToQuit.connect(about_2_quit)
