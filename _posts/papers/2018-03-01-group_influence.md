---
layout: post
categories: Papers
title: Social Influence Locality for Modeling Retweeting Behavior 论文笔记
author: datasnail
comments: true
show: index
intro: Social Influence Locality for Modeling Retweeting Behavior论文阅读、想法记录。
paperTime:
tags:
- 论文阅读
---

#### **一、概要**
这篇文章是从社交影响力找到的，是清华大学张静的一篇博士论文，从里面的引用找到了在2013年发在AAAI下IJCAI（CCF_A）的这篇文章，名为《Social Influence Locality for Modeling Retweeting Behavior》。  
文中提出**social influence locality**，而在其博士论文中应该等同于“群体影响力”了，从会议论文的内容看，也应该算是一种群体影响力。文中把social influence locality实例成两种衡量函数pairwise influence和structure Influence，并把这类影响力运用到转发行为预测上，取得了较好的效果。  
对social influence locality的定义如下图：   

{:.center}
![](/postimg/social_inlfuence_locality/defination_of_social_influence_locality.png)   
图1. social influence locality 定义
{:.center}  

在网络G中，用户u具有一个**$\tau$中心网络**($\tau-ego network$)[图2即用户v的一个$\tau=2$的中心网络]，social influence locality为一个量化函数，函数的作用是衡量用户的行为如何被中心网络中的用户影响。用户的行为是有（1）或者无（0），那么这个问题就可以归结为一个分类问题。

{:.center}
![](/postimg/social_inlfuence_locality/tau_ego_network.png)   
图2. 中心网络示意图
{:.center}  
  
论文中定义的$\tau-ego network$，可以看到$\tau \ge 1$，就是用户的$\tau$度好友，文中在此也没有对参数$\tau$做细致的研究，个人愚见对用户的感知群体（该用户周围的能影响到用户的n度好友集合）做一个细致的探讨，应该能更加细致的描述该用户受到的影响力大小，即在此进行**感知群体发现**。  
论文指出三处有意思的结果：
1. 证明social influence locality的存在。
2. 尽管用户的转发行为正比于用户活跃邻居的数量，但是文章发现转发行为跟该用户邻居形成圈的数量**负相关**，例如，当用户邻居超过10个，邻居圈从1个到2个，用户转发的概率会降低10%，见图3。ps:邻居形成的圈如图2所示，VCHD、VEF都是组成的邻居圈。
3. pairwise influence跟*普通*user不同（原文：Pairwise influence differs from users），pairwise influence每上升0.05，转发可能增长大约10%，见图4。

{:.center}
![](/postimg/social_inlfuence_locality/structure_influence.png)   ![](/postimg/social_inlfuence_locality/pairwise_influence.png)  
{:.center}  
数据集：新浪微博，170万用户40亿条边，平均没人200关注者。爬取方法：首先选择100随机用户，抓取关注者，应该是广度抓取。  
#### **二、采样测试证明social Influence locality的存在性**   
检测个体的转发行为是否具有影响力，这是一个因果推断问题[Pearl, 2009]。此类问题的经典方法是设计随机采样实验。主要思想是把用户分成两组：treatment group和control group。在treatment group中的用户具有“激活邻居”，而control组中没有。但是这样设置不合理，如果control group中用户没有“激活邻居”，那么用户看到这条微博的可能就很小了，更不可能转发。所以将仅有一个激活邻居的用户分配到对照组，而把两个或两个以上激活邻居的用户放到treatment group。  
**原文抛出了一个问题：**这样实验中存在选择偏差，即使实验组中的用户并没有两个或两个以上的邻居，他的转发概率也有可能高于对照组。并且文献[Arala et al., 2009]中在产品购买行为的影响力分析中，对这类选择偏差问题也有研究。  
> 为了解决上述选择偏差，采用癖好分数匹配采样法（matching based sampling），思想是首先固定treatment group中的用户为拥有两个或两个以上激活邻居的用户。然后对于treatment group中的每个用户，从原始的control group中寻找与之最匹配的用户放入新的control group中。采用一个逻辑回归训练分类器，使用它对每个用户拥有两个即两个以上激活邻居的概率进行估计。基于次改了，对treatment group中的每个用户，从control group中挑选阈值概率查最小的用户相匹配。（基本来源于原博士论文）  

$$ v = arg min_{v' \in V_C}||p_u-p_{v'}||$$  

为了学习逻辑回归模型，就需要最大化一下的似然函数：  

$$\mathcal{O} (\alpha,\beta)=\prod_{v \in V_T}P(T=1|X_v)\prod_{v \in V_C}P(T=0|X_v), P(T=1|X_v)=\frac{1}{1+e^{-(\alpha X_v+\beta)}}$$

$X_v$是特征的向量，描述了用户v的特征属性。

{:.center}
![](/postimg/social_inlfuence_locality/matching_sampling.png)  
图5. 癖好分数匹配采样法的检测结果
{:.center}  

> 从图5可以看出不同时间对应实验中，两个激活邻居的激活用户比例大约是有一个激活邻居用户比例的两倍，即$\frac{N^T=1}{N^T=0} \approx 2$。同时，实验组中激活用户的比例随着激活邻居增加而增加。检测结果表明激活邻居对目标用户转发行为的影响力的确存在。同时，在原帖发出48小时之后，实验组中激活用户的比例中随着激活邻居数增加的增长了逐渐变缓，说明影响力随时间在衰减。（基本来源于原博士论文）

#### **三、建模influence locality**  
主要考虑pairwise Influence和structure influence两种影响力。  
**pairwise influence**：影响力可能存在于直接连接的两个用户，也可能存在于两个不直接连接的用户。为了量化此类影响力，我们转化这个问题为，通过**重启的随机游走**（random walk with restart，RWR）衡量图中两个节点的的相关性[Lovasz, 1993][Sun et al., 2005]。在用户的$\tau-ego$网络中执行RWR，为每个激活邻居$v_i$计算随机游走概率$p_{v_i}$。随机游走概率解释为激活邻居的影响力最终如何通过网络连接到达的用户v。例如，在图1中，用户B只能通过一条路径到达v，而F有很多不同的路径，通过E和其他两个节点连接到v。图4展示了用户转发微博概率在中心网络中所有激活邻居的，平均随机游走概率条件下（a），在累积随机游走概率条件下（b）。从(a)(b)两张图中，可以看到机遇随机游走的pairwise influence对于预测转发行为是一个很好的因素。  

**structure influence**：考虑influence locality如何跟激活邻居的内部结构相关联。[Ugander et al., 2012]指出结构多样性可以被用作预测用户参与度的正比因素（positive predictor）。那么结构多样性能影响转发行为么？如何定义统一的函数来衡量这种作用？通过实验，图3，用户转发可能与环（激活邻居用户做组成的环）数量成负相关，这与[Ugander et al., 2012]的研究相反。 出现这种现象可能是因为转发具有的目的性。[Boyd et al., 2010]发现微博中转发的一个重要目的就是影响别人。所以，用户可能就很快失去转发的兴趣了，当他发现许多social circle已经知道这条信息了。 文章中考虑环数量的时候，计算的是跟用户有双向关注关系的用户所组成的环，文中给出这么选择的理由是仅单向边对于观点交互无意义。[Huberman et al., 2009]中也在实验中证明在稀疏和简单网络中的真正朋友（actual friends）更能驱动用户使用微博。  

$$Q(S_v,G_v^{\tau}) = w * g(S_v,G_v^{\tau})+(1-w) * f(S_v,G_v^{\tau})$$

$g(S_v,G_v^{\tau})+(1-w)$是pairwise influence，$f(S_v,G_v^{\tau})$是structure influence。在实验部分，文章把influence locality应用到个体的转发行为预测中，并给出了$g$和$f$的多种定义，见图6。  

{:.center}
![](/postimg/social_inlfuence_locality/different_function.png)  
图6. $g$和$f$的多种定义和在实验中的表现结果
{:.center}  

#### **四、实验**  
文章在实验中，有考虑了用户的其他6个特征[性别、认证转台、粉丝数量、parasocial following relationships**?**、互惠关系（reciprocal following relationships）和历史微博]，并结合逻辑回归方法构建了两个算法LRC-Q（利用influence locality 函数），LRC-B（只用基本特征），LRC-BQ（都用），结果如图7。

{:.center}
![](/postimg/social_inlfuence_locality/experiment_result.png)  
图7. 实验结果
{:.center}  

**后记**：文中研究的social influence locality，个人感觉本质上就是群体影响力的一个不全面的体现，在博士论文中也定义了群体影响力。而且文中也是把最终应用的落脚点放在个体转发行为预测。群体影响力是个体在（一个）群体环境中，由于群体氛围、性质的不同，对个体的行为、情感等方面造成的作用效果。所以，我选取了结果的一部分（个体行为），开始了对群体影响力的研究，从群体影响个体行为的角度开始了寻找文献的漫漫长路。但是目标终归是个体行为，所以在其中，永远避免不了对个体的特征、规律方面的描述，这并没有错，在这里的讨论花费了太多没用的时间。

#### **五、文献**
**[Pearl, 2009]** Judea Pearl. Causality: Models, Reasoning and Inference. ambridge University Press, 2009.  
**[Arala et al., 2009]** Sinan Arala, Lev Muchnika, and Arun Sundararajan. Distinguishing influence-based contagion from homophily-driven diffusion in dynamic networks. PNAS, 106(51):21544–21549, 2009.  
**[Lovasz, 1993]** L´aszl´o Lovasz. Random walks on graphs: A survey. Combinatorics, 2(1):1–6, 1993.  
**[Sun et al., 2005]** Jimeng Sun, Huiming Qu, Deepayan Chakrabarti, and Christos Faloutsos. Neighborhood formation and anomaly detection in bipartite graphs. In ICDM’05, pages 418–425, 2005.  
**[Ugander et al., 2012]** Johan Ugander, Lars Backstrom,Cameron Marlow, and Jon Kleinberg. Structural diversityin social contagion. Proceedings of the National Academy of Sciences, 2012.  
**[Boyd et al., 2010]** Danah Boyd, Scott Golder, and Gilad Lotan. Tweet, tweet, retweet: Conversational aspects of retweeting on twitter. In HICSS ’10, pages 1–10, 2010.  
**[Huberman et al., 2009]** B. Huberman, D. M. Romero, and F. Wu. Social networks that matter: Twitter under microscope.In First Monday, volume 14, pages 118–138, 2009.  