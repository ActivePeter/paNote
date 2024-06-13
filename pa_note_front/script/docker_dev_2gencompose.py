### chdir
import os
import sys

CUR_FPATH = os.path.abspath(__file__)
CUR_FDIR = os.path.dirname(CUR_FPATH)
os.chdir(CUR_FDIR)
os.chdir("..")


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



ENTRY="""
pnpm install --save clone deep-equal eventemitter3 extend parchment quill-delta@3.6.0 tslib
pnpm install
pnpm run serve
"""

COMPOSE="""
version: '3'
services:
  panote_ui_dev:
    image: panote_ui_dev
    # 使用 host 网络模式
    network_mode: host
    # 挂载项目目录到容器中
    volumes:
      - .:/usr/src/app
    command: bash docker_run_dev_entry.sh
"""

with open("docker_run_dev_entry.sh","w") as f:
    f.write(ENTRY)

with open("docker-compose.yml","w") as f:
    f.write(COMPOSE)
