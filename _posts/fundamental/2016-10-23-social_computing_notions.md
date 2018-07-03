---
layout: post
categories: Fundamental
title: 社会计算中的一些名词
comments: true
author: datasnail
show: index
tags:
- Social Computing
---

社会计算中相关的一些概念，本文主要概念主要来源于文献<sup>[2]</sup>，整理如下笔记：

1、**弱连接[weak tie]**：最早来源于Granovetter的“弱连接假设”（weak tie hypothesis），比如下图，弱连接假设是说，如果A和B、C有一条强连接，可以理解成A和B、C是好朋友，则B、C之间形成连接的可能性就会很大，即B、C很有可能也称为好朋友。

<img src="http://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Weak-strong-ties.svg/300px-Weak-strong-ties.svg.png?_=5991427" >

也就是说，A和B、C通过强连接连接，则B、C之间的连接一般是存在的，如果B、C之间不存在连接，则B、C之间的连接很容易生成，这个叫做“三元闭包”（Forbidden triad），也就是说B、C之间的连接不论是强还是弱，总会存在。“弱连接假设”通过假设（clumps）和团（cliques）的社会结构会产生，形成以强连接为边界，弱连接会充当两个比较密集交织团中两个紧密朋友之间的重要桥梁（crucial bridge）的功能。<sup>[1]</sup>
一般来说，强连接是引发行为，弱连接传递信息。

2、**聚类系数[clustering coefficient]**:聚类系数有两种定义，一种是节点的聚类系数；二种是整个网络的聚类系数。
节点的聚类系数：包含节点i的三角形数目/以节点i为中心的连通三元组数目。
整个网络的聚类系数：有几个定义，定义一：整个网络中所有的节点的聚类系数的平均值；定义二：网络中三角形数目/网络中连通三元组数目/3；<sup>[2]</sup>
聚类系数后记：网络中的聚类数的计算并不是一个NP-Hard问题（我曾经搞错了），但是计算聚类系数也需要花费大，但是找网络中的k-clique是一个NP-Hard问题。

3、**介数**：分为边介数和节点介数两种，但是定义都差不多，边介数是网络中所有的所有最短路径经过该边的数目占最短路径总数的比例；节点介数是网络中所有的最短路径经过该点的数目占最短路径总数的比例。

4、**中心性[Centrality]**：有三种中心性：度中心性[Degree centrality]、介数中心性[between centrality]、接近中心性[closeness centrality]。
度中心性：有的地方也有别的名字(点度中心性[Point centrality])，这里的度中心性表示节点的度越大就意味着这个节点越重要，通常为了便于比较而对中心性指标做归一化处理。DCi=ki/(N-1)；
介数中心性：就是介数。
接近中心性：对于网络中的每一个节点i，可以计算该节点到网络中所有节点的距离的平均值，记为di，di的相对大小在某种程度上反映着节点i在网络中的重要性：di的值越小意味着节点i更接近其他的点。这里把di的倒数定义为节点i的接近中心性。简称接近数。

5、**结构洞[structure hole]**：著名的**“结构洞理论”**；结构洞是指社会网络中的空隙，街社会网络中某个或者某些个体和有些个体发生直接联系，但与其他个体不发生直接联系，即无直接关系或关系间断，从网络整体看好像网络结构出现了洞穴<sup>[6]</sup>。

6、**K- 壳分解方法[k-shell decomposition method]**:
a) 一种粗粒度的划分节点重要性的方法，即K-壳分解方法。假设网络中不存在度为0的孤立节点，这样从度的中心性来说，度为1的节点就是网络中最不重要的节点，把网络中度为1的节点去掉，网络中又会出现一些新的度为1的节点，我们就再把这些节点机器相连的边去掉，重复以上操作，直至网络中不再有度为1的节点为止。以上这种操作中被去除的节点和他们之间的连边称为网络的1-壳（1-shell）。注意：1-壳并不是简单的去除网络中度为1的节点，而是一个重复操作，直到网络中没有度为1的节点了，此时去掉的所有节点和边才叫1-壳。有时定义网络中度为0的孤立节点称为0-壳（0-shell）<sup>[2]</sup>。接下来继续重复把网络中的度值为2的节点及其相连的边去掉，称为网络的2-壳（2-shell）。以此类推。对于k-壳分解方法，度大的节点可能具有较大的k，也可能具有较小的k，是一种说明度大的节点未必是重要的节点<sup>[3]</sup>。
b) 在得到一个网络的k-壳分解之后，我们把所有的k<sub>s</sub>≥k的k-shell的并集称为网络的k-核（k-core），把**指标**k<sub>s</sub>≤k的k-壳的并集称为网络的k-皮（k-crust）。来一张图体会一下，图片来源自<sup>[4]</sup>：

{:.center}
![](/postimg/social_notion1.png)
{:.center}

k-壳分解给出了网络中的节点重要性的粗粒度划分，基于k-壳分解可以把网络中的节点粗粒度划分成三类<sup>[5]</sup>：核心(nucleus)、对等联通片(peer-connected component)、孤立片(isolated component)。

{:.center}
![](/postimg/social_notion2.png)
{:.center}

7、**无标度网络**： 长尾分布网络，由于与钟型分布存在一个明显的特征标度不同，长尾分布往往不存在单一的特征标度，因此长尾分布也成为无标度分布。特征标度是指大部分取值应该落在以特征标度为中心的一个相对比较小的区间内，而长尾分布却不具有这一特征<sup>[2]</sup>。而无标度网络就具有严重的异质性，各节点的度有严重的不均匀分布。

8、**社会资本[social capital]**:

[1]https://en.wikipedia.org/wiki/Interpersonal_ties

[2]网络科学导论 汪小帆 李翔 陈冠荣

[3]Kitsak, Maksim, et al. "Identification of influential spreaders in complex networks." Nature physics 6.11 (2010): 888-893.

[4]Miorandi, Daniele, and Francesco De Pellegrini. "K-shell decomposition for dynamic complex networks." Modeling and Optimization in Mobile, Ad Hoc and Wireless Networks (WiOpt), 2010 Proceedings of the 8th International Symposium on. IEEE, 2010.

[5]Carmi, Shai, et al. "A model of Internet topology using k-shell decomposition." Proceedings of the National Academy of Sciences 104.27 (2007): 11150-11154.

[6]http://wiki.mbalib.com/zh-tw/%E7%BB%93%E6%9E%84%E6%B4%9E%E7%90%86%E8%AE%BA
