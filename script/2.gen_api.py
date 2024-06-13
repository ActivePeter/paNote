### chdir
import os
import sys

CUR_FPATH = os.path.abspath(__file__)
CUR_FDIR = os.path.dirname(CUR_FPATH)
os.chdir(CUR_FDIR)


### utils
def os_system_sure(command):
    print(f"执行命令：{command}")
    result = os.system(command)
    if result != 0:
        print(f"命令执行失败：{command}")
        exit(1)
    print(f"命令执行成功：{command}\n\n")

def os_system(command):
    print(f"执行命令：{command}")
    result = os.system(command)
    print("\n\n")


os.system("git clone https://github.com/ActivePeter/paTools")

os_system_sure("cp paTools/http_api_gen/http_api_gen.py .")

APIS=[
    "auth",
    "content",
    "list"
]

for api in APIS:
    os_system_sure(f"cp http_conf_{api}.yaml http_conf.yaml")
    os_system_sure(f"python3 http_api_gen.py")

os_system_sure("rm -f http_api_gen.py")
os_system_sure("rm -f http_conf.yaml")