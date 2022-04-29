from aqt import mw
from aqt import gui_hooks
from aqt import utils

def slot_handle(msg):
    if isinstance(msg,str):
        utils.showInfo(msg)
    elif isinstance(msg,dict):
        if "ope_type" in msg:
            if "card_id" in msg["ope_data"]:
                
                # 操作卡片
            # else:
                # 操作卡片组
    else:
        utils.showInfo(str(msg))