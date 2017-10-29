---
layout: post
categories: Engineering
title: mySql相关记录
author: datasnail
comments: true
show: index
tags:
- Mysql
---

### [Q1] 解决mysql远程登录

#### 一、确认服务器端口号开放

```sql
ubuntu@ubuntu:~$ netstat -an | grep 3306
tcp0 0 127.0.0.1:3306  0.0.0.0:*   LISTEN
```
此处3306端口只监听本地的(127.0.0.1)连接，修改/etc/mysql/my.cnf中的bind-address，注释掉或者改成指定的IP

#### 二、授权远程连接用户

1、登录：

```sql
mysql -uroot -pxxxx
```
2、授权

```sql
grant all privilege on [database].[table] to [user]@[ip] identified by [password]
mysql>grant all on *.* to user_name@'%' identified by 'user_password';
```

database：授权的数据库名，所有的数据库用匹配符`*`<br>
table:授权的表名，所有的表用匹配符`*`<br>
user:授权的用户名<br>
ip:授权的ip地址，例如`'xxx.xxx.xxx.xxx'`<br>
password:授权用户名的密码，例如`'xxxxxx'`<br>
3、刷新授权或者mysql重启

```sql
flush privilege
sudo /etc/init.d/mysql restart
```

### [Q2]mysql 命令导入csv

```sql
select * from test_info
into outfile '/tmp/test.csv'
fields terminated by ',' optionally enclosed by '"' escaped by '"'
lines terminated by '\r\n';
```

### [Q3]mysql备份数据库压缩

```sql
mysqldump -hhostname -uusername -ppassword databasename | gzip > backupfile.sql.gz
```
注意：这种只会备份sql库里的表结构和数据，不会备份写过的存储过程和函数，如果要备份存储过程和函数要加上参数 -R。

```sql
mysqldump -hhostname -uusername -ppassword -R databasename | gzip > backupfile.sql.gz
```
具体参数和其他选项可参照[官网](http://dev.mysql.com/doc/refman/5.7/en/mysqldump.html)详述。

数据还原：
```
mysql -u root -p [dbname] < backup.sql
```


### [Q4] 查看数据库大小

```sql
use information_schema
select concat(round(sum(DATA_LENGTH/1024/1024),2),'MB') as data  from TABLES where table_schema='database_name' and table_name = 'table_name';
```

```sql
+-----------+
| data      |
+-----------+
| 5340.73MB |
+-----------+
1 row in set (0.64 sec)
```

### [Q4] select into 和 insert into

```sql
INSERT INTO Table2(field1,field2,...) SELECT value1,value2,... FROM Table1
SELECT vale1, value2 INTO Table2 FROM Table1
```

### [Q4] mysql移库
```
1.停止数据库服务：

使用/etc/init.d/mysql stop 或者 stop mysql

2. 在目标位置（/data)创建数据库文件的目录(如/mysqldb)，并复制（如果不再使用默认的位置，则可以直接mv原先数据库文件到新目录下）原先的数据库文件目录到该目录下：

cd  /data

mkdir mysqldb

cp -r /var/lib/mysql  /data/mysqldb/

经过一段时间的等待后，在/data/mysqldb/下面就有了原先默认的mysql数据库文件目录的拷贝“/mysql”

3.修改my.cnf文件

# vim /etc/mysql/my.cnf

将datadir = /var/lib/mysql 改为 datadir = /data/mysqldb/mysql

另外由于当前my.cnf 中的socket = /var/run/mysqld/mysqld.sock（而并非像网上所说的sock = /var/lib/mysql/mysql.sock），即socket的位置并不在数据库文件所在的位置，因此可以不做类似网上其他网页所说的，要使用以下的命令做一个mysql.sock 链接：

ln -s  /data/mysqldb/mysql/mysql.sock  /var/lib/mysql/mysql.sock (需要从/home/data/mysql下复制一份过来)

4. 修改数据库的权限：

# chown -R mysql:mysql /data/mysqldb/mysql/　  ← 改变数据库文件目录的归属为mysql

# chmod 700 /data/mysqldb/mysql/whois/　 ← 改变数据库目录whois的属性为700

# chmod 660 /data/mysqldb/mysql/whois/*　 ← 改变数据库中数据表的属性为660

5. 修改文件usr.sbin.mysqld

# vim /etc/apparmor.d/usr.sbin.mysqld

把

/var/lib/mysql r,

/var/lib/mysql/** rwk,

改成

/data/mysqldb/mysql/  r,

/data/mysqldb/mysql/** rwk,

注意：没有该步骤的话，将导致数据库服务无法重启，好像在重启，但是一直卡住无反应。

6.启动mysql服务器

/etc/init.d/apparmor restart

/etc/init.d/mysql restart  （或者使用 restart mysql）

搞定！


```
