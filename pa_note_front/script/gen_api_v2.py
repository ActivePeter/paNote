import os
import yaml

# ROOT_DIR="../../pa_note_server_waverless"
ROOT_DIR="../../../../waverless/apps"

def type_to_ts_type(type):
    if type == "Int":
        return "number"

    elif type == "String":
        return "string"

    elif type == "Array":
        return "any[]"

    elif type == "Float":
        return "number"

    elif type == "Bool":
        return "boolean"

    elif type == "Obj":
        return "any"

# Int, String, Array, Float, Bool, Obj
def type_to_rust_type(type):
    if type == "Int":
        return "i32"
    elif type == "String":
        return "String"
    elif type == "Array":
        return "Vec<serde_json::Value>"
    elif type == "Float":
        return "f32"
    elif type == "Bool":
        return "boolean"
    elif type == "Obj":
        return "any"

def snake_to_big_camel(snake_case_str):
    words = snake_case_str.split('_')
    return ''.join(word.capitalize() for word in words)


# 读取配置文件
def read_config(config_file):
    with open(config_file, 'r', encoding='utf-8') as f:
        config = yaml.safe_load(f)
    return config

# 生成 trait 方法签名
def generate_trait_method(endpoint, details):
    struct_name = snake_to_big_camel(endpoint)
    method_name = endpoint
    request_type = struct_name + "Req"
    response_type = struct_name + "Resp"
    return f"fn {method_name}(&self,req: {request_type}) -> {response_type};\n"

# 生成函数实现
def generate_function_impl(endpoint, details):
    struct_name = snake_to_big_camel(endpoint)
    method_name = endpoint
    request_type = struct_name + "Req"
    response_type = struct_name + "Resp"
    # // Deserialize to VerifyTokenReq as req
    # if let Ok(req) = serde_json::from_str::<VerifyTokenReq>(&json_str) {
    #     let resp = GroupAuthApiImpl.verify_token(req);
    #     // Serialize resp to str
    #     // Forget memory
    #     let resp_str = ManuallyDrop::new(serde_json::to_string(&resp).unwrap());
    #     // Return bytes ptr and len
    #     (resp_str.as_ptr() as i32, resp_str.len() as i32)
    # } else {
    #     // Return bytes ptr and len
    #     (0, 0)
    # }
    return f"#[no_mangle]\n" \
        f"fn {method_name}(http_json_ptr: i32, http_json_len: i32) {{\n" \
        f"    let json_str = unsafe {{ String::from_raw_parts(http_json_ptr as *mut u8, http_json_len as usize, http_json_len as usize) }};\n" \
        f"    if let Ok(req) = serde_json::from_str::<{request_type}>(&json_str) {{\n" \
        f"        let resp = Impl.{method_name}(req);\n" \
        f"        let resp_str = serde_json::to_string(&resp).unwrap();\n"\
        f"        unsafe {{ write_result(resp_str.as_ptr(), resp_str.len() as i32) }}\n"\
        f"    }}\n" \
        f"}}\n"


# 根据配置生成 Rust 代码
def generate_rust_code(config, group):
    group_config = config[group]
    group=group[6:]
    request_structs = []
    for endpoint, details in group_config.items():
        # BigCamel
        struct_name = snake_to_big_camel(endpoint)+"Req"
        fields=[]
        if details['req'] is not None:
            for field_name in details['req']:
                field_type = details['req'][field_name]
                fields.append(f"pub {field_name}: {type_to_rust_type(field_type)}")

        fields= ", ".join(fields)
        request_struct = f"#[derive(Debug, Serialize, Deserialize, Default)]\n"+\
            f"pub struct {struct_name} {{ {fields} }}\n"
        request_structs.append(request_struct)
    
    response_structs = []
    for endpoint, details in group_config.items():
        struct_name = snake_to_big_camel(endpoint) + "Resp"
        fields=[]
        if details['resp'] is not None:
            for field_name in details['resp']:
                field_type = details['resp'][field_name]
                fields.append(f"pub {field_name}: {type_to_rust_type(field_type)}")
        fields= ", ".join(fields)
        response_struct = f"#[derive(Debug, Serialize, Deserialize, Default)]\n"+\
            f"pub struct {struct_name} {{ {fields} }}\n"
        response_structs.append(response_struct)

    # 写入结构体文件
    with open(f"{ROOT_DIR}/panote_{group}/src/struct.rs", 'w') as f:
        f.write("use serde::{Serialize, Deserialize};\n")
        f.write("// Requests\n")
        for req_struct in request_structs:
            f.write(req_struct)
        f.write("\n// Responses\n")
        for resp_struct in response_structs:
            f.write(resp_struct)

    trait_methods = ""
    function_impls = ""
    for endpoint, details in group_config.items():
        trait_methods += generate_trait_method(endpoint, details)
        function_impls += generate_function_impl(endpoint, details)

    # 写入 lib.rs 文件
    with open(f"{ROOT_DIR}/panote_{group}/src/lib.rs", 'w') as f:
        f.write("use serde_json;\n")
        f.write("use serde_json::Value;\n")
        f.write("use std::mem::ManuallyDrop;\n")
        f.write("use wasm_serverless_lib::*;\n")
        f.write("mod r#struct;\n")
        f.write("mod r#impl;\n")
        f.write("use r#struct::*;\n\n")
        f.write(f"trait {snake_to_big_camel(group)}Api {{\n")
        f.write(f"{trait_methods}")
        f.write("}\n\n")
        f.write("pub struct Impl;\n\n")
        f.write(f"{function_impls}")

def generate_toml(group):
    toml=f'''
        [package]
        name = "panote_{group}"
        version = "0.1.0"
        edition = "2021"

        # See more keys and their definitions at https://doc.rust-lang.org/cargo/reference/manifest.html
        [lib]
        crate-type = ["cdylib"]

        [dependencies]
        wasmedge-bindgen = "0.4.1"
        wasmedge-bindgen-macro = "0.4.1"
        wasm-bindgen = "0.2.74"
        wasm_serverless_lib = {{ path = "../_wasm_serverless_lib" }}
        wasmedge-wasi-helper = "=0.2.0"
        serde = {{ version = "1.0", features = ["derive"] }}
        serde_json = "1.0"
    '''
    with open(f"{ROOT_DIR}/panote_{group}/Cargo.toml", 'w') as f:
        f.write(toml)

def generate_app_config(config,group):
    # fns:
    #     fn2:
    #         event:
    #         - http_app: 
    #         args:
    #         - http_text:   
    fns={}
    group_config = config[group]
    group=group[6:]
    for endpoint, details in group_config.items():
        fns[endpoint]={
            "event": [{"http_fn":None}],
            "args": [{"http_text":None}]
        }
    # write to app.yaml
    with open(f"{ROOT_DIR}/panote_{group}/app.yaml", 'w') as f:
        yaml.dump({"fns":fns}, f)


# 创建 Rust 项目文件夹
def create_project_folders(config):
    for group in config.keys():
        
        folder_name = f"{ROOT_DIR}/panote_{group[6:]}/src"
        os.makedirs(folder_name, exist_ok=True)
        generate_rust_code(config, group)
        generate_toml(group[6:])
        generate_app_config(config,group)




def generate_ts_api(config):
    structs=""

    for group in config.keys():
        group_config = config[group]
        group=group[6:]
        # request_structs = []
        # reply class
        for endpoint, details in group_config.items():
            # BigCamel
            struct_name = snake_to_big_camel(endpoint)+"Arg"
            fields=[]
            if details['req'] is not None:
                for field_name in details['req']:
                    field_type = details['req'][field_name]
                    fields.append(f"public {field_name}: {type_to_ts_type(field_type)}")

            fields= ", ".join(fields)
            request_struct = f"export class {struct_name} {{ constructor({fields}){{}} }}\n"
            structs+=(request_struct)
        
        # arg class
        for endpoint, details in group_config.items():
            struct_name = snake_to_big_camel(endpoint) + "Reply"
            fields=[]
            if details['resp'] is not None:
                for field_name in details['resp']:
                    field_type = details['resp'][field_name]
                    fields.append(f"public {field_name}: {type_to_ts_type(field_type)}")
            fields= ", ".join(fields)
            response_struct = f"export class {struct_name} {{ constructor({fields}){{}} }}\n"
            structs+=response_struct

    # apis
    apis=""
    for group in config.keys():
        group_config = config[group]
        group=group[6:]
        # request_structs = []
        # reply class
        for endpoint, details in group_config.items():
            apis+=f'''
                {endpoint}(arg:{snake_to_big_camel(endpoint)}Arg,cb:(reply:{snake_to_big_camel(endpoint)}Reply)=>void){{
                    axios.post<{snake_to_big_camel(endpoint)}Reply>(ROOT_PATH + '/panote_{group}/{endpoint}',arg).then((resp:any)=>{{
                        cb(resp.data)
                    }})
                }}
                '''

    # 写入../src/logic/commu/api_caller2.ts
    with open(f"../src/logic/commu/api_caller.ts", 'w') as f:
        f.write("import axios from 'axios'\n")
        f.write("import {ROOT_PATH} from './server'\n")
        f.write(structs)
        f.write(f'''
        export class ApiCaller{{
            init_web(on_commu_established:()=>void){{
                setTimeout(on_commu_established,500)
            }}
            {apis}
        }}
        ''')


# 主函数
def main():

    config_file = 'apis.yaml'
    config = read_config(config_file)
    generate_ts_api(config)
    # create_project_folders(config)

if __name__ == "__main__":
    main()
