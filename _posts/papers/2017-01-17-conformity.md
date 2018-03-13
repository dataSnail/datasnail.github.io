---
layout: post
categories: Papers
title: Confluence：Conformity Influence in Large Social Networks
author: datasnail
comments: true
show: index
paperTime:
tags:
- 论文阅读
---

关键词： 社会心理学、一致性（Conformity）

会议（年份）： KDD'13

相关作者：唐杰

数据集：Flickr,Gowalla,Weibo and Co-Author

#### **一、文章摘要**

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;一致性（Conformity）是一种社交影响力，为了合群（fit in with a group）而导致观点和行为的改变。文章中用多个数据集，研究了在改变用户线上行为中一致性的作用。并且定义了三种一致性:**个体（individual）、朋友（peer）和群体（group）层次**。提出了confluence模型来形式化社会一致性的作用。<span style="color:green">Confluence能区分和量化不同类别的一致性的作用。</span>最后，为扩展到大规模社交网络，提出了分布式的学习方法，能在线性时间的速度有效的构造出Confluence模型。（Confluence model,在此可以翻译成融合模型）。并用数据集证明了一致性现象的存在。利用已执行信息，Confluence可以精准预测用户行为，实验表明Confluence有效提高预测精度5%~10%。

#### **二、文献相关**

**1、概念解释**：<br>
**一致性**是将态度、信念和行为与群体规范相匹配的行为<sup>[8]</sup>。是对等（朋友）影响力和群体压力的结果。<br>
**2、相关研究**：<br>
一致性首次在心理学中被研究[17]，在经济学中，Bernheim[3]发现有时候人们愿意conform simply(完全遵守)，因为意识到不符合群体规范会妨害他们的地位。而且进一步提出了社会一致性的理论和模型来描述一致性过程。 <span style = "color:red">然而，缺乏真实数据，只研究了理论部分。</span><br>
结合社交网络，Bond<sup>[4]</sup>选举投票，如果意识到朋友投了政治选票，他自己有更大的可能性投。Bakshy<sup>[2]</sup>发现一个人的朋友点击了广告，这个人会更可能点击广告。<span style="color:red">（行为的一致性）</span><br>
**从更宽的视角来看，一致性可以被看做是一种特殊的社交影响力。**<br>
引出了社交影响力之后，文章对于现有的社交影响力的研究做了一个小总结，把社交影响力的研究粗略的分成三类：
**<br>1、Influence testing<sup>[1,9,20]</sup>；**<br>
**2、Influence quantification<sup>[12,13,23,32]</sup>；**<br>
**3、Influence Maximization models<sup>[6,18]</sup>；**<br>
<span style="color:red">然而，以上工作大多关注于定性研究社交影响力，例外的是Tang[32]提出了关于话题亲和度传播（TAP）方法来量化话题层次的社会影响力，然而也没有区分对等影响力和群体一致性。</span><br>

挑战：<br>
1. 如何统一定义不同类别的一致性；【不像peer influence主要考虑两个连接的好友如何相互影响，一致性发生在不同的情境，而且有不同的形式】
2. 怎样构建一个计算模型来学习不同的一致性因素；
3. 如何在真实的大规模网络中验证提出的模型；

应对以上挑战：
1. 定义在社交网络中的一致性影响分析问题；
2. 分类一致性：个体一致性、朋友一致性、群体一致性；
3. 提出融合模型来形式化社交一致性问题为一个概率因子图模型；

融合模型可以区分和量化不同一致性作用的不同。

#### **三、问题定义**
群组的界定：
1. 网站提供；
2. 通过算法发现[27]；【本文使用的是2004年newman的快速发现算法】

输入：给定有属性的网络$G=(V,E,C,X)$和行为历史记录$A=\{(a,v_i,t)\}_{a,i,t}$,$X$表示$N*d$的属性矩阵，$x_ij$代表用户$v_i$的第$j$个属性。
目标：求解用户的行为如何符合他的朋友或者社区一致。

定义：（公式先见原文）
定义一：（个体一致性）用户$v$与所有朋友$v'$一致的行为比上用户$v$的行为总数；
定义二：（对等一致性）用户$v'$对用户$v$影响动作数量比上用户$v'$的动作数量；
定义三：（群组一致性）我们有证据用户$v$与群组一致的行为个数比上用户比例达到百分比为$\tau$的行为的个数；

用户可能属于多个群组，所以在不同的群组用户有不同的群组一致性。

问题定义：
给定1）属性附加网络（attribute augmented network）$G=（V,E,C,X）$ 2）行为历史$A=\{(a,v_i,t)\}_{a,i,t}$,如何量化每个用户不同类型的一致性的重要性？变成了如何找到一个模型参数$\theta^\star$最大下列的条件概率：$\theta^\star={argmax}_θP_θ(Y^t,G,A)$；

第二个问题是，如何在统一的模型中学习参数预测用户在网络中的行为，即求得$Y^\star = argmax_{Y^{t+1}}P_{\theta^\star}(Y^{t+1}\|G,A)$

#### **四、一致性感知的因子图模型**

通过条件概率$P_\theta(Y^t\|G,A)$，通过用历史行为记录构建训练用例，求得合适的参数$\theta$最大化联合概率分布。然后把$\theta$用到预测用户未来的行为，基于学到的参数$\theta$求得最大条件概率$P_\theta(Y^{t+1}\|G,A)$。<br>
如何求解：<br>
直接最大化$P(Y\|G,A)$是非常难的，因子图模型提供了一个方法，通过分解全局的概率为多个局部因子函数的乘积。每个因子依赖于图中的变量子集。<br>
这里用到**用户自身属性特征**和**三个一致性特征**。<br>
individual conformity：$g(y_i,icf(v_i))$代表了用户$v_i$的行为和他individual conformity的关系；<br>
peer conformity：$g(y_i,y'_j,pcf(v_i,v_j)$代表了用户$v_i$的行为和他的peer conformity的关系；<br>
group conformity：$g(y_i,gcf^{\tau}(v_i,C_k))$代表了用户$v_i$的行为和他的与$C_k$的一致性的关系；<br>

公式：xxxx
