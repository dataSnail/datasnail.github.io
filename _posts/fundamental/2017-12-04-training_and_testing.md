---
layout: post
categories: Fundamental
title: 训练跟测试的过程？
author: datasnail
comments: true
show: backup
intro: 台大机器学习课程第五节课，笔记。
paperTime:
tags:
- 基础知识
---

接着上一节课留下的问题来说，上回讲到如果有**足够的数据资料（数量N）**和一个**有限数量的假设（数量M）**，能推出机器学习是**可行的**。也就是在假设空间任选一个假设，都能得到$E_{out}(g) \approx E_{in}(g)$，简单说就是选择的假设在训练集上和测试集上能得到的效果是PAC的。这样的话，如果能找到一个假设，它的$E_{in}(g) \approx 0$，那么根据PAC理论，也能得到此假设在预测数据的判断（测试集）上也能有较优的表现$E_{out}(g) \approx 0$，从而使得机器学习成为可能，从而可以喜大普奔。问题是现在我们还做不到，现在我们只是在一些假设下面，证明了局部可学习。现在问题是如果假设是**无限**的呢？所以需要待从头，收拾旧山河，重新屡一下使得learning可行而需要解决的问题：  
1. 是否能保证$E_{out}(g) \approx E_{in}(g)$?
2. 是否能得到一个使得$E_{in}(g)$足够小的假设？

现在我们到了**证明假设空间的大小M在无限的情况下，learning是否还是可行的问题？**那这个问题跟以上两个问题有什么关系呢？来看下M的大小跟上述两个问题的关系：  

{:.center}
![](/postimg/training_and_testing/M_2questions.jpg)  
图1. 假设空间M的大小与两个问题的关系 
{:.center}

可以看到m重要。  
无限大的M怎么办，能不能把M换成m，从而证明呢？  

growth function

break point

shatter
