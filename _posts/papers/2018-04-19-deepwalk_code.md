---
layout: post
categories: Papers
title: deepwalk：Online Learning of Social Representations论文实践
author: datasnail
comments: true
show: index
intro: Deepwalk论文部分实践。
paperTime:
tags:
- 技术学习
---

与[deepwalk文章](http://www.datasnail.cn/papers/2017/12/29/deepwalk_paper.html "deepwalk论文笔记")相关。  
在网上下载了源码，在ubuntu上运行，跑了一个Karate俱乐部的例子。

```python
deepwalk --input example_graphs/karate.adjlist --output /usr/projects/kar.embeddings --representation-size 2 --walk-length 20  --window-size 2 --number-walks 400
```

--representation-size 表征向量长度；默认值64  
--window-size  在skipgram里，考虑节点前后多少个邻居节点；默认值5   
--number-walks 进行多少次游走；默认值10   
--walk-length 随机游走生成语料时，随机游走长度（句子长度）；默认值40  