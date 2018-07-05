---
layout: post
categories: fundamental
title: 双连通分量、强连通分量的一个解释
author: datasnail
show: index
comments: true
intro: 算法中图部分的一点内容，概念基本源于沈孝钧老师的《计算机算法基础》
tags:
- algorithm
---

所谓的连通分量、强连通分量、强连通分支等概念令人迷惑不解，通过此文的整理，希望能了解透彻。
### 一、概念
连通图：

其中**强连通图、弱连通图、强连通子图、强连通分支**[（*概念在此*）](/fundamental/2018/07/01/algorithms_graph.html#stronglyconnectedcomponent)都是针对<span style = 'color:red'>**有向图**</span>来说的。  

而双连通和强连通其实是一个概念在两种图的反映。双连通又分**点-双连通分量**和**边-双连通分量**。**点-双连通**是指在<span style = 'color:red'>**无向图**</span>中，两点之间至少有两条路径，而且路径中的节点应该不同（除了首尾节点）。

边-双连通分量是指在一个无向图中两点之间至少有两条路径，而且路径中的边要不同。

这里又牵扯两个概念，一个叫“割顶”，一个叫“桥”。
### 三、参考文献
[1] 沈孝钧. 计算机算法基础 : Essentials of computer algorithms[M]. 机械工业出版社, 2014.