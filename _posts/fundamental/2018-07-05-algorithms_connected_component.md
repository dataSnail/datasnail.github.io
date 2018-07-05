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

而双连通和强连通其实是一个概念在两种图的反映。双连通分量（biconnected component,bcc）又分**点-双连通分量**和**边-双连通分量**。  
**点-双连通**是指在<span style = 'color:red'>**无向图**</span>中，两点之间至少有两条路径，而且路径中的节点应该不同（除了首尾节点）。  
**边-双连通分量**是指在一个无向图中两点之间至少有两条路径，而且路径中的边要不同。  
求双连通分量可用[Tarjan算法](https://en.wikipedia.org/wiki/Biconnected_component)。  

这里又牵扯两个概念，一个叫“**割顶**”，一个叫“**桥**”。  
“**割顶**”（cut vertex）也可以叫“**割点**”或者“**关键点**”（articulation vertex）是指从图中去除此点，图就会分离成更多部分。举个栗子，图1中，节点4，5，6都为割点，因为如果从图中除去这当中任何一个节点，图中的component都会比原来多：

{:.center}
![](/postimg/connected_component/cut_vertex.png){:width="500"}

图1. 割点的举例
{:.center}

同样，桥也有类似的定义，在图中去掉这种边，图就会分离成更多的部分。如下图标红色的边都为图中的桥。

{:.center}
![](/postimg/connected_component/bridge.png){:width="230"}

图2. 桥的举例
{:.center}

**诱导子图(induced subgraph)：**也叫导出子图，[wiki解释](https://en.wikipedia.org/wiki/Induced_subgraph)，$G'=(V', E')，V'\subset V$，$E'= \{ (u, v)|u, v \in V'，(u, v) \in E \} $，$G'$为$G$的诱导子图。对于某个诱导子图中的顶点，只要是在原图G中有边，那么在诱导子图中也要有边。     
**生成子图(spanning graph)**,或者叫**支撑子图**，是指一个无向连通图G，它的联通子图如果包含G中**所有的顶点**，则称为图G的一个spnning graph。

### 三、参考文献
[1] 沈孝钧. 计算机算法基础 : Essentials of computer algorithms[M]. 机械工业出版社, 2014.