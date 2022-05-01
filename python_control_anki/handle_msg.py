from aqt import mw
from aqt import gui_hooks
from aqt import utils
from . import anki_util
def handle_start_review(packobj:dict):
    anki_util.start_review_cardset(packobj["note_id"],packobj["card_set_id"])

def slot_handle(msg):
    if isinstance(msg,str):
        utils.showInfo(msg)
    elif isinstance(msg,dict):
        if "packid" in msg:
            packid=msg["packid"]
            packobj=msg["packobj"]
            if packid == "start_review":
                handle_start_review(packobj)
        elif "ope_type" in msg:
            data=msg["ope_data"]
            if "card_id" in data:
                # utils.showInfo(msg["ope_type"])
                if msg["ope_type"]==0:#add
                    anki_util.add_card(data["card_id"],data["card_set_id"],data["note_id"])
                elif msg["ope_type"]==1:#del
                    anki_util.del_card(data["card_id"], data["card_set_id"], data["note_id"])
                # 操作卡片
            # else:
                # 操作卡片组
    else:
        utils.showInfo(str(msg))