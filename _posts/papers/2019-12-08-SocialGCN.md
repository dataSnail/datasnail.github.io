## NoTE 4【SocialGCN：An Efficient Graph Convolutional Network based Model for Social Recommendation】

author: datasnail

[TOC]

### 一、摘要

- Collaborative Filter(CF)在推荐系统里是很成功的方法。而随着社交网络的发展，Social Recommendation已经成了一个热门的方向。大多数social recommendation模型在CF中，利用用户周围邻居的偏好来减轻数据的稀疏性。**但是，他们只考虑了每个用户局部的邻居，而忽视了用户的偏好在信息传播过程中也是受到影响的。**（PS：看来是要考虑局部关系+信息传播）
- 文中提出了一个基于GCN的社交推荐模型。基于CF思想，主要想法是借助GCN刻画用户的偏好在社交网络中如何被信息传播过程所影响。
- 用户偏好的传播是建立在layer-wise传播方式的，用**用户当前的属性**和**不包含用户属性的自由基用户隐向量**来初始化用户的嵌入表示。同样地，每个item的隐向量也是结合他的特征和自由隐向量。

### 二、杂记

1. 隐因子模型（latent factor based model）：利用user-item的稀疏反馈矩阵，把user和item表示到同一隐向量空间；然后计算两个隐向量的相似程度。
2. 社交推荐系统（social recommendation system）：利用用户间的社交网络，减轻数据的稀疏性，从而提高推荐性能。
3. motivation：在社交网络中，信息会传播到用户的邻居节点，然后是邻居的邻居，这样形成了传播过程。那如何捕捉用户之间的信息传播过程，从而提高社交推荐系统的性能呢？
4. motivation：社交网络user和item有丰富的相关性，如何设计（社交推荐）模型能灵活的利用这些相关性呢？
5. GCN的主要思想：在graph中学习迭代卷积操作。每个卷积操作就是从上一层的局部邻居集合中，（利用邻居的节点表示，）生成当前节点的表示。所以在GCN中graph structure和node feature都得到了很好的利用。
6. 主要贡献：设计深度模型，在用户嵌入和item嵌入方面，满足社交网络的独特特性。（PS：社交网络什么独特特性？）
7. 据文章讲，他们是少数几个，在社交推荐方面，把GCN用来建模社交网络信息传播的。
8. 结果：在Yelp和Flickr上能提高8%到11%。

### 三、模型思想

**输入：**用户集合U，size为M；item集合V，size为N；打分矩阵R，size是MxN；用户关系矩阵S；用户属性矩阵X，M个用户，每个用户有d1个属性；item属性矩阵Y，N个item，每个item有d2个属性；

**输出：**每个user对未知item的偏好。

![img](E:\SEU2\document_mq\NoTE Series\figures\socialGCN_framework.png)

**总体思想：**框架与基于隐因子的模型相类似，目标是把users和items编码到一个低维嵌入空间来近似user对item的偏好。例如，用U和V分别表示users和items的向量空间，那么预测的用户$a$对物品$i$的偏好程度$\hat{r}_{ai}=u_a*v_i$。

**item嵌入表示**：首先假设item的向量有两部分：属性的嵌入表示$y_i$和一个free based latent vector $q_i$。然后，把两个部分拼起来，通过一个带有非线性变换的全连接层，得到最终表示$v_i$。

**user嵌入表示：**首先用GCN来聚集邻居的feature（初始h_0是用户的属性，前文的X），并拼接自身的隐含表示，通过全连接层和一个非线性变换函数$RELU$，建模用户的偏好在社交网络中的传播，从而得到表示$h_a^{k+1}$。**但是，作者认为属性矩阵X不能很好的描述用户对信息传播的兴趣**（这个观点，[文章[2]](https://ink.library.smu.edu.sg/cgi/viewcontent.cgi?article=4574&context=sis_research)也能说明）。所以，跟item的嵌入表示相类似，这里也为每个用户定义了一个free base latent  vector $p_a$，这个自由基隐矩阵描述了每个用户不能被feature建模的兴趣。所以，把$h_0$扩充成属性$x$和$p$的拼接。如果设定GCN有$K$层，那么用户最终的嵌入表示就是：$\mathbf{u}_{a}=\mathbf{h}_{a}^{K}+\sum_{i \in R_{a}} \frac{\mathbf{v}_{i}}{\left|R_{a}\right|}$，这里多了后一项是因为，要把用户所有喜欢的item的表示向量也要融合到最终表示里。

**loss函数：**作者从其他文献中得到启发，设计了一个排序损失函数。然后又把P、Q拼在一起$\Theta_{1}=\mathbf{[P,Q]}$，F和权重矩阵W拼在一起，$\Theta_{2}=\left[\mathbf{F},\left[\mathbf{W}^{k}\right]_{k=1}^{K}\right]$，做了一个正则化：
$$
\min _{\Theta} \mathcal{L}(\mathbf{R}, \hat{\mathbf{R}})=\sum_{a=1}^{M} \sum_{(i, j) \in D_{a}} s\left(\hat{r}_{a i}-\hat{r}_{a j}\right)+\lambda\left\|\Theta_{1}\right\|^{2}
$$
在实际数据集中，只有正例，所以作者随机挑了5个没有被观察到的作为负例，参与模型训练，文献[3]也是这么做的。

### 四、实验部分

//TODO

### 五、其他说明

1. 文章[2]有实验证明用户接受到的主题和用户发布的主题，很多情况都是不一致的。举个例子，用户所关注的用户集合，他们的主题分布中，“娱乐”占大多数，但是用户所发布的内容，可能和这个分布完全不一样，可能“体育”占大多数。

### 六、参考文献

[1]. Wu, Le, et al. "SocialGCN: An Efficient Graph Convolutional Network based Model for Social Recommendation." *arXiv preprint arXiv:1811.02815* (2018).**(published in 2019 AAAI)**

[2]. Hoang, Tuan-Anh, and Ee-Peng Lim. "Microblogging content propagation modeling using topic-specific behavioral factors." *IEEE Transactions on Knowledge and Data Engineering* 28.9 (2016): 2407-2422.

[3]. Wu, Le, et al. "Modeling users’ preferences and social links in social networking services: a joint-evolving perspective." *Thirtieth aaai conference on artificial intelligence*. 2016.