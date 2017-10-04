---
layout: post
categories: Language
title: python笔记（多线程）
author: datasnail
show: index
comments: true
intro: python的多线程一直瞎用，不是很明白，忙里偷闲，学习中记录。
tags:
- python
---

这个系列初衷，就是想重新学下多线程。由于上次写了一个爬虫，想做一个UI，出现了一个问题“点击按钮，爬虫开始爬取数据，而前台还能进行其他操作，这就需要一个线程负责爬取工作，一个线程负责UI的绘制，互相不影响才能顺利工作”。
#### **假如世界没有多线程**
在没有线程时，我们运行的程序都是从上往下顺序执行的，执行时间也是依次推迟的，如果前面的程序需要很长的时间，那么后面的程序将继续等待戈多。
```python
def loop0():
    print "[loop-0 start at ", ctime(),']'
    sleep(3)
    print "[loop-0 end at ", ctime(),']'

def loop1():
    print "[loop-1 start at ", ctime(),']'
    sleep(2)
    print "[loop-1 end at ", ctime(),']'
    
def main():
    print "[Main start at ", ctime(),']'
    loop0()
    loop1()
    print "[All DONE at ", ctime(),']'
    
if __name__ == '__main__':
    main()

'''result
[Main start at  Thu Aug 24 16:12:30 2017 ]
[loop-0 start at  Thu Aug 24 16:12:30 2017 ]
[loop-0 end at  Thu Aug 24 16:12:33 2017 ]
[loop-1 start at  Thu Aug 24 16:12:33 2017 ]
[loop-1 end at  Thu Aug 24 16:12:35 2017 ]
[All DONE at  Thu Aug 24 16:12:35 2017 ]
'''
```
由时间的先后顺序可以看到，loop1必须在loop0块执行完成后才得以执行，而main函数的print也是严格按照这个顺序执行的。
就像刚开始描述的那个问题一样，有时候，我们不愿意等这么久才执行别的程序，所以我们必须用到多线程。
#### **开启多线程之旅**
python中提供thread、threading和Queue等多个模块。而对比threading模块，书中不建议使用thread，首先threading模块更高级，对线程的支持更加完善；其次，thread模块同步原语只有一个，而threading则显得相对丰富；最后，thread对于进程什么时候结束完全没有控制，当主线程结束时，所有的线程都会被强制结束掉，没有警告也没有正常的清除工作，而threading模块能够保证重要的子线程退出后进程才退出。（**什么是重要的子线程？**）
首先，按照书上的思路，也简单记下thread模块相关内容：
thread模块通过start_new_thread(function,args kwargs=None)函数产生一个新的线程，在新线程中用制定的参数和可选的参数kwargs来调用这个函数，例如：
```python
import thread
from time import sleep,ctime

def loop0():
    print "[loop-0 start at ", ctime(),']'
    sleep(3)
    print "[loop-0 end at ", ctime(),']'

def loop1():
    print "[loop-1 start at ", ctime(),']'
    sleep(2)
    print "[loop-1 end at ", ctime(),']'
    
def main():
    print "[Main start at ", ctime(),']'
    thread.start_new_thread(loop0, ())
    thread.start_new_thread(loop1, ())
    sleep(6) #important
    print "[All DONE at ", ctime(),']'
    
if __name__ == '__main__':
    main()
'''result
[Main start at  Thu Aug 24 16:32:41 2017 ]
[loop-0 start at  Thu Aug 24 16:32:41 2017 ]
[loop-1 start at  Thu Aug 24 16:32:41 2017 ]
[loop-0 end at [loop-1 end at   Thu Aug 24 16:32:44 2017Thu Aug 24 16:32:44 2017  ]]

[All DONE at  Thu Aug 24 16:32:47 2017 ]
'''
```
这里故意选了一个错乱的输出，多线程中，我们能控制一个线程的输出，可是不能控制多个线程输出出来的杂乱内容（也是可以控制的，只是这里没有）。而且可以看到在main函数里面，有一句sleep(6)，为了不让主线程停止，如果我们把这句删掉会得到以下输出：
```python
[Main start at  Thu Aug 24 16:34:59 2017 ]
[All DONE at [loop-0 start at   Thu Aug 24 16:34:59 2017[loop-1 start at Thu Aug 24 16:34:59 2017   ]Thu Aug 24 16:34:59 2017]
 
]Unhandled exception in thread started by <function loop0 at 0x000000000269AC88>close failed in file object destructor:
sys.excepthook is missing
lost sys.stderr
```
可以看到，主进程很快结束了，而且不管子线程的死活，所以子线程继续运行时就出现错误了，也就是上面说的thread的一个缺陷。如果，我们把sleep的参数，也就是休眠的秒数改成2（我觉的小于等于3可能都会出问题），得到的输出，也有惊喜：
```python
[Main start at  Thu Aug 24 16:37:39 2017 ]
[loop-0 start at  Thu Aug 24 16:37:39 2017 ]
[loop-1 start at  Thu Aug 24 16:37:39 2017 ]
[All DONE at  Thu Aug 24 16:37:41 2017 ]
```
可以看出输出是残缺的。所以这里用了sleep函数做了线程的同步，使得主线程不至于过早结束而损害子线程，但是这样程序的总运行时间也增加了，还大大的损害了多线程的好处。当然也有其他的同步线程的方法，例如使用thread提供的锁机制：
```python
import thread
from time import sleep,ctime

loops = [4,2]

def loop(nloop,nsec,lock):
    print "[loop-%s start at "%nloop, ctime(),']'
    sleep(nsec)
    print "[loop-%s end at "%nloop, ctime(),']'
    lock.release()
    
def main():
    print "[Main start at ", ctime(),']'
    locks = []
    nloops = range(len(loops))
    for i in nloops:
        lock = thread.allocate_lock()
        lock.acquire()
        locks.append(lock)

    for i in nloops:
        thread.start_new_thread(loop,(i,loops[i],locks[i]))
    
    for i in nloops:
        while locks[i].locked():pass

    print "[All DONE at ", ctime(),']'
    
if __name__ == '__main__':
    main()
'''result
[Main start at  Thu Aug 24 16:48:53 2017 ]
[loop-0 start at [loop-1 start at   Thu Aug 24 16:48:53 2017Thu Aug 24 16:48:53 2017  ]
]
[loop-1 end at  Thu Aug 24 16:48:55 2017 ]
[loop-0 end at  Thu Aug 24 16:48:57 2017 ]
[All DONE at  Thu Aug 24 16:48:57 2017 ]
'''
```
这里用两个循环分别获得锁和开始线程，是为了让所有的线程同时开始，当然也可以直接在一个循环中获得锁，然后开始即可。main函数的最后一个循环，是在主线程中一直检查每个子线程的锁是否解开，如果所有的都解开了，执行主线程的内容并结束。
#### **学习threading**
好了，可以开始看看threading模块了，这个模块不但提供了Thread类，还提供了很多好用的同步机制，而且Thread类里就有很多thread模块中没有的函数。另外，threading模块支持守护线程。
使用Thread类，有三种方法创建线程：
- 创建Thread实例，传递一个函数；
- 创建Thread实例，传递一个可调用的类对象；
- 从Thread派生一个子类，创建一个这个子类的实例。

快快快，使用threading模块改写下上面的栗子:
```python
import threading
from time import sleep,ctime

loops = [4,2]

def loop(nloop,nsec):
    print "[loop-%s start at "%nloop, ctime(),']'
    sleep(nsec)
    print "[loop-%s end at "%nloop, ctime(),']'
#     lock.release()
    
def main():
    print "[Main start at ", ctime(),']'
    threads = []
    nloops = range(len(loops))
    
    for i in nloops:      #create threads
        t = threading.Thread(target=loop,args=(i,loops[i]))
        threads.append(t)
    for i in nloops:      #start threads
        threads[i].start()
    
    for i in nloops:      #wait for all
        threads[i].join() #threads to finish
    print "[All DONE at ", ctime(),']'
    
if __name__ == '__main__':
    main()
'''result
[Main start at  Thu Aug 24 17:10:19 2017 ]
[loop-0 start at  Thu Aug 24 17:10:19 2017 ]
[loop-1 start at  Thu Aug 24 17:10:19 2017 ]
[loop-1 end at  Thu Aug 24 17:10:21 2017 ]
[loop-0 end at  Thu Aug 24 17:10:23 2017 ]
[All DONE at  Thu Aug 24 17:10:23 2017 ]
'''
```
这里使用了第一种方法创建线程，创建thread实例，传递一个函数。可以看到我们不需要在函数中显式的加锁，也不用管理锁（分配锁、获得锁、释放锁、检查锁等），并且用join函数，使得程序挂起，直到线程结束。
接下来，我们用第三种方法创建线程，从Thread派生出一个子类，并创建这个子类的实例。
```python
import threading
from time import sleep,ctime

loops = [4,2]

class ThreadFunc(object):
    def __init__(self,func,args,name=''):
        self.name = name
        self.func = func
        self.args = args
    
    def __call__(self):
        apply(self.func,self.args)

def loop(nloop,nsec):
    print "[loop-%s start at "%nloop, ctime(),']'
    sleep(nsec)
    print "[loop-%s end at "%nloop, ctime(),']'
    
def main():
    print "[Main start at ", ctime(),']'
    threads = []
    nloops = range(len(loops))
    
    for i in nloops:      #create all threads
        t = threading.Thread(target=ThreadFunc(loop,(i,loops[i]),loop.__name__))
        threads.append(t)
    for i in nloops:      #start threads
        threads[i].start()
    
    for i in nloops:      #wait for all
        threads[i].join() #threads to finish
    print "[All DONE at ", ctime(),']'
    
if __name__ == '__main__':
    main()
```
不写了。。。



