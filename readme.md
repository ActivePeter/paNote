## panote

![image-20220309214521213](https://hanbaoaaa.xyz/tuchuang/images/2022/03/09/image-20220309214521213.png)

考研途中发现笔记软件总是没法完全满足我的需要

- marginnote这类的笔记软件可以较好的整理思路框架

  1 其复习卡片的功能做的过于鸡肋，也没有anki好用

  2 marginnote的布局会自己变动, 不利于位置记忆和复盘

- anki有较好的复习策略，但是平台限制 以及 笔记形式太局限

---

In the process of  preparing for the Postgraduate entrance examination, the note apps always can't fit my requirements

-  Note softwares like marginnote can help us  organize the frame of mind
  - but its review card function does not work as well as anki's
  - the layout of marginnote changes itself, which is not good for position memory
- 



#### 目前构思/Current design

- 笔记形式采取类似marginnote的
- 创建记忆卡片需要变得更加无缝，
  - 可以直接将笔记的分块拖入卡片
  - 也可以直接将某个笔记快变成卡片标题
- 卡片标签继承自笔记块，筛选的时候可以利用标签筛选

----

- We took the similar note format of marginnote
- The process of creating review card should be more fluent
  - Available to drag the note bar into a card
  - Available to turn a note bar into a card's title
- Card's tag should be extended from note bar，(tag will be used for filtrate the review card)



#### 目前最大的瓶颈/The biggest bottleneck right now

- Anki的算法比较难啃，暂时考虑用插件的形式来做

---

- It's hard to reproduce the anki's review algorithm. (anki-addon is the temporary solution



#### Todo

- ~~1.画布拖拽~~
- ~~2.内部元素拖拽~~
- ~~2.1拖拽后面板区域也要实时更新~~
- ~~2.2添加内部元素~~
- ~~2.3拖拽，连线，模式切换~~
- ~~2.4控件的辅助按钮~~
- ~~6.连线（先直线）~~
- ~~鼠标中心缩放~~
- 7右键菜单
  - ~~删除~~
- 3.anki插件（pa）
  - 卡片组
- 多个笔记
- 4.内部元素的具体内容：~~editor.js（ad）~~
  - ~~quill~~
  - ~~类似命令行的舒服的格式化方式~~
    - [x] 列表
    - [x] 缩进
    - [x] 加粗
    - [x] 标题
    - [x] 下划线
    - [x] 代码块切换
- 5.存储（先本地（electron））
  - ~~暂用localstorage（假装存储）~~
- 7.每天编辑历史
- 8.前后端（云端存储）

