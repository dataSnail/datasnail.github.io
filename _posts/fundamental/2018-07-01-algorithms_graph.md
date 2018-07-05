---
layout: post
categories: fundamental
title: 图的表示、深度广度遍历算法及其应用
author: datasnail
show: index
comments: true
intro: 算法预习笔记，绝大部分源从沈孝钧老师《计算机算法基础》，很通俗易懂的一本算法书，没有像算法导论那么巨大，但基本知识都涵盖了。
tags:
- algorithm
---

世间的一切对象都可化为节点；世间一切关系都可化为节点间的一条线；从而组成了如梦幻泡影的图。将来的环球必定是图的世界。

### 一、图的表示
图有有向图和无向图，表示方法一般有邻接表、邻接矩阵等方法，无向图和有向图都可以用这两种方法表示。

{:.center}
![](/postimg/algorithm_graph/graphs.png){:width="500"}

图1. 图的例子<sup>[1]</sup>
{:.center}

#### 1、邻接表
在邻接表中，对于每个顶点u，使用一个链表把所有与u相邻的点点串起来，并标记这个集合为adj(u)。举个栗子如下：

{:.center}
![](/postimg/algorithm_graph/adj.png){:width="500"}

图2. 邻接表表示图的例子<sup>[1]</sup>
{:.center}

在真正操作图进行实验的时候，一般也都使用邻接矩阵表示，例如要存储图1中的有向图，可以直接用一个csv或者txt文件，存储内容如下：  
```
5,14
1,3,2,5,4
2,3,1,5,3
3,2,2,4
4,3,1,5,3
5,3,4,1,2
```
上述文件就是第一行存储了总共的节点数量、边的数量；接下来的每一行就是此顶点的id和邻居的id，并且第2位数字存储了该节点总共有多少邻居节点；为了进一步的操作简单，可以把原有的节点id映射为从0到n，没有边的节点用0补充，此时行号和id相等了，访问起来更加迅速。这样存储的好处是需要较少的内存就可以完成，而且操作简单。
#### 2、邻接矩阵
邻接矩阵顾名思义就是用一个n*n的矩阵，存储各节点之间的关系，空间复杂度$O(n^2)$，这样存储在一些矩阵运算的时候较为方便，例如转置。图1中两图的邻接矩阵如下：

{:.center}
![](/postimg/algorithm_graph/matrix.png){:width="500"}

图3. 邻接矩阵表示图的例子<sup>[1]</sup>
{:.center}

### 二、图周游算法

#### 1、广度优先遍历
图的广度遍历顾名思义就是访问图中节点的时候，优先在广度上进行遍历；也就是访问到某节点A时，优先访问完A的所有邻居节点**[节点的访问顺序并没有做要求，在具体的问题中此处可以定义访问顺序]**，再继续访问邻居的邻居，直接看代码：

```python
#过程中主要是做三件事：颜色、距离、父节点
BFS(G(V,E),s)
	#初始化
    for each vertex u in V-{s}
        color[u] <- White
        d[u]<-∞
        pai[u]<-None
    endfor
	#处理开始节点
	color[s]<-Gray
	d[s]<-0
	pai[s]<-None
	
	#初始化队列
	Q<-Queue()
	Enqueue(Q,s)
	
	#开始广度访问图
	while not Q.empyt():
		u<-Dequeue(Q)
		for each v in Adj[u]:
			if color[v] = White #检查颜色是否为白色，即没有被访问过
				color[v] <- Gray #颜色，变颜色为灰色
				d[v]<-d[u]+1 #距离
				pai[v]<-u  #父节点
			endif
		endfor
	color[u]<-Black
	endwhile
	End	
```

**应用：**   
无向图二着色问题，无奇回路<=>可以二着色<=>可以分为二部图
#### 2、深度优先遍历
深度优先搜索是从某一顶点开始访问，然后访问他的邻居，与BFS不同的是，当深度优先搜索从某个顶点u访问他的邻居时，只选择其中的一个还未被访问的邻居v，然后暂时弃u的其他邻居于不顾，而从新的儿子节点v去访问v的邻居。当v出发的访问全部完成后，DFS回到u，然后再访问u的第二个邻居，以此类推。这里有个动画就好了，可是我不会画。  
深度优先遍历，迭代方法的伪代码：  
```python
DFS(G(V,E))
	#初始化访问控制的颜色，父节点
	for each vetex u in V
		color[u] = White
		pai[u]=None
	endfor

	#最开始，时间为0
	time <- 0
	
	#对于每个节点进行一次深度优先遍历，防止图节点间不连通
	for each vetex u in V:
		if color[u]=While:
			then DFS-visit(u)
		endif
	endfor
	End
#对节点s，进行深度优先遍历
DFS-Visit(s):

	color[s] <- Gray
	time = time + 1
	d[s]<-time
	#如果访问到节点s的邻居节点，那么对其邻居节点迭代进行深度优先遍历
	for each v in Adj[s]:
		if color[v] = White
			pai[v]<-s
			DFS-Visit(v)
		endif
	endfor
	color[s]<-Black
	f[s]<-time<-time+1
	End
```
#### **2.1 区间套定理：**  

#### **2.2 白路径定理：**

#### **2.3 拓扑排序：**

#### **2.4 无回路有向图中最长路径问题：**  
一些应用问题需要找到图中的最短或者最长的**简单路径**(不含回路的路径），图往往是加权的。但是<span style='color:red'>**对于任意图，找一条最长路径是NPC问题，即使这个图是不加权的图**</span>。然而只有这个图是无回路的图时，不论是有向图还是无向图，加权还是不加权图，都可以在线性时间$O(|V|+|E|)=O(n+m)$。细心的我可能发现了，**无回路的图就是棵树或者森林啊**，两个顶点之间要么不连通，要不然就只有唯一的一条路径。
```

```

#### **<span id ='stronglyconnectedcomponent'>2.5 强连通分支：</span>**
定义1： 如果一个有向图中任意一顶点都有一条通向其他任一顶点的路径，那么这个<span style = 'color:red'>**有向图**</span>称为**强连通图**（strongly connected graph）  
定义2： <span style = 'color:red'>**有向图**</span>G，其**隐含的无向图**$G'$是指把G中的每条边的方向都去掉后所得到的无向图。  
定义3： 如果一个<span style = 'color:red'>**有向图**</span>G所隐含的无向图$G'$是个连通图，那么有向图G称为**弱连通图**（weakly connected graph）  
定义4： 如果一个<span style = 'color:red'>**有向图**</span>的子图是个强连通图，则成为**强连通子图**（strongly connected subgraph）  
定义5： 如果一个<span style = 'color:red'>**有向图**</span>的强连通子图已最大，即不能在加入其他任何一个顶点而仍然强连通，那么这个子图称为**强连通分支**（strongly connected component）  
**这里强连通分支包含于强连通子图内。**  
定义6： **有向图的强连通分支问题**就是把一个有向图的顶点划分为不相交的若干个强连通分支。  


### 三、参考文献

[1] 沈孝钧. 计算机算法基础 : Essentials of computer algorithms[M]. 机械工业出版社, 2014.