### chdir
import os
import sys
import yaml
import zipfile

CUR_FPATH = os.path.abspath(__file__)
CUR_FDIR = os.path.dirname(CUR_FPATH)
# chdir to the directory of this script
os.chdir(CUR_FDIR)

# os.system('ansible-playbook -vv 2.ans_install_build.yml -i ../local_ansible_conf.ini')
### utils
def os_system_sure(command):
    print(f"Run：{command}\n")
    result = os.system(command)
    if result != 0:
        print(f"\nFail：{command}\n\n")
        exit(1)
    print(f"\nSucc：{command}\n\n")


# result.returncode
# result.stdout
def run_cmd_return(cmd):
    print(f"Run：{cmd}\n")
    result = subprocess.run(command, shell=True, capture_output=True, text=True)
    print(f"\nStdout：{result.stdout}\n\n")
    return result


def print_title(title):
    print(f"\n\n>>> {title}")
#################################################################################################



def find_java_app_jar(app):
    if os.path.exists(f"{app}/target"):
        for file in os.listdir(f"{app}/target"):
            if file.endswith(".jar"):
                return f"{app}/target/{file}"

    
    def search_files(directory, target_file):
        found_files = []
    
        try:
            for entry in os.scandir(directory):
                if entry.name == target_file:
                    found_files.append(entry.path)
                elif entry.is_dir():
                    found_files.extend(search_files(entry.path, target_file))
        except PermissionError:
            print(f"Permission denied: {directory}")
        
        return found_files
    # 示例用法
    might_be_jar_dirs=search_files(app, "target")
    print(might_be_jar_dirs)
    def check_main_class_in_jar(jar_path):
        try:
            with zipfile.ZipFile(jar_path, 'r') as jar:
                if 'META-INF/MANIFEST.MF' in jar.namelist():
                    with jar.open('META-INF/MANIFEST.MF') as manifest:
                        for line in manifest:
                            if b'Main-Class' in line:
                                return True
        except zipfile.BadZipFile:
            print(f"Bad JAR file: {jar_path}")
        return False
    for dir in might_be_jar_dirs:
        for file in os.listdir(dir):
            if file.endswith(".jar"):
                if check_main_class_in_jar(f"{dir}/{file}"):
                    return f"{dir}/{file}"

    
    print("!!! can't find jar file",app)
    exit(1)

def cp_app_program(prj_dir,app,target_dir):
    if os.path.exists(f"{prj_dir}/target/wasm32-wasi/release/{app}.wasm"):
        src= f"{prj_dir}/target/wasm32-wasi/release/{app}.wasm"
        tar= f"{target_dir}/{app}/app.wasm"
    elif os.path.exists("pom.xml"):
        src=find_java_app_jar(app)
        tar=f"{target_dir}/{app}/app.jar"
    else:
        print("can't find app program",prj_dir,app)
        exit(1)
    os_system_sure(f"cp {src} {tar}")


def pack_app(prj_dir,app,prjyml,target_dir):
    print_title(f"pack {prj_dir} {app}")
    os_system_sure(f"mkdir -p {target_dir}/{app}")
    app_yml={"fns":prjyml[app]}
    # write to app.yml
    with open(f"{target_dir}/{app}/app.yml", "w") as f:
        f.write(yaml.dump(app_yml))
    # cp program
    cp_app_program(prj_dir,app,target_dir)
    


def pack_prj(prj_dir,target_dir):
    # prj_dir=os.path.abspath(f"../../demos/{app}")
    os.chdir(prj_dir)
    # check Cargo.toml in the current directory
    if os.path.exists("Cargo.toml"):
        os_system_sure("cargo build --target wasm32-wasi --release")
    elif os.path.exists("pom.xml"):
        os_system_sure("mvn clean package")
    else:
        print("unknown project type",prj_dir)
        return
    
    if os.path.exists("files"):
        os.system(f"cp -r files/* {target_dir}/files")
    
    # read app.yml
    def open_prj_conf():
        try:
            with open("app.yml", "r") as f:
                return f.read()
        except:
            with open("app.yaml", "r") as f:
                return f.read()
    conf = yaml.safe_load(open_prj_conf())
    
    for app in conf:
        pack_app(prj_dir,app,conf,f"{target_dir}/apps")

if len(sys.argv)!=2:
    print("Usage: pack_backend.py <app path>")
    exit(1)

prj_dir=sys.argv[1]
prj_dir=os.path.abspath(prj_dir)
target_dir=os.path.abspath("./")

os_system_sure("mkdir -p files")
os_system_sure("mkdir -p apps")
pack_prj(prj_dir,f"{target_dir}")