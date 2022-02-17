from aqt import mw
from aqt import gui_hooks
from aqt import utils


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
    father=new_dic("panote")
    child=new_dic("panote1")
    # list=[child]
    mw.col.decks.col._backend.reparent_decks(
        deck_ids=[child],
        new_parent=father
    )
    utils.showInfo(str(
        child
    ))


gui_hooks.main_window_did_init.append(test)
