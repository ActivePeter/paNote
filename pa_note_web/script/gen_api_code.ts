
import {lan} from "./paTools/ts/lan_maker"
import {AppFuncTs} from "../src/logic/AppFunc";

class ApiDiscription{

    constructor(public name:string,
                public args:any,public reply:any,public need_authority:boolean) {}
}
const apis=[
    new ApiDiscription(
        "get_notes_mata",//获取笔记列表，{id, name}[]
        {},
        {
            node_id_name_list:new lan.ValueType(lan.BasicValueType.Array)},
        false
        ),

    new ApiDiscription(
        "get_note_mata",//获取笔记元数据信息，获取区块范围，下一个笔记的id
        {
            noteid:new lan.ValueType(lan.BasicValueType.String)
        },
        {
            next_noteid:new lan.ValueType(lan.BasicValueType.Int),
            max_chunkx:new lan.ValueType(lan.BasicValueType.Int),
            max_chunky:new lan.ValueType(lan.BasicValueType.Int),
            min_chunkx:new lan.ValueType(lan.BasicValueType.Int),
            min_chunky:new lan.ValueType(lan.BasicValueType.Int),
        },
        false
    ),
    new ApiDiscription(
        "get_chunk_note_ids",//获取一个区块范围内的笔记id
        {
            noteid:new lan.ValueType(lan.BasicValueType.String),
            chunkx:new lan.ValueType(lan.BasicValueType.Int),
            chunky:new lan.ValueType(lan.BasicValueType.Int)
        },
        {
            noteids:new lan.ValueType(lan.BasicValueType.Array)
        },false
    ),
    new ApiDiscription(
        "get_note_bar_info",
        {
            noteid:new lan.ValueType(lan.BasicValueType.String),
            notebarid:new lan.ValueType(lan.BasicValueType.String)
        },
        {
            x:new lan.ValueType(lan.BasicValueType.Float),
            y:new lan.ValueType(lan.BasicValueType.Float),
            w:new lan.ValueType(lan.BasicValueType.Float),
            h:new lan.ValueType(lan.BasicValueType.Float),
            text:new lan.ValueType(lan.BasicValueType.String),
            formatted:new lan.ValueType(lan.BasicValueType.String),
            connected:new lan.ValueType(lan.BasicValueType.Array),//[id1,id2...]
        },false
    ),
    new ApiDiscription(
        "create_new_note",
        {},
        {},true
    ),
    new ApiDiscription(
        "create_new_bar",
        {
            noteid:new lan.ValueType(lan.BasicValueType.String),
            x:new lan.ValueType(lan.BasicValueType.Float),
            y:new lan.ValueType(lan.BasicValueType.Float),
        },
        {//更新 noteids列表
            chunkx:new lan.ValueType(lan.BasicValueType.Int),
            chunky:new lan.ValueType(lan.BasicValueType.Int),
            noteids:new lan.ValueType(lan.BasicValueType.Array)
        },true
    ),
    new ApiDiscription(
        "update_bar_content",
        {
            noteid:new lan.ValueType(lan.BasicValueType.String),
            barid:new lan.ValueType(lan.BasicValueType.String),
            text:new lan.ValueType(lan.BasicValueType.String),
            formatted:new lan.ValueType(lan.BasicValueType.String),
        },{

        },true
    ),
    new ApiDiscription(
        "update_bar_transform",
        {
            noteid:new lan.ValueType(lan.BasicValueType.String),
            barid:new lan.ValueType(lan.BasicValueType.String),
            x:new lan.ValueType(lan.BasicValueType.Float),
            y:new lan.ValueType(lan.BasicValueType.Float),
            w:new lan.ValueType(lan.BasicValueType.Float),
            h:new lan.ValueType(lan.BasicValueType.Float),
        },{//移动可能导致区块范围变化
            chunk_maxx:new lan.ValueType(lan.BasicValueType.Int),
            chunk_minx:new lan.ValueType(lan.BasicValueType.Int),
            chunk_maxy:new lan.ValueType(lan.BasicValueType.Int),
            chunk_miny:new lan.ValueType(lan.BasicValueType.Int),
            chunk_change:new lan.ValueType(lan.BasicValueType.Array)//从区块0->区块1
        },true
    ),
    new ApiDiscription(
        "redo",
        {
            noteid:new lan.ValueType(lan.BasicValueType.String),
        },{//移动可能导致区块范围变化
            redotype:new lan.ValueType(lan.BasicValueType.String),
            redovalue:new lan.ValueType(lan.BasicValueType.Obj),
        },true
    ),
    new ApiDiscription(
        "add_path",
        {
            noteid:new lan.ValueType(lan.BasicValueType.String),
            from:new lan.ValueType(lan.BasicValueType.String),
            to:new lan.ValueType(lan.BasicValueType.String)
        },{
        },true
    ),
    new ApiDiscription(
        "get_path_info",
        {
            noteid:new lan.ValueType(lan.BasicValueType.String),
            pathid_with_line:new lan.ValueType(lan.BasicValueType.String),
        },{
            type_:new lan.ValueType(lan.BasicValueType.Int)
        },false
    ),
    new ApiDiscription(
        "set_path_info",
        {
            noteid:new lan.ValueType(lan.BasicValueType.String),
            pathid_with_line:new lan.ValueType(lan.BasicValueType.String),
            type_:new lan.ValueType(lan.BasicValueType.Int)
        },{
        },true
    ),
    new ApiDiscription(
        "remove_path",
        {
            noteid:new lan.ValueType(lan.BasicValueType.String),
            pathid_with_line:new lan.ValueType(lan.BasicValueType.String),
        },{
        },true
    ),
    new ApiDiscription(
        "delete_bar",
        {
            noteid:new lan.ValueType(lan.BasicValueType.String),
            barid:new lan.ValueType(lan.BasicValueType.String),
        },{
            chunk_maxx:new lan.ValueType(lan.BasicValueType.Int),
            chunk_minx:new lan.ValueType(lan.BasicValueType.Int),
            chunk_maxy:new lan.ValueType(lan.BasicValueType.Int),
            chunk_miny:new lan.ValueType(lan.BasicValueType.Int),
        },true
    ),
    new ApiDiscription(
        "login",
        {
            id:new lan.ValueType(lan.BasicValueType.String),
            pw:new lan.ValueType(lan.BasicValueType.String),
        },{
            if_success:new lan.ValueType(lan.BasicValueType.Int),
            token:new lan.ValueType(lan.BasicValueType.String)
        },false
    ),
    new ApiDiscription(
        "verify_token",
        {
            token:new lan.ValueType(lan.BasicValueType.String),
        },{
            if_success:new lan.ValueType(lan.BasicValueType.Int),
            new_token:new lan.ValueType(lan.BasicValueType.String),
        },false
    ),
    new ApiDiscription(
        "article_binder",
        {
            bind_unbind_rename:new lan.ValueType(lan.BasicValueType.String),
            article_name:new lan.ValueType(lan.BasicValueType.String),
            barid:new lan.ValueType(lan.BasicValueType.String),
            noteid:new lan.ValueType(lan.BasicValueType.String)
        },{
            if_success:new lan.ValueType(lan.BasicValueType.Int),
        },true
    ),
    new ApiDiscription(
        "article_list",
        {
            noteid:new lan.ValueType(lan.BasicValueType.String)
        },{
            if_success:new lan.ValueType(lan.BasicValueType.Int),
            list:new lan.ValueType(lan.BasicValueType.Array)
        },false
    ),
]



const fs = require("fs")

function apiname_to_arg_name(name:string){
    return lan.to_UpperCamelCase(name)+"Arg"
}
function apiname_to_future_name(name:string){
    return lan.to_UpperCamelCase(name)+"Future"
}
function apiname_to_msgtype(name:string){
    return "Msg"+lan.to_UpperCamelCase(name)
}
function apiname_to_reply(name:string){
    return lan.to_UpperCamelCase(name)+"Reply"
}

function gen_api_caller(){
    let node=new lan.Node_Some()
        //new ts.TsCodeNode_Interface("IApis")

    //接口
    apis.forEach((api)=>{
        let preif=""
        let sufif=""
        if(api.need_authority){
            preif="if(AppFuncTs.get_ctx().authority_man.is_logged_in()){"
            sufif="}"
        }
        node.add_func(
            new lan.Node_Func(api.name)
                .add_arg(new lan.Node_Arg(
                    "arg",apiname_to_arg_name(api.name)
                )).add_arg(new lan.Node_Arg(
                "cb","(reply:"+apiname_to_reply(api.name)+")=>void"
                ))
                .set_body("{"+preif+" this.get_icommu().send_obj(" +
                    "{msg_type:'Msg"+lan.to_UpperCamelCase(api.name)+"',msg_value:arg},cb) "+sufif+" }")
        )
    })

    //参数类型
    let classes_node=new lan.Node_Some()
    apis.forEach((api)=>{
        let c=new lan.Node_Class(
            lan.to_UpperCamelCase(api.name)+"Arg"
        )
        for (let key in api.args){
            c.add_value(key,api.args[key])
        }
        classes_node.add_class(c)
    })

    //返回值类型
    apis.forEach((api)=>{
        let c=new lan.Node_Class(
            apiname_to_reply(api.name)
        )
        for (let key in api.reply){
            c.add_value(key,api.reply[key])
        }
        classes_node.add_class(c)
    })
    let write=""
    fs.readFile("./template_api_caller.ts","utf8",
        (err:any,content:string)=>{
        write=content.replace("[target]",node.to_ts_string()).replace("[api_classes]",classes_node.to_ts_string());
        // console.log(write);

            fs.writeFile("../src/logic/commu/api_caller.ts",write,()=>{});
    })


}
function gen_rust_msg_distribute(){
    let typesnode=new lan.Node_Some();
    apis.forEach((api)=>{
        typesnode.add_node(new lan.Node_Text("#[derive(Serialize, Deserialize, Debug)]"))
        let c=new lan.Node_Class(apiname_to_arg_name(api.name))
        for (let key in api.args){
            c.add_value(key,api.args[key])
        }
        typesnode.add_node(c)
    })

    //reply 类型
    apis.forEach((api)=>{
        typesnode.add_node(new lan.Node_Text("#[derive(Serialize, Deserialize, Debug)]"))
        let c=new lan.Node_Class(apiname_to_reply(api.name))
        for (let key in api.reply){
            c.add_value(key,api.reply[key])
        }
        typesnode.add_node(c)
    })

    typesnode.add_node(new lan.Node_Text("pub trait ApiHandler{\n"));
    apis.forEach((api)=>{
        typesnode.add_node(new lan.Node_Text(
            "    type "+apiname_to_future_name(api.name)+": Future<"+'Output=()'+">;\n" +
            "    fn api_"+api.name+"(&self,arg:"+apiname_to_arg_name(api.name)+",taskid:String,sender:ToClientSender)->Self::"+apiname_to_future_name(api.name)+";\n" ))
    })
    typesnode.add_node(new lan.Node_Text("}\n"));

    let switchnode=new lan.Node_Some();
    apis.forEach((api)=>{
        switchnode.add_node(new lan.Node_Some()
            .add_node(new lan.Node_Text('"'+apiname_to_msgtype(api.name)+"\"=>{"))
            .add_node(new lan.Node_Text(
                "let (value,taskid)=get_obj_and_taskid(msg_value);"+
                "            let arg=serde_json::from_value::<"+apiname_to_arg_name(api.name)+">(value);\n" +
                "            if let Ok(arg)=arg{\n" +
                "                 NoteManager::get().api_"+api.name+"(\n" +
                "                     arg,taskid,sender\n" +
                "                 ).await;\n" +
                "            }" ))
            .add_node(new lan.Node_Text("}")))
    })

    let write=""
    fs.readFile("./template_gen_distribute.rs","utf8",
        (err:any,content:string)=>{
            write=content
                .replace("[types]",typesnode.to_rs_string())
                .replace("[switches]",switchnode.to_rs_string());
                // .replace("[api_classes]",classes_node.to_ts_string());
            // console.log(write);

            fs.writeFile("../pa_note_server/src/gen_distribute.rs",write,()=>{});
        })
}
function gen_rust_send_funcs(){
    let sendfuncs=""
    apis.forEach((api)=>{

        sendfuncs+="pub async fn send_"+api.name+"_reply(mut sender:ToClientSender, taskid:String, reply:gen_distribute::"+apiname_to_reply(api.name)+"){\n" +
            "    let mut obj=Map::new();\n" +
            "    obj.insert(\"msg_type\".to_string(),serde_json::Value::String(\""+apiname_to_reply(api.name)+"\".to_string()));\n" +
            "    obj.insert(\"msg_value\".to_string(),serde_json::to_value(reply).unwrap());\n" +
            "    obj.insert(\"taskid\".to_string(),serde_json::Value::String(taskid));"+
            "    sender.send(&obj).await;\n" +
            "}\n"
    })

    fs.readFile("./template_gen_send.rs","utf8",
        (err:any,content:string)=>{
            let write=content
                .replace("[send_funcs]",sendfuncs)
            // .replace("[api_classes]",classes_node.to_ts_string());
            // console.log(write);

            fs.writeFile("../pa_note_server/src/gen_send.rs",write,()=>{});
        })
}

gen_api_caller()
gen_rust_msg_distribute()
gen_rust_send_funcs()
