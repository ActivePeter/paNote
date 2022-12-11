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

from . import debug_window
from . import net_send

tasks = queue.Queue()
tasks_1s = queue.Queue()

tasks_timed_add_queue = queue.Queue()
tasks_timed_next_key = 0
tasks_timed = {}
timed_time_cnt = 0

# 状态，用来记录
class States:
    cur_review_note=""
    cur_review_cardset=""
    def start_review(self,note:str,cardset:str):
        self.cur_review_note=note
        self.cur_review_cardset=cardset
    def clear_review_state(self):
        self.cur_review_note=""
        self.cur_review_cardset=""
    def is_reviewing(self):
        return self.cur_review_note!=""
states=States()

class TimedTask:
    def __init__(self, begin_time, sleeptime, cb):
        self.begin_time = begin_time
        self.sleeptime = sleeptime
        self.cb = cb


class TaskPutter:

    def put_100ms_task(self, task):
        tasks.put(task)

    def put_1s_task(self, task):
        tasks_1s.put(task)
        return self

    def put_timed_task(self, cb, delay_time):
        tasks_timed_add_queue.put(TimedTask(timed_time_cnt, delay_time, cb))
        # tasks_timed[self.next_timed_task_id]=TimedTask(timed_time_cnt,delay_time,cb)
        # self.next_timed_task_id+=1


task_putter = TaskPutter()


# some hooks
def init():
    def if_panote_review(card):

        if states.is_reviewing():
            # utils.showInfo("if_panote_review" + str(states.cur_review_note))
            # utils.showInfo("panote question show")
            # states.start_review(states., card_set)
            net_send.send__start_review_card(
                states.cur_review_note,
                states.cur_review_cardset,
                mw.reviewer.card.note().fields[0]
            )
    gui_hooks.reviewer_did_show_question.append(if_panote_review)
    def state_change(from1:str,to1:str):
        if mw.state!="review":
            # 如果为预览模式，可能是刚刚set deck
            if(mw.state=="overview"):
                if states.is_reviewing():
                    # 没有要复习的卡片了
                    if mw.col.sched._is_finished():
                        net_send.send__no_card_to_review(
                            states.cur_review_note,
                            states.cur_review_cardset
                        )
                    # 有卡片，准备开始复习
                    else:
                        # def task_try_to_review:
                        mw.moveToState("review")
                        # task_putter.put_timed_task(to_reviw, 30)

                        # utils.showInfo("try mw.moveToState(review)")
                        # 若成功。则会调用上面if_panote_review的netsend
                        # if mw.state=="review":
            else:
                states.clear_review_state()
    gui_hooks.state_did_change.append(state_change)

    # gui_hooks.reviewer_


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


# # call when init
# def add_review_one_card_hook():
#     utils.showInfo("add_review_one_card_hook")
#
#     # gui_hooks.card
#     # gui_hooks.reviewer_did_answer_card.append(cb)

# ():
#     # 超过10s,就失效
#     if timed_time_cnt- cur_review_deck__set_time<1000:
#         # 10s之内将对应的卡片号发给panote
#         deckid=mw.reviewer.card.current_deck_id()
#         utils.showInfo(str(deckid))
#         utils.showInfo(str(cur_review_deck))
#         if deckid==cur_review_deck:
#             utils.showInfo("send__start_review_card")

def answer_cur_card(index: int):
    if mw.state == "review":
        mw.reviewer._answerCard(index + 1)


# cur_review_deck=None
# cur_review_deck__set_time=0
# cur_review_deck__note=""
# cur_review_deck__card_set=""
def show_answer_if_reviewing():
    if mw.state == "review":
        mw.reviewer._showAnswer()
        net_send.send__answer_showned(mw.reviewer._answerButtons())


def start_review_cardset(note: str, card_set: str):
    panote_dic = get_or_create_deck("panote")  # mw.col.decks.id("panote")
    deck_tree_root = \
        mw.col.decks.deck_tree()
    deck_tree_root = mw.col.decks.find_deck_in_tree(deck_tree_root, panote_dic)
    fail = False
    if deck_tree_root:
        note_node = find_or_create_deck_in_node(deck_tree_root, note)
        if note_node is not None:
            card_set_node = find_or_create_deck_in_node(note_node, card_set)
            if card_set_node is not None:
                # mw.overview
                # cnt=0
                # while mw.state!="review" and cnt<100:

                states.start_review(note, card_set)
                mw.deckBrowser.set_current_deck(card_set_node.deck_id)

                # cur_review_deck=card_set_node.deck_id
                # cur_review_deck__set_time=timed_time_cnt
                # cur_review_deck__note=note
                # cur_review_deck__card_set=card_set
                # cnt+=1
                #
                # # def on_change(str,str1):
                # #     if str1=="overview":
                # #         mw.moveToState("review")
                # #         gui_hooks.state_id_change.remove(on_change)

                # def to_reviw():
                #
                #     # if mw.state != "review":
                #     #
                #     #     if mw.state=="overview":
                #     #         # mw.moveToState("review")
                #     #         # if mw.state == "overview":
                #     #         #     # 没有要复习的卡片了
                #     #         #     net_send.send__no_card_to_review(note,card_set)
                #     #     else:
                #     #
                #     #     # utils.showInfo("mw_cur_state:"+mw.state)
                #     #     # if mw.state=="overview":
                #     #     #     mw.overview.
                #     #     # # utils.showInfo("to_reviw_fail")
                #     #         mw.moveToState("review")
                #     #         task_putter.put_timed_task(
                #     #             to_reviw
                #     #             # lambda :utils.showInfo("emmmmmmmmm")
                #     #             , 30)
                #     # else:
                #     #     # utils.showInfo("to_reviw_succ")
                #     #
                #     #     # 首次开始，不设置当前复习状态，确保发送操作在此进行
                #     #     net_send.send__start_review_card(
                #     #         note,
                #     #         card_set,
                #     #         mw.reviewer.card.note().fields[0]
                #     #     )
                #     #     states.start_review(note, card_set)
                #         # task_putter.put_1s_task(to_reviw)
                # # 延迟执行
                # task_putter.put_timed_task(to_reviw, 30)
                # task_putter.put_1s_task(to_reviw)
                # task_putter\
                #     .put_1s_task(mw.moveToState("review"))\
                #     .put_1s_task(mw.moveToState("review"))

                # tasks.put(lambda: tasks.put())
                # tasks.put(lambda: tasks.put(mw.moveToState("review")))

                # gui_hooks.state_did_change.append(on_change)
                # def start_review():
                #     mw.reviewer.show()
                #     # # mw.col.startTimebox()
                #     # utils.showInfo(mw.state)
                #     # mw.moveToState("review")
                #     # utils.showInfo(mw.state)
                #
                # tasks.put(start_review)
                #

            else:
                fail = True
        else:
            fail = True
    if fail:
        utils.showInfo("note or card_set not exist in anki")


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
                notecheck=mw.col.get_note(newnote.id)
                debug_window.println("note added ?"+str(notecheck.id))
                mw.deckBrowser.show()
            else:
                debug_window.println("note add redo1")
                tasks.put(redo)
            # deckname=deck_tree_root.name+"::"+note_node.name+"::"+card_set_node.name
            # notes = mw.col.find_notes(f'deck:"{deckname}"')
            # for noteId1 in notes:
            #     utils.showInfo(str(mw.col.get_note(noteId1).data)+"\n"+str(mw.col.get_note(noteId1).col))
            # mw.col.after_note_updates()
        else:
            # utils.showInfo("redo push")
            # utils.showInfo("err create node fail")/
            debug_window.println("note add redo2")
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
    debug_window.println("find_or_create_deck_in_node "+str(fnode))
    return fnode


def find_deck_in_node(node: decks.DeckTreeNode, deck_name: str) -> Optional[decks.DeckTreeNode]:
    blank_ids=[]
    for i in range(len(node.children)):
        if node.children[i].name.find('blank')>-1:
            debug_window.println("has blank "+str(node.children[i]))
            blank_ids.append(node.children[i].deck_id)

    mw.col.decks.remove(blank_ids)
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
