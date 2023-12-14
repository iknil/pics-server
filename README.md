# pics-server

## 简介

简单的图片服务，提供图片上传以及动态图片压缩裁剪能力。

## 图片动态调整

```shell
http://127.0.0.1:3000/imgs/2023_11_12.c0bf827b09f44804efcfa0ba5136ff49.${width}.${height}.${quality}.${type}
```
- width：number，当值大于0时生效，用于调整图片宽度
- height：number，当值大于0时生效，用于调整图片的高度
- quality：number，取值1-100，用于调整图片质量
- type：enum，取值jpeg|webp|png|gif|avif，用于调整图片格式

## 开发

```shell
# 启动服务
node index.js

# 打包docker
docker build .
```