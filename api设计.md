由于太久没写，发现都忘了一些数据操作的入口了，后面还是规范点写道一起来

### 对笔记数据的操作分为

- 用户操作
- todo: 与文件绑定，实时数据存储
- todo: 复习卡片增加减少修改（需要同步到anki,若未连接anki，需要记录下来，下次连接时同步

### 结构

- ipcapi

  - start_choose_file_bind
  - 

- App

  组件

  - NoteList ref="note_list_ref"

    - 组件

      - notelistbar

        - 数据

          - note_list_bar_helper:new NoteListFunc.NoteListBarHelper(),
            - 获取右键菜单
          - id //prop noteid

          

    - 数据

      - notelist_manager //与笔记操作相关的
        - 数据
          - pub_notes:{} 
          - //noteid->{
            - name: 
            - bind_file:
            - new_edit}//bind之后的第一次以及后续修改都会将其改为true。否则无视
          - next_id
        - 函数
          - async open_note

  - ReviewPart

  - NoteCanvas ref="note_canvas_ref"

  - RightMenu ref="right_menu_ref"

  - 

  数据

  - AppFunc.Context
    - app
    - cur_open_note_id
    - storage_manager=new Storage.StorageManager()
  - 

### 运行流程

- 实时存储
  - 过10秒检查是否发生变更(new_edit)
    - 若变更，调用storage manager的save2file
- 笔记数据修改后，调用NoteCanvasTs.ContentManager的backend函数
  - backend根据是否绑定文件进行决策
    - 无论是否绑定，都会将数据存入缓存
    - 若绑定，会将new_edit标志置为true。
- 初始化加载
  - 

