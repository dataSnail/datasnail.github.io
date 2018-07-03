---
layout: post
categories: Papers
title: deepwalk：Online Learning of Social Representations论文笔记
author: datasnail
comments: true
show: index
intro: Deepwalk论文笔记，大神级文章。
paperTime:
tags:
- 论文阅读
---

{:.center}
![](/postimg/deepwalk/thesis_title.png)  
{:.center} 

### **一、前言和摘要**
deepwalk源码的github地址：[https://github.com/phanein/deepwalk](https://github.com/phanein/deepwalk "deepwalk source code")  
deepwalk主页地址：[http://www.perozzi.net/projects/deepwalk/](http://www.perozzi.net/projects/deepwalk/ "Bryan perozzi")  

通俗点概括就是，deepwalk把利用graph连接的特点，把graph中的节点表示成一个向量了。然后你想发现社区结构就可以使用聚类方法，想做其他分类就可以使用简单的分类器（例如逻辑回归）。那这样表示有什么好处呢？又简单来说有很多好处，在数据爆炸的年代，数据程指数增长，而节点与节点之间的关系使得数据更加复杂，例如n个节点可能会有$n^2$条边，那么数据就有了指数的指数这样的量级增长了，即使我们的机器按照摩尔定律18个月翻一番，也赶不上指数的指数级别，显得很无能为力。那这时候，我们把n个节点都表示成向量，如果所有的关系都能embedding到向量的各个维度中，我们就把$n^2$级别的数据拉回来了，变成$\alpha x$量级的了，符合我们机器的升级速度，这！岂不美哉。  
如果一点概念都没有的建议读几遍（不读也可以看）"word2vec的数学原理"相关内容，总结的很好，认真读的话一个小时左右能读完。deepwalk就是在Graph中借鉴语言模型和在序列词中进行非监督特征学习（深度学习）。反正之前的你是读了好几遍的。主要概念有Sigmoid函数、Bayes公式、Huffman树、n-gram模型、概率语言模型、词向量等等。     
word2vec中使用skipGram的方法，定义每个word的Context，然后通过word的Context去推断这个word应该是什么，或者通过该 word去推断它的Context应该是什么。把他转换为一种概率统计的方法去学习，并最终表示出word的词向量。  
而在网络中如何确定word和Context呢？Deepwalk巧妙利用从截断的随机游走中获得的局部信息，通过把游走顺序比做语言模型中的句子，去学习图中潜在的表示。**举个栗子**：在图1的简单示例图中，我们可以选择在节点3（先不管为什么选择这个节点），然后从此节点开始随机游走（暂时不管随机游走边的概率），游走长度是3（这里表示截断的随机游走，长度固定），那么可能产生一个序列3->4->5->2，这里的这个序列就可以想想成用“网络语言”说出的一句话，单词是3、4、5、2，单词的前后代表“网络语言”的逻辑关系，就跟依据中文“我->吃->饱->了”是一样的。

{:.center}
![](/postimg/deepwalk/network_instance.png)  
图1. 网络示例图
{:.center}

文章把Deepwalk应用于多个标签网络中的网络分类任务（Network classification tasks），例如BlogCatalog、Flickr和YouTube上，然后表明Deepwalk能给予network的全局表示方法，而且结果要好于其他对比算法。当网络的标签数据稀疏的时候，Deepwalk在F1值上能提高10%，在某些实验中，deepwalk能比其他算法少用60%的数据，而能产生比别的算法好的结果。而且呢，deepwalk具有可扩展性，可以作为在线学习算法进行增量学习。这些特性使得deepwalk算法广泛的适合于现实世界的应用程序，例如网络分类和异常检测（anomaly detection）。

### **二、简介**
稀疏网络表示让人又爱又恨，一方面稀疏性使得设计有效的离散算法称为可能，而另一方面这也使得在统计学习中更难一般化结果。本文章通过使用短随机游走流（stream of short random walks），提出了一个图中节点的社交表示（social representation）方法。  
deepwalk主要目的：在连续空间内表示节点的特征，能囊括节点的**邻居相似性**和**社团关系**。所以deepwalk算法的输入就是：graph（类比语言模型的语料）；输出就是：latent representation（节点向量，类比语言模型中的词向量）；

{:.center}
![](/postimg/deepwalk/input_output.png)  
图2. DeepWalk输入输出示意  
{:.center}

deepwalk算法学习出一个社交关系的潜在表示空间$\mathbb{R}^d$，这种潜在的表示编码了社区结构，所以社区结构可以被很容易的通过标准的聚类算法挖掘出来。这个示例是deepwalk作用在Karate网络上的产生的二维表示，表示了在输入网络和嵌入网络社区结构的关系。节点颜色代表输入网络中基于模块度的聚类效果。

文章的贡献：
1. 用深度学习来分析graphs，建立了一个健壮的适合于统计模型的表示方法。Deepwalk通过short random walks学习结构规律；
2. 用数据少，而且效果好；
3. 可扩展性。

### **三、学习社交表示**
建立的模型所应该具备的特性如下：  
1. 适应性： 真实的社交网络是不断变化的，可以增量训练（新的社交关系的增加不应要求重新训练全部数据）。
2. 社区感知：节点在潜在维度上的距离，应该能表示网络中成员节点的社交相似度。能泛化表示网络的同质性。
3. 低维度：学习的向量维度不能太高。（应该是远远小于节点规模N的）
4. 连续性：网络中社区成员可能有细微差别，这需要一个连续的表示方法，才能得到一个健壮的分类。

#### 1、随机游走
以$v_i$为根的随机游走表示为$\mathcal{W}\_{v_i}$，这是一个随机过程，而$\mathcal{W}^1\_{v_i},\mathcal{W}^2\_{v_i},…,\mathcal{W}^k\_{v_i}$就是$v_i$的游走邻居节点。这样就可以使用一大串的随机游走来提取网络结构信息。捕获社区结构的同时，随机游走也带来了两个好处：①容易并行化；②短随机游走能容许网络结构的小变化，而不需要重新计算整个网络。所以我们能使用心得随机游走串，迭代更新学习好的模型。

随机游走的很多应用。<font style = "color:red">//TODO</font>
#### 2、幂律分布
当选择随机游走来捕获图结构后，现在需要一个合适的方法运用这些信息。如果一个连接图的度分布遵循幂律分布（scale-free），我们观察到，节点在短随机游走中出现的次数也是符合幂律分布的。  
单词的频率在自然语言中也是符合类似的分布，<font style = "color:red">语言的建模技术也解释了这种分布</font>。在这里，为了强调这种相似性，文章中也展示了两个幂律分布，如图3所示。

{:.center}
![](/postimg/deepwalk/power_distribution.png)  
图3. YouTube社交网络节点和Wikipedia中词的分布情况
{:.center}

文章中讲到，文章的核心贡献也就是把运用到语言模型上的技术，改换意图（re-purposed）重新应用到建模网络中的社区结构上来了。接下来就稍微介绍下语言模型。

#### 3、语言模型

语言建模的目的是估计特定词序列在语料库中的可能性。给定一个词序列$W^n_1=(w_0,w_1,...,w_n)$，$w_i \in \mathcal{V}$,$\mathcal{V}$是词汇，我们可能想在训练语料库上最大化$Pr(w_n\|w_0,w_1,...,w_{n-1})$。在表示学习中最近的工作已着重于使用概率神经网络来建立词的一般表征，这扩展了原有的语言模型的范围，超出了其最初的目标。  
在本工作中，提出一个一般化的语言模型来探索图，通过一系列的短随机游走。这些游走可以被看作一种特殊语言里的短句子或者短语。直接模拟的是估计观察节点v_i的可能性，当给出目前为止在随机游走中访问过的所有节点为条件（条件概率），例如：

$$Pr(v_i|(v_0,v_1,...,v_{i-1}))$$  

我们的目标是学习一个潜在的表示，而不仅仅是一个节点共现(co-occurrence)的概率分布，所以我们引入一个映射函数$\Phi:v \in V \mapsto \mathbb{R}^{\|V\| \times d}$。$\Phi$表示潜在的社交表征与图中每个节点的联系。现在问题就变成估计以下的可能性了：

$$Pr(v_i|(\Phi(v_0),\Phi(v_1),...,\Phi(v_{i-1})))$$   

然而，当游走长度增长的时候，计算以上条件概率也会变得不可行。最近语言建模的relaxation，转变了预测问题的角度。首先取代用上下文来预测缺失的单词，它用一个单词来预测上下文。其次，上下文由出现在此单词左侧和右侧的单词组成。最后，它移除了问题在顺序上的约束，取而代之的是，需要模型最大化每个单词出现在上下文的概率，而不用从已给单词获知的补偿信息。根据节点表征的建模，这个也产生出优化问题：

$$\mathop{minimize}_{\Phi} -logPr(\{v_{i-w},...,v_{i+w}\}\backslash v_i| \Phi(v_i))      \tag{3}$$

我们发现这些松弛化处理是在社交表征学习中是尤其可取的（particularly desirable）。首先，顺序独立性很好的捕捉了由随机游走提供的“临近”这种感觉。更多的是，这种松弛化对于加速训练时间是非常有用的，因为它可以在一个时间点上建立一个小的模型作为一个顶点。  
解决了公式（3）的优化问题就建立了一种表征方式。这中表征方式捕获了在图局部结构的节点之间的共享的相似性。有相似邻居的节点会获得相似的表征方式（编码共同引用的相似性），允许对机器学习任务进行泛化。  
通过结合截断的随机游走和语言模型，我们形式化了一个方法，满足所有我们需要的特性。这个方法能在一个连续空间内，产生低维的社交网络的表征。它的表征编码潜在社区成员的形式。因为方法输出了有用的中间级的表征，所以它也能适应于变化的网络拓扑结构。

### **四、方法**
#### **1、概述**
在任一语言模型中，需要的输入仅仅是语料库和词汇$\mathcal{V}$。Deepwalk算法把一系列的短截断的随机游走当作它的语料库，图节点当做它的词汇($\mathcal{V}=V$)。<font style = "color:red">但是在训练之前，最好知道节点V和节点在随机游走的频率分布，但这不是必须的，我们可以在Hierarchical softmax中看到</font>。

#### **2、Deepwalk算法**
算法主要包含两部分：随机游走产生器和更新程序。随机游走生成器在图G上进行均匀采样一个节点$v_i$作为根节点，进行随机游走产生序列$\mathcal{W}_{v_i}$。每次游走均匀采样一个邻居节点，直到最后一个节点达到最大长度t。尽管在实验中设置了随机游走的最大长度，但是对于相同长度的游走过程是没有任何限制的。这些随机游走可能会重新启动（回到根节点），但是初步结果没有显示重新开始的任何优势。在实际实验中，对每个其实节点都制定了一些长度为$t$的随机游走$\gamma$。

{:.center}
![](/postimg/deepwalk/deepwalk_algorithm.png)  
{:.center}

算法1的3-9行是改算法的核心。外围循环的循环次数$\gamma$，每次都会重新在某个节点（作为根节点）开始随机游走。每次迭代都会在数据中形成一个pass，在pass中每个节点采样一个随机游走。<font style = "color:red">在每个pass的开始，产生随机序列遍历节点。虽然不是严格的要求，但是能加快随机梯度下降的收敛速度</font>。  
在内循环中，在每个节点上进行迭代。对于每个节点$v_i$，我们产生一个随机游走$\| \mathcal{W}_{v_i} \| =t$，然后用它来更新表示（Line 7）。我们用SkipGram算法[1]，通过公式(3)来更新表征。

#### 2.1 SkipGram

{:.center}
![](/postimg/deepwalk/skipGram.png)  
{:.center}

SkipGram是一种使得一个句子中出现在窗口$w$内的单词贡献概率最大化的语言模型。利用独立假设近似公式（3）中的条件概率如下：

$$Pr(\{v_{i-w},...,v_{i+w}\}\backslash v_i| \Phi(v_i))=\prod^{i+w}_{j=i-w,j \neq i}Pr(v_j | \Phi(v_i))$$

算法2迭代窗口w内，随机游走中所有可能的组合（Line1-2）。映射每个节点$v_j$到其当前的表征向量$\Phi(v_j) \in \mathbb{R}^d$，如图4。

{:.center}
![](/postimg/deepwalk/deepwalk_overview_2.png)  
图4. 映射表征
{:.center}

给定$v_j$的表征，我们要最大化在随机游走中邻居节点的概率（Line3）。我们可以借用一些选择分类器学习这样一个后验分布。例如使用逻辑回归建模前面的问题，会导致大量（百万或者十亿的的量级）的标签。这种模型需要跨集群的运算资源。为了避免这种必要性，我们使用**<font style="color:red">Hierarchical Softmax</font>**方法近似上式概率分布。
#### 2.2 Hierarchical Softmax
给定$u_k\in V$，计算$Pr(u_k\mid \Phi(v_j))$在Line3中是不可行的。计算配分函数（归一化因子）花费巨大，所以使用Hierarchical Softmax来分解条件概率。我们将节点分配到二叉树的叶子节点上，把预测问题转换为最大化层次结构中特定路径的概率，如图5。

{:.center}
![](/postimg/deepwalk/deepwalk_overview_3.png)  
图5. 层级Softmax
{:.center}

如果把到节点$u_k$的路径看作树节点的序列$(b_0,b_1,...,b_{\lceil log\|V\| \rceil})$，$(b_0=root,b_{\lceil\log\|V\|\rceil}=u_k)$那么：

$$Pr\big(u_k\mid\Phi(v_j)\big)=\prod_{l=1}^{\lceil\log|V|\rceil}Pr(b_l\mid\Phi(v_j))$$

现在$Pr(b_l\mid\Phi(v_j))$可以建模为分配到节点$b_l$的父节点的二类分类器:

$$Pr(b_l\mid\Phi(v_j))=1/(1+e^{-\Phi(v_j)\cdot\Psi(b_l)})$$

其中$\Psi(b_l)\in\mathbb{R}^d$是分配给$b_l$的父节点表征。这把$Pr(b_l\mid\Phi(v_j))$的复杂度从O(\|V\|)减少到O(log\|V\|)。我们可以通过在随机游走中为高频节点分配更短的路径，进一步加快训练过程。Huffman编码就用于减少高频元素的访问时间。  
#### 2.3 优化//TODO


### **参考文献**
[1]. T. Mikolov, K. Chen, G. Corrado, and J. Dean. Efficient estimation of word representations in vector space. CoRR, abs/1301.3781, 2013.