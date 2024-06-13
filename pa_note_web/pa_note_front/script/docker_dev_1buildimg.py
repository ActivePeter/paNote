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



DOCKERFILE="""
# 基于 Node.js 的 Docker 镜像
FROM node:18

# 设置工作目录
WORKDIR /usr/src/app

# 安装 pnpm
RUN npm install -g pnpm

RUN npm install -g vite
"""

with open("Dockerfile", "w") as f:
    f.write(DOCKERFILE)

os_system_sure("docker build -t panote_ui_dev .")
