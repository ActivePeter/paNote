import anki.collection
import time
from aqt import mw
from aqt import gui_hooks
from aqt import utils
from anki import (
    decks,
    models
)
from typing import (
    TYPE_CHECKING,
    Any,
    Dict,
    Iterable,
    List,
    NewType,
    Optional,
    Sequence,
    Tuple,
    Union,
    no_type_check,
)
import queue

tasks = queue.Queue()


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


def del_card(card: str, card_set: str, note: str):
    def redo():
        del_card(card, card_set, note)
    # 找到根deck
    panote_dic = get_or_create_deck("panote")  # mw.col.decks.id("panote")
    deck_tree_root = \
        mw.col.decks.deck_tree()
    deck_tree_root = mw.col.decks.find_deck_in_tree(deck_tree_root, panote_dic)
    if deck_tree_root:
        note_node = find_or_create_deck_in_node(deck_tree_root, note)

        if note_node is not None:
            card_set_node = find_or_create_deck_in_node(note_node, card_set)
            if card_set_node is None:
                tasks.put(redo)
            else:
                # mw.col.remove_notes()
                deckname = deck_tree_root.name + "::" + note_node.name + "::" + card_set_node.name
                notes = mw.col.find_notes(f'deck:"{deckname}"')
                for noteId1 in notes:
                    if mw.col.get_note(noteId1).fields[0] == card:
                        mw.col.remove_notes(note_ids=[noteId1])
                        break

                mw.deckBrowser.show()
            # mw.col.after_note_updates()
        else:
            # utils.showInfo("redo push")
            tasks.put(redo)


        # utils.showInfo(str(deck_tree_root.children))


def add_card(card: str, card_set: str, note: str):
    def redo():
        add_card(card, card_set, note)
    # 找到根deck
    panote_dic = get_or_create_deck("panote")  # mw.col.decks.id("panote")
    deck_tree_root = \
        mw.col.decks.deck_tree()
    deck_tree_root = mw.col.decks.find_deck_in_tree(deck_tree_root, panote_dic)
    if deck_tree_root:
        note_node = find_or_create_deck_in_node(deck_tree_root, note)

        if note_node is not None:
            card_set_node = find_or_create_deck_in_node(note_node, card_set)
            if card_set_node is not None:
                # utils.showInfo(str(card_set_node))
                notetype = mw.col.models.get(
                    id=mw.col._backend.defaults_for_adding(
                        home_deck_of_current_review_card=card_set_node.deck_id,
                    ).notetype_id)
                # utils.showInfo(str(notetype))
                newnote = mw.col.new_note(notetype)
                newnote.fields[0] = card
                mw.col.add_note(newnote, card_set_node.deck_id)

                mw.deckBrowser.show()
            else:
                tasks.put(redo)
            # deckname=deck_tree_root.name+"::"+note_node.name+"::"+card_set_node.name
            # notes = mw.col.find_notes(f'deck:"{deckname}"')
            # for noteId1 in notes:
            #     utils.showInfo(str(mw.col.get_note(noteId1).data)+"\n"+str(mw.col.get_note(noteId1).col))
            # mw.col.after_note_updates()
        else:
            # utils.showInfo("redo push")
            # utils.showInfo("err create node fail")/
            tasks.put(redo)

        # utils.showInfo(str(deck_tree_root.children))


def find_or_create_deck_in_node(node: decks.DeckTreeNode, deck_name: str) -> Optional[decks.DeckTreeNode]:
    fnode = find_deck_in_node(node, deck_name)
    if fnode is None:
        new_note_deck = get_or_create_deck(deck_name)  # mw.col.decks.id(deck_name)
        mw.deckBrowser.show()
        mw.col.decks.reparent(
            deck_ids=[new_note_deck],
            new_parent=node.deck_id
        )
        mw.deckBrowser.show()
        fnode = find_deck_in_node(node, deck_name)

    return fnode


def find_deck_in_node(node: decks.DeckTreeNode, deck_name: str) -> Optional[decks.DeckTreeNode]:
    for i in range(len(node.children)):
        # utils.showInfo(str(node.children[i].deck_id))
        if node.children[i].name == deck_name:
            return node.children[i]
    return None


def get_or_create_deck(name: str):
    id = mw.col.decks.id(name)
    while id is None:
        # utils.showInfo("get_or_create_deck")
        mw.col.decks.add_normal_deck_with_name(name)
        id = mw.col.decks.id(name)
        mw.deckBrowser.show()

    # mw.reset()
    # mw.reviewer.show()
    # # mw.reviewer.show()
    # mw.deckBrowser.show()
    # time.sleep(1)
    return id
#
