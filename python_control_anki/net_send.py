import json
import socket
from typing import Optional
from aqt import utils

cur_tcp_socket: Optional[socket.socket] = None

def send__start_review_card(note:str,card_set:str,card:str):
    # utils.showInfo("send__start_review_card")

    obj={
        "packid":"start_review_card",
        "packobj":{
            "note":note,
            "card_set":card_set,
            "card":card
        }
    }
    objstr=json.dumps(obj)
    objbytes=bytes(objstr,encoding="UTF-8")
    # utils.showInfo("objbyteslen:"+str(len(objbytes)))
    lenbytes=len(objbytes).to_bytes(length=4, byteorder='big', signed=False)

    if cur_tcp_socket is not None:
        cur_tcp_socket.send(b"".join([lenbytes,objbytes]))

