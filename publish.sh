#! /usr/bin/env bash
npm config get registry # 检查仓库镜像库
npm config set registry=https://registry.npmjs.org
echo '请进行登录相关操作：'
npm login # 登录
echo '-----publish------'
npm publish # 发布
echo '发布完成'
exit