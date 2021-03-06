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

- ~~画布拖拽~~

- ~~内部元素拖拽~~

  - ~~拖拽后面板区域也要实时更新~~

  - ~~添加内部元素~~

  - ~~拖拽，连线，模式切换~~

- ~~控件的辅助按钮~~

- ~~.连线（先直线）~~

  - [ ] 线条样式
  - [ ] 线条换成rotation来表现倾斜
  - [ ] 删除连线
  - [ ] 鼠标在线条上时提供连接块的跳转和预览

- ~~鼠标中心缩放~~

  - [ ] 偏离原点时存在误差问题

- 搜索功能

  - 

- 右键菜单

  - [x] ~~删除~~

  - [x] 点击判断，若发生移动则不触发

    _PaUtilTs.MouseDownUpRecord

  - [ ] 美化

- 3.anki插件（pa）

  - [ ] 卡片组
    - [x] 卡片组创建
    
    - [x] 卡片创建
    
    - [ ] 卡片右键菜单
      - [x] 删除
      - [x] 编辑
      
    - [x] 卡片存储
    
    - [ ] 卡片数据同步到anki
    
      - [x] 添加删除卡片
    
        ![](./resource/sync_2_anki_operation.gif)
    
    - [x] 复习卡片

- 多个笔记

- 4.内部元素的具体内容：~~editor.js（ad）~~
  - ~~quill~~
  - ~~类似命令行的舒服的格式化方式~~
    - [ ] 列表
    - [x] 缩进
    - [ ] 加粗
    - [x] 标题
    - [x] 下划线
    - [x] 代码块切换
    - [ ] 文本样式
      - [ ] 调色
    - [ ] 背景色调色
  
- 5.存储（先本地（electron））

  - [x] ~~暂用localstorage（假装存储）~~ 已废弃

  - [x] 与本地文件绑定，自动存储

    ![](./resource/sync_2_file.gif)

  - [x] 从本地文件加载，

    - [x] 无效文件会询问是否创建为新笔记

      ![](./resource/load_invaild_file.gif)

    - [x] 若当前笔记列表内笔记与打开文件未绑定，会询问将笔记文件加载到新的笔记中，避免冲突

      ![](./resource/conflict_file_bind.gif)

  - [x] 笔记的卡片数据存储

- 7.每天编辑历史

- 8.前后端（云端存储）

