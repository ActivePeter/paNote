# from aqt import mw
# from aqt import gui_hooks
# from aqt import utils

import threading
import socket
from PyQt5.QtCore import QObject, pyqtSignal, QThread
import tcp_pack_construct
from . import debug_window

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



def thread_recv_msg(new_client_socket: socket, ip_port, send):
    pack_constructor=tcp_pack_construct.TcpPackConstructor()
    def pack_handle(pack_data:list):
        pack_data=bytearray(pack_data)
        print("recv:",pack_data.decode(encoding='UTF-8',errors='strict'))
    pack_constructor.set_detahandle_callback(pack_handle)
    while global_on:
        recv_data = new_client_socket.recv(1024)
        # 判断是否有消息返回
        if recv_data:
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





def slot_handle(msg):
    utils.showInfo(msg + "panote 客户端已经连接上anki插件")


debug=debug_window.TextEditWidget()


# 插件生命周期
def init():
    print('将信号绑定槽：')
    # 将信号绑定到槽函数上
    global_send.sendmsg.connect(slot_handle)
    debug.show()
    thread = threading.Thread(target=thread_server, args=(global_send,))
    thread.start()
def about_2_quit():
    global tcp_server_socket, global_on
    global_on = False
    tcp_server_socket.close()
    # utils.showInfo("about_2_quit")

init()
