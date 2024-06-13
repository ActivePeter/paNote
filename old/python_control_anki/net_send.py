import json
import socket
from typing import Optional
from aqt import utils

cur_tcp_socket: Optional[socket.socket] = None

def _dumpobj_and_send(obj:dict):
    objstr = json.dumps(obj)
    objbytes = bytes(objstr, encoding="UTF-8")
    # utils.showInfo("objbyteslen:"+str(len(objbytes)))
    lenbytes = len(objbytes).to_bytes(length=4, byteorder='big', signed=False)

    if cur_tcp_socket is not None:
        cur_tcp_socket.send(b"".join([lenbytes, objbytes]))

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
    _dumpobj_and_send(obj)

def send__answer_showned(btns:str):
    obj={
        "packid":"answer_showned",
        "packobj":{
            "btns":btns
        }
    }
    _dumpobj_and_send(obj)

def send__no_card_to_review(note:str,card_set:str):
    obj={
        "packid":"no_card_to_review",
        "packobj":{
            "note":note,
            "card_set":card_set
        }
    }
    _dumpobj_and_send(obj)

def send__anki_state_not_match():
    obj={
        "packid":"anki_state_not_match",
        # "packobj":{
        #     "note":note,
        #     "card_set":card_set
        # }
    }
    _dumpobj_and_send(obj)