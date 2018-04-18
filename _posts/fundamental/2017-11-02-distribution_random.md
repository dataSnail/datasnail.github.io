---
layout: post
categories: Fundamental
title: 常见的概率分布以及生成随机数
author: datasnail
comments: true
show: index
intro: 总结概率分布概念、公式及表示方法；程序生成下符合此种分布的随机数列。
paperTime:
tags:
- 基础知识
---

### **一、概率分布**
#### **1、均匀分布(离散型均匀分布和连续型均匀分布)**
相同长度间隔的部分概率等可能。均匀分布式由两个参数a,b定义，是数轴上的最小值和最大值。

如果连续性随机变量$X$具有如下的概率密度函数，则称$X$服从$[a,b]$上的均匀分布（uniform distribution，记作 $X \sim U(a,b)$

概率密度函数：

&nbsp;
$$
f(x) = \begin{cases} \frac{1}{b-a} & for\text{ }a\le{ x \le b} \\\\
0 & \text{elsewhere} \\\\
\end{cases}
$$

累计分布函数：

&nbsp;
$$
F(x) = \begin{cases} 0 & for\text{ }x \lt a \\\\
\frac{x-a}{b-a} & for\text{ }a\le{ x \le b} \\\\
1 & for\text{ }x \gt b \\\\
\end{cases}
$$

#### **2、正态分布**
正态分布式生活中常见的分布。表示为$N(\mu, \sigma^2)$

概率密度函数：

$
f(x) = \frac{1}{\sqrt{2\pi} \sigma}exp(-\frac{(x-\mu)^2}{2\sigma^2})
$

其中$\sigma$是标准差，而$\mu$是均值。函数图像以均值为对称轴，随着标准差越大越扁。

{:.center}
![uniform_isntance](/postimg/gaussian_instance5.png)
{:.center}


#### **3、泊松分布**
泊松分布是一种常见的**离散概率分布**，比较适合描述单位时间内，随机事件具体发生次数的概率。[3]\\
若$X$服从参数为$\lambda$的泊松分布，记为$X\sim \pi (\lambda )$，或记为$ X \sim P(\lambda)$

概率密度函数：

$
P(X=k) = \frac{\lambda^k}{k!}e^{-\lambda} ,k=0,1,...
$

参数$\lambda$是单位时间（或单位面积）内随机事件的平均发生率。  
文献[4]用泊松分布建模**转发推文事件**，累积分布函数如下：   
$$
f(x;\lambda) = \begin{cases} \ 1-e^{-\lambda x} & \text{ }{ x \ge 0} \\\\
0 & \text{ } { x \lt 0} \\\\
\end{cases}
$$  
$\frac{1}{\lambda}$是间隔时间（用户平均等待时间）。

#### **4、指数分布**
概率密度函数：

$
P(X=k) = \frac{1}{\theta}e^{\frac{-x}{\theta}} ,x>0
$

其中$\theta >0$为常数，则称$X$服从参数$\theta$的指数分布。

指数函数有一个重要的特性：无记忆性，即如果一个随机变量呈指数分布，则有如下结果：

当$s,t\gt 0$时，有$P(T>s+t|T>t)=P(T>s)$
#### **5、二点分布（伯努利试验）**
若随机变量X取两个值0，1，且有概率分布P(X=1)=p,P(X=0)=q=1-p,则称X服从二点分布。
#### **6、二项分布**
若随机变量X的可能取值为0，1，2，…，n，取到这些值的概率为$P(X=k) = C_n^k p^k(1-p)^{n-k} (p \gt 0,k=0,1,2,...,n)$，则称X服从二项分布，记为$X \sim B(n,p)$.

二项分布就是在相同的条件下，独立重复进行n次bernoulli试验,n=1时，就是二点分布。

### **二、随机数生成**
以下代码可能导入的包：
```python
import random
import matplotlib.pyplot as plt
import numpy as pd
from matplotlib import animation
import scipy.stats as stats
```

使用程序生成一个随机数，有很多方法。
```python
random.randint(1,100) #生成一个从1到100的整数
random.random() #生成一个从0到1的随机double数
random.uniform(1,100) #按照均匀分布，生成一个从1到100的double数,参数a=1,b=100
```

#### **1、均匀分布**
可以直接用uniform()生成若干数，即符合均匀分布：

```python
random_result = []
number_size = 100000
for i in xrange(number_size):
    random_result.append(random.uniform(1,100)) 
# random.uniform(1,100)
#draw
num_bins = 50 #直方块数量
plt.hist(random_result,num_bins, normed=1, facecolor='blue', alpha=0.5)
#函数图像
plt.plot([0,100],[0.01,0.01],color='red',linewidth = 2)
#显示
plt.show()
```

肯定是number_size设置的越多，最后得到的分布月趋向于平均，这就是所谓蒙特卡洛采样吧。

{:.center}
![uniform_isntance](/postimg/uniform_instance.png)
{:.center}

#### **2、正态分布**
利用np包的`random.randn(d0, d1, ..., dn)`函数：
> For random samples from $N(\mu, \sigma^2)$, use: \\
> sigma * np.random.randn(...) + mu

`np.random.randn()` 返回一个符合$N(0, 1)$的样本。
```python
random_data = 100+0.1*np.random.randn(100000)
#直方图
num_bins = 50 #直方块数量
plt.hist(random_data,num_bins, normed=1, facecolor='blue', alpha=0.5)
#函数曲线
x=np.arange(99.5,100.5,0.01)
y=(np.exp(-pow((x-100.),2)/(2*0.01)))/(np.sqrt(2*np.pi)*0.1)
plt.plot(x,y,color='red',linewidth = 2)
#显示
plt.show()
```

{:.center}
![uniform_isntance](/postimg/gaussian_instance.png)
{:.center}

### **参考：**

[1]. https://baike.baidu.com/item/%E5%9D%87%E5%8C%80%E5%88%86%E5%B8%83/954451  
[2]. https://zh.wikipedia.org/wiki/%E9%80%A3%E7%BA%8C%E5%9E%8B%E5%9D%87%E5%8B%BB%E5%88%86%E5%B8%83  
[3]. http://www.ruanyifeng.com/blog/2015/06/poisson-distribution.html  
[4]. Lee, Kyumin, et al. "Who will retweet this?: Automatically identifying and engaging strangers on twitter to spread information." Proceedings of the 19th international conference on Intelligent User Interfaces. ACM, 2014.
