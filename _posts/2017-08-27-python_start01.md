---
layout: post
categories: Language
title: python笔记（一）
author: datasnail
show: index
comments: true
intro: python的基本数据类型和基本操作。
tags:
- python
---

### **一、python基本类型**

| 分类 | python类型 |
| ------ | ------ |
| 可变类型 | 列表，字典 |
| 不可变类型 | 数字、字符串、元组 |

可变类型就是对象的地址本身不变（可以用`id()`来确认对象是否变化），可以增加、减少元素。不可变类型就是，增加、减少元素之后，新的对象就不是原来的对象，即id就变了。
```python
#列表在元素变化前后，id是一样的
cLs = [1,2,3,4,5]
print id(cLs) #69288200 每次运行会不一样
cLs.append(6)
cLs.append(7)
print id(cLs) #69288200 每次运行会不一样

#字符串
sStr = 'python'
print id(sStr) #38090552
sStr += '1'
print id(sStr) # 68213976
```

#### **1、python数字**
```python
anInt = 1.0 #整数赋值
aComplex = 3.4+4.21J #复数赋值，虚数部分有j或者J
aComplex.real #实数部分
aComplex.imag #虚数部分
aComplex.conjugate() #复数的共轭复数

ahex = 0xff #十六进制数字
aoct = 0255 #八进制

#数字比较
5.2 == 5.2 #True
3 < 6 < 9 #same as (3<6) and (6<9) True
33 < 22 == 22 #True
0. < -90 < 55e2 != 3  < 122 #False because 0. > -90

#数字四则运算
1/2 #0
1/2.0 #0.5

from __future__ import division
1/2 #0.5

#地板除
1.0//2.0 #0.0
-1/2 #-1
math.floor(11.0//2.0) #5.0 should import math

#幂运算
-3**2 #-9 **优先级高于左侧-

4.0 ** -1 #0.25 **优先级低于右侧-
4 ** -1 #python核心编程中说会引发negative power异常，我在python2.7中并不会出错

#进制转换
hex(255) #0xff 转换到16进制
oct(255) #0377
#ASCII转换
ord('a') #97
chr(97) #'a'

#布尔
bool(0) #False 
bool(1) #True
```

#### **2、字符串、列表、元组**
#### a) 字符串
```python
#字符串、切片操作
s = 'hello python!'
s[0] #'h'

s[1:5] #ello 包含前界不包含后界
s[6:] #python!
len(s) #13 python字符串不通过'\0'结束，数几个就是几个
s[12:13] #!
#s[13] #error!!
s[-1] #! 从后往前取
s[-3:-1] #on
s[:-1] #hello python
s[:] #hello python!

#成员操作符
'python' in s #True
'python' not in s #False
#函数
reversed(s) #返回s的倒叙的迭代器
cmp('1','2')
len(s)
max(s) #y 返回ascii码最大的字符
min(s) #' '
enumerate(s) #(0, 'h') (1, 'e')... 参数是可遍历的变量，
s,t = '123','abc'
zip(s,t) #[('1', 'a'), ('2', 'b'), ('3', 'c')]

r'\n' # '\\n' 返回原始字符串，不转译
u'hello' #unicode

'*' * 20 #'********************'
```
关于python中string的操作更多请见[官方文档](https://docs.python.org/2/library/string.html "string operation")。

#### b)列表
```python
aLs = [123,'abc',3.222,['in',34]]
bLs = [None,'some']

list('foo') #['f','o','o']

#访问,类似字符串
aLs[0]
aLs[-1] #['in', 34]
aLs[3][1] #34

#更新
aLs[0] = 'modify' # aLs changed to ['modify', 'abc', 3.222, ['in', 34]]

#列表也有 in、not in 操作

#连接操作
cLs = aLs+bLs #create a new list cLs, and cLs is ['modify', 'abc', 3.222, ['in', 34], None, 'some']

aLs.extend(bLs) #bLs is extended to aLs, aLs is ['modify', 'abc', 3.222, ['in', 34], None, 'some']

bLs * 2 #[None, 'some', None, 'some']

#內建函数
sorted(aLs) #排序，返回排序的 新的 list
reversed(aLs) #反转，返回迭代器
enumerate()
zip()
intLs = [1,2,34]
sum(intLs) #37 if intLs is [1,2,34,[1,3]]则报错，int 加 list
sum(intLs,3) #40

#嵌套的list就相当于多维数组

#tuple()函数会把list转换为tuple
bTp = tuple(bLs) #bTp is (None,'some')

#返回bTp中元素id
[id(x) for x in bTp] #[505523288L, 104760504L]
```
与列表有关的更多內建函数见[官方文档](https://docs.python.org/2/tutorial/datastructures.html?highlight=list "list operation")。我们可以利用列表的许多操作，把列表变为stack([官方文档](https://docs.python.org/2/tutorial/datastructures.html?highlight=stack#using-lists-as-stacks "using-lists-as-stacks"))(使用`append()`、`pop()`)或者是queue([官方文档](https://docs.python.org/2/tutorial/datastructures.html?highlight=stack#using-lists-as-queues "using-lists-as-queues")) （`from collections import deque`）
#### c)元组
```python
#创建使用圆括号
aTuple = (111,'bbb',[1,'s'])
bTuple = ('abc',23)

#访问跟list一样
#更新元组，元组是不可变类型，不能改变或者更新，只能构造新的元组
cTuple = aTuple+bTuple #cTuple is (111, 'bbb', [1, 's'], 'abc', 23)
```
元组除了不能更新，其他的大部分操作跟list都是一样的，如果要改变可以把Tuple变为list，然后再进行改变操作。
函数返回的多对象（不包含有符号封装的）都是元组：
```python
def func1():
	...
	return obj1,obj2,obj3
```
把一个字符串转换为元组，通常在末尾加一个逗号，例如：
```python
('qmmm') # not tuple
('qmmm',) # this is tuple
```
#### d)列表与元组的比较
//TODO

#### e)深拷贝和浅拷贝
//TODO

#### f)其他介绍
> 标准类型： 数字、Interger、Boolean、Long integer、Floating point real number、Complex number、 String、 List、 Tuple、 Dictionary

> 内建类型： 类型、Null对象、文件、 集合/固定集合、 函数/方法、 模块、 类

通过`type()`函数能查看特定对象的类型信息。

> 内部类型： 代码、 帧、 跟踪记录、 切片、 省略、 Xrange

**代码对象**： 是编译过的python源代码片段，是可执行的对象。通过调用內建函数`compile()`可以得到代码对象。

**帧对象**： 表示Python的执行栈帧。帧对象包含Python解释器在运行所需要知道的所有信息。

**跟踪记录对象**： 当异常发生时，一个包含针对异常的栈跟踪信息的跟踪记录对象被创建。
```python
Traceback (innermost last)
   File "<stdin>" , line N?, in ???
NameError: error reason
````

**切片对象**： 使用Python扩展的切片语法时，就会创建切片对象。

**省略对象**： 用于扩展切片语法中，起记号作用。这个对象在切片语法中表示省略号。

**XRange对象**： 类似內建函数range()，用于需要节省内存使用或range()无法完成的超大数据集合场合。