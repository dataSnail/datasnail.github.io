---
layout: post
categories: fundamental
title: EM算法
author: datasnail
show: index
comments: true
intro: EM大法。源于李航老师《统计学习方法》
tags:
- machine learning
---

### 一、基本认识
EM（Expectation Maximization Algorithm）
EM算法是一种**迭代算法**，是1977年由Demspster等人总结提出，**用于有隐含变量的概率模型参数的极大似然估计，或极大后验概率估计**。  
EM算法是**初值敏感**的，而且EM算法**不能保证**找到全局最优解。  

为什么要迭代？有什么困难？
