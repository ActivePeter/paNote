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

      - notelist_manager
        - pub_notes:{} 
          - //noteid->{name: bind_file:}
        - next_id

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
  - 过10秒检查是否发生变更
- 笔记数据修改后，调用NoteCanvasTs.ContentManager的backend函数
  - backend根据是否绑定文件进行决策

