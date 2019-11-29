---
layout: post
categories: Engineering
title: hadoop、spark、Scala搭建
author: datasnail
comments: true
show: backup
paperTime:
tags:
- 技术学习
---


#### **一、准备**

##### 1、软硬件准备
- 操作系统：ubuntu 64位
- JDK：1.8.0_111
- Hadoop：2.2.0
- Scala：
- Spark：


##### 2、 网络环境



#### **二、开始装**

#### 1、前奏
**java环境**
- 下载jdk
- 配置：linux /etc/profile（source /etc/profile）  windows:配置环境变量

**添加用户**
>sudo addgroup hadoop
>sudo adduser -ingroup hadoop hadoop
>sudo vim /etc/sudoers
>增加 hadoop ALL=(ALL:ALL) ALL

**hosts文件**
ip1 hadoop1
ip2 hadoop2
ip3 hadoop3

**关闭防火墙**

**安装ssh**
>sudo apt-get install openssh-server
>启动
>sudo /etc/init.d/ssh start
>生成私钥和公钥，免密码登录(-P P为大写)
>ssh-keygen -t rsa -P ""
>cat ~/.ssh/id_rsa.pub >> ~/.ssh/authorized_keys

#### 2、安装hadoop
配置文件：hadoop-env.sh

>export JAVA_HOME=/usr/local/jdk1.8
>export HADOOP_HOME=/usr/local/hadoop-2.7.3
>export PATH=$PATH:/usr/local/hadoop-2.7.3/bin


在hadoop根目录下，创建新目录tmp，并且赋予其权限
>sudo chown -R hadoop:hadoop tmp

