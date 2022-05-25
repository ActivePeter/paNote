由于太久没写，发现都忘了一些数据操作的入口了，后面还是规范点写道一起来



### 对笔记数据的操作分为

- 用户操作
- 与文件绑定，实时数据存储
- todo: 复习卡片增加减少修改（需要同步到anki,若未连接anki，需要记录下来，下次连接时同步

## code rule

- 函数的模块化，可以吧一组功能放到一个类下，这个类可持有操作对象
- 

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
        
      - ReviewPartReviewing

        - v-if="review_part_man.reviewing_state.card_id!==''"
        - 
  
    - data
  
      - ReviewPartFunc.ReviewPartManager rpman
        - reviewing_state
          - card_id=""
            - 不为空时，代表正在复习
          - show_answer=false
          - answer_selections:string[]=[]
            - 回答卡片的选项的 **时间备注**
            - //在接收到客户端的answer showned 后修改
          - front_linked_note_ids:any={} //map:string->dum data
            - //正面链接了的卡片,用来在复习模式时，隐藏其余卡片
          - try_start_review_flag=false
            -  //接收到复习卡片组为空时如果该标志位为true.则提示当前卡组没有需要复习的卡片。需要记得清除
          - 
      - mode
      - 
  
  - NoteCanvas ref="note_canvas_ref"
  
    - NoteCanvasTs
  
      - DragBarHelper
  
        文本块的拖拽功能
  
    - NoteCanvas(Comp)
  
      - fn
  
        - editor_bar_set_new_pos(ebid, eb, x, y)
  
          判断是否未拖拽模式并设置坐标
  
          该坐标为 editor_bar 与canvas原点的相对位置，
  
          ​	为canvas参考系（没有缩放）
  
        - 
  
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

- review part 同步到anki策略

  - anki中命名
    - noteid //保证笔记不重名
      - cardset_id //保证卡片组不重名
        - card_id //保证卡片不重名
  - 实现一个变更记录的消息队列，每次有一个变更就往里面加入
    - 方案
      - 如果为删除，则向前查找是否有未发送出去的对应的添加，如果有，将这两项都删除
      - 如果为修改，则向前查找是否有未发送的修改，有则删除之前的
      - 如果为添加，则正常加入
    - 稳定性讨论？（总体来说忽略不计hh
      - 一侧取得变更后，会不会把变更弄丢
        - 在取得后若未将变更输入到anki里那么会弄丢
  - 处理软件被关闭，但还有变更未同步的情况
    - 方案一：将变更队列实时存储在本地，(暂时采取这个吧)
      - 突然关闭，最新变更可能未被保存？
    - 方案二：重新打开需要核对所有数据
      - 核对方法，anki中应该要有数据的id以及变更id，
        - 校验所有数据的变更id
  - 每次复习完将anki的复习进度进行存储，以免后续笔记转移

