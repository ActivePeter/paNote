import sys
from PyQt5.QtWidgets import QApplication, QWidget, QDesktopWidget, QTextEdit, \
    QPushButton, QHBoxLayout, QVBoxLayout, QLabel, QMessageBox, QShortcut
from PyQt5.QtGui import QKeySequence
from aqt import mw, utils


class AnotherWindow(QWidget):
    """
    This "window" is a QWidget. If it has no parent, it
    will appear as a free-floating window as we want.
    """

    def __init__(self):
        super().__init__()
        layout = QVBoxLayout()
        self.label = QLabel("Another Window")
        layout.addWidget(self.label)
        self.setLayout(layout)


# 继承QWidget
class TextEditWidget(QWidget):
    text_edit = None

    def __init__(self):
        super().__init__()
        self.init_ui()

    def init_ui(self):
        # 垂直布局
        v_box = QVBoxLayout()
        # 建议
        suggest_box = QHBoxLayout()
        self.text_edit = QTextEdit()
        self.text_edit.setPlaceholderText("你的建议，是我们前进的动力")
        suggest_box.addWidget(QLabel("建议:"))
        suggest_box.addWidget(self.text_edit)
        suggest_box.setStretch(1, 1)
        v_box.addLayout(suggest_box)
        # 复制、粘贴、清空和提交按钮
        button_box = QHBoxLayout()
        copy_btn = QPushButton("复制")
        copy_btn.clicked.connect(self.copy)
        paste_btn = QPushButton("粘贴")
        paste_btn.clicked.connect(self.paste)
        clear_btn = QPushButton("清空")
        clear_btn.clicked.connect(self.clear)
        submit_btn = QPushButton("提交")
        submit_btn.clicked.connect(self.submit)
        button_box.addWidget(copy_btn)
        button_box.addWidget(paste_btn)
        button_box.addWidget(clear_btn)
        button_box.addWidget(submit_btn)
        button_box.addWidget(QLabel(), 1)
        button_box.setContentsMargins(40, 0, 0, 0)
        v_box.addLayout(button_box)
        self.setLayout(v_box)
        # 调整窗口大小
        self.resize(900, 500)
        # 窗口居中
        self.center()
        # 窗口标题
        self.setWindowTitle("Debug")
        # 显示窗口
        self.show()

    # 拷贝
    def copy(self):
        text = self.text_edit.toPlainText()
        # 剪切板的文本
        clipboard = QApplication.clipboard()
        clipboard.setText(text)

    # 粘贴
    def paste(self):
        # 剪切板的文本
        clipboard = QApplication.clipboard()
        # 以Html的格式输出多行文本框，字体红色，字号6号
        self.text_edit.setHtml(clipboard.text())

    # 清空
    def clear(self):
        self.text_edit.clear()

    # 提交
    def submit(self):
        text = self.text_edit.toPlainText()
        if text.strip() == "":
            self.text_edit.setFocus()
            QMessageBox.warning(self, "内容为空",
                                "建议空空如也,请输入你的宝贵意见",
                                QMessageBox.Ok)
        else:
            QMessageBox.information(self, "提交成功",
                                    "你的宝贵意见,我们收到了，谢谢你",
                                    QMessageBox.Ok)

    # 实现居中
    def center(self):
        f = self.frameGeometry()
        c = QDesktopWidget().availableGeometry().center()
        f.moveCenter(c)
        self.move(f.topLeft())


window = None
shot = None
button = None
content = ""


def _window_sync():
    global content
    if window is not None:
        window.text_edit.setHtml(content)

def println(line: str):
    global content
    content += line + "<br>"
    # utils.showInfo("debug "+line)
    _window_sync()


def on_debug_show():
    global window, content
    # utils.showInfo("show debug")
    if window is None:
        window = TextEditWidget()

    _window_sync()
    window.show()


def init():
    global window, button
    button = QPushButton("sign_up", mw)
    button.show()
    button.setGeometry(-100,-100,0,0)
    # button.setVisible(False)
    button.setShortcut(QKeySequence('Alt+D, Alt+B'))
    button.clicked.connect(on_debug_show)
    # shot.activated.connect(on_debug_show)
    window = TextEditWidget()
    # on_debug_show()
    println("hhhhhh")
