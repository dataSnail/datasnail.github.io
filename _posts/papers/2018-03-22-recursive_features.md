---
layout: post
categories: Papers
title: It's Who You Know Graph Mining Using recursive features 论文笔记
author: datasnail
comments: true
show: backup
intro: 论文的笔记和想法记录。
paperTime:
tags:
- 论文阅读
---

{:.center}
![](/postimg/recursive_features/recursive_features_top.png)  
{:.center} 

#### **一、摘要**
（摘要）这篇文章主要想在网络图中找到合适的特征，描述图中的节点。从而能解决迁移分类、去匿名化等问题。特征的提取比较注重迁移学习，例如用A网络的信息去给B网络分类；用B网络的信息给A网络去匿名化。所以作者觉得关键的一步在于对图进行挖掘找到有效的节点属性。
文中通过迭代地融合（combines）基于节点的局部特征和基于中心网络的邻居特征，提出了一种新型算法。算法输出的区域特征（regional features）能有效的嵌入（capturing）节点行为信息。并证明了这些regional features在跨网络（across-network ）分类和去匿名化任务有重要的作用。而不用依赖于趋同性（homophily）和类标签（the availability of class labels）。总之提出的算法（ReFeX）可扩展、有效，并且在大型网络中能捕捉局部行为信息。  

#### **二、简介**
> These regional features represent the kind of nodes to which a given node is connected (e.g., connected to rich people), as opposed to the identity of those nodes (e.g., connected to Bill Gates) – i.e., it is who you know at the type-level that matters in
mining across different graphs.

给定一个图G，计算节点属性矩阵F，F具有以下特征：  
**结构性**：F的构建应该不需要节点或连接的额外特征信息。  
**有效性**：好的节点属性应该(1)当这些属性可用时，能帮助预测节点*（其他？）*属性。(2)能被迁移到其他网使用。   
理想的特征应该对数据挖掘任务有帮助。典型的任务包括节点分类、图中节点的去匿名化和迁移学习。图1给了ReFeX算法背后的直觉来源和对其分类精确度的预览：  

{:.center}
![](/postimg/recursive_features/intuition.png)  
图1 算法直觉来源示例
{:.center} 

上图展示了在IP网络中，节点在不同日期的egonet，节点的大小和边的粗细与流量成正比。重点是邻居的特征是非常valuable的，这能帮助我们描述该中心节点。图1中，分别手动标示了web、dns-server和p2p类型网络。  
文章的贡献：  
新颖的设计：提出ReFeX算法，计算区域特征（regional features），在大型网络中捕捉行为信息。
有效性： ReFeX区域特征，在很多图挖掘任务中表现良好。例如在多网络分类的迁移学习和大型网络中的节点去匿名化中。

#### **三、ReFeX算法**
算法聚集节点已有的特征属性值，并在此基础上产生新的递归属性（recursive features）。起始被用作种子而产生新递归特征的可以是网络的结构信息或者是外部来源的属性（attributes from external source）。文章中只讨论了只有结构信息可用的情况，并把结构特征分类为三种类型：**局部（local），中心网络（egonet）**和**递归（recursive）**的特征。其中局部特征和中心网络特征组成了邻居特征，邻居特征和递归特征一起组成区域特征(regional features)，具体关系如图2所示。

{:.center}
![](/postimg/recursive_features/features_relationship.png)  
图2 特征之间的关系
{:.center} 

**邻居特征（neighborhood features）**包含局部特征和中心网络特征，这些特征都能很快给出。**局部特征都是节点度的本质度量**(Local features are all essentially measures of the node degree)。如果是有向网络，那么就包含进度和出度；对于带权图，它就包含每个局部特征的带权版本。*ps：个人觉的这里加粗部分就是说，局部特征就是衡量节点在“度”方面的特征。这样说显示算法的通用性，并举例说如果是有向网络，大概怎么处理；如果是带权网络，大概如何量化等。*  
**中心网络特征（egonet features）**故名思议就是基于节点的中心网络进行计算的特征。**中心网络（egonet）包含节点、邻居和它们之间的边。**中心网络特征包含在中心网络中边的数量，也包含进入中心网络的边数量和从中心网络出去的边数量。同样，egonet features也有有向的版本和带权的版本。  
递归特征（recursive features）


注：文中激活全局都在强调算法新颖和应用的两个方面（多网络分类和去匿名化）。