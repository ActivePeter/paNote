由于太久没写，发现都忘了一些数据操作的入口了，后面还是规范点写道一起来

### 对笔记数据的操作分为

- 用户操作
- todo: 与文件绑定，实时数据存储
- todo: 复习卡片增加减少修改（需要同步到anki,若未连接anki，需要记录下来，下次连接时同步

## code rule

- 数据与操作分离

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

    - 组件 (这几个部分由v-if来维持，所以当模式切换的时候，之前的组件会销毁)

      - review_cards 模式

        - 显示当前set下所有卡片

      - add_card_set 模式

        - 显示添加卡组界面

      - ```
        （计算值）show_add_new_card_view() {
          return this.mode === ReviewPartFunc.ReviewPartGuiMode.AddNewCard || this.mode === ReviewPartFunc.ReviewPartGuiMode.EditCard
        }
        ```

        - 显示 添加/编辑卡片界面 ReviewPartAddNewCard
          - data
            -  ReviewPartFunc.AddNewCardHelper
          - 组件
            - EditorBarViewList ref="front_list" 卡片正面
            - EditorBarViewList  ref="back_list"  卡片背面

    - data

      - ReviewPartFunc.ReviewPartManager
      - mode
      - 

  - NoteCanvas ref="note_canvas_ref"

  - RightMenu ref="right_menu_ref"

  - 

  数据

  - AppFunc.Context
    - app
    - cur_open_note_id
    - storage_manager=new Storage.StorageManager()
  - 

## context传递

优先）子组件向父组件请求

```typescript
export const request_for_conttext=(vueobj:any,cb:(ctx:Context)=>void)=>{
    vueobj.$emit("request_for_conttext",cb)
}
```



### 运行流程

- 实时存储

  - 过10秒检查是否发生变更(new_edit)

    - 若变更，调用storage manager的save2file

  - 存储方式

    - 先通过storage存入buffer

    - 一系列操作完成后，设置标志位，等待扫描存储

      ```typescript
      ctx.storage_manager.buffer_save_note_reviewinfo(rpman.note_id,rpman.card_set_man)
      ctx.get_notelist_manager()?.pub_set_note_newedited_flag(rpman.note_id)
      ```

- 笔记数据修改后，调用NoteCanvasTs.ContentManager的backend函数

  - backend根据是否绑定文件进行决策
    - 无论是否绑定，都会将数据存入缓存
    - 若绑定，会将new_edit标志置为true。

- 初始化加载

  - app 下存储context，作为全局的上下文

