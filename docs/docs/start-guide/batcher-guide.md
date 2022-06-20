---
sidebar_position: 1
description: "在游戏开发中享受不用关注 Draw Call 的快乐。"
---

# 新 UI 渲染批次合并指南

在官方文档的进阶主题中，有一个 [UI 渲染批次合并指南](https://docs.cocos.com/creator/2.4/manual/zh/advanced-topics/ui-auto-batch.html)，在服务包的 **多纹理渲染**、**重构动态图集** 等新特性的出现后，对如何合并渲染批次需要有全新的理解。

如果你未阅读过官方的指南，可以先阅读一遍。

---
## 什么是多纹理渲染？

在以前的认识里，我们知道相邻的节点使用不同的纹理（Texture）会导致不能合并批次。

其根本原因是纹理是使用 uniform 变量传给着色器的，而需要合并批次的话不允许每次渲染都拥有不同的 uniform 变量值。

服务包实现的合批方法是先设置好多个 uniform 变量，比如将 8 张纹理写入到 "texture1" "texture2" "texture3"... 的 8 个 uniform 变量中，然后在着色器里再判断应该在渲染时使用哪个 uniform 变量。

这样的话如果所有渲染都只用这 8 张纹理的话，就都能合并为 1 个批次。

这种做法要求设备需要支持采样多个纹理，而在现代绝大多数设备中这不是问题，至少都支持采样 8 张纹理。

当然除了这种方法，还有另外几种进行多纹理合批的方法，例如 "Texture Array"、"Bindless"，但都有实用性与兼容性的问题。

:::info 提示

以这种方式实现的多纹理渲染并不是没有弊端的：

因为会多传递一个顶点属性，并且需要在着色器中去判断该使用哪个纹理，导致**合并批次并不一定会提升性能**。

所以我们建议在多个档次设备中实际测试项目是否使用多纹理渲染的性能差距。

如果你还有所担心，就像我们在实现这个功能之前一样，可以看看这些：

**PixiJS 引擎在 2016 年发布的 v4 版本就已经正式实装了多纹理渲染机制！**[资料出处](https://medium.com/goodboy-digital/gpu-multi-texture-sprite-batching-21c90ae8f89b)。

**Phaser 引擎在 v4 与 v3 版本都实装了多纹理渲染机制（2019 - 2020年）**[资料出处](https://www.patreon.com/posts/39665256)。

:::

---
## 为你的项目启用动态合图

在项目之前的开发中，我们通常会关闭动态图集，更倾向于靠静态图集或者自动图集达到降低 Draw Call 的目的。

导致这个情况最重要的问题是不能复用图集的废弃区域，随着游戏的运行图集会完全用完，引擎只提供了在切换场景（Scene）后重置所有图集的机制来解决这个问题。

但对于大部分项目来说，这种治标不治本的机制基本等于没有解决这个问题。

现在，服务包几乎重构了整个动态合图系统，你可以考虑启用它了。

:::note 提示

开启动态图集常见的反对意见是：

在部分小游戏平台里，启用动态图集会有保留 Image 对象所占用的内存空间很大的问题。

我们建议：

- 请实际测试是否启用动态图集的内存占用差距。
- 有没有一种可能，只是说可能，出现不能接受的内存占用大小是因为你的项目根本就不做任何资源的释放呢？

:::

---
## 充分利用动态合图

下面几个建议能让你发挥出动态合图的潜力：

### 放宽能参与合图的纹理尺寸限制

**动态图集会自动进行多纹理合批，你可以放心地使用多达 7 张图集而不用担心交叉渲染导致的打断批次！**

有了这个新特性，你可以根据项目的具体情况来放宽能参与合图的纹理尺寸限制。

```js
cc.dynamicAtlasManager.maxFrameSize = 1024;     // 推荐 512、1024 甚至 2048
```

:::tip 

服务包会自动将图集的最大数量调整至（设备能同时采样纹理数 - Char 缓存模式自动合批图集数），这个值默认为 `7`。

:::

### 无需管理动态图集，只需要释放资源

**动态合图会在纹理被释放的同时释放其在动态图集使用的空间。**

有了这个新特性，你不需要关心动态图集，只需要做好应有的资源释放，就能保持动态图集的长期有效。

### 更加细致地优化图集的使用效率

除了通过调整纹理的 `packable` 属性可以控制纹理是否会参与动态合图之外。

**还可以控制组件是否默认参与动态合图，也可以控制单个组件是否参与动态合图。**

可前往 [动态合图](../user-guide/dynamic-batcher/dynamic-batcher-intro.mdx) 的文档了解详情。

在上面我们推荐可以将纹理尺寸限制放宽到 `2048`，这听起来貌似有点离谱，但只要规划得当确实可行，比如：

- 禁止优化程度有限但尺寸巨大的纹理参与动态合图
- 分模块存放资源，禁止冷门（如活动界面）的纹理参与动态合图或尽早地释放掉
- 在资源已经一团糟的项目中，可通过代码禁止某个界面下所有的渲染组件参与动态合图

完成上面几点这可能需要一些工作量，但能将动态图集用在刀刃上，发挥更大的作用。

---
## Label 不再是合批噩梦

在项目之前的开发中，我们可能会使用字体图集、调整节点顺序，甚至修改渲染流程来解决 Label 的性能问题。

引擎提供的 Bitmap 和 Char 两种缓存模式在稍大一点的项目上就显得力所不及了：

- Bitmap 缓存模式：字体纹理会打入动态图集，但动态图集却无法复用，随着游戏的进行，图集用完则直接失去作用。

- Char 缓存模式的缺点：还是无法复用，并且只有一张图集，图集用完则直接无法渲染，应该没人能接受游戏可能跑着跑着字就全部消失了的情况。

但，**服务包重构了 Char 缓存模式，除了解决不能复用的问题之外，由于支持了多纹理渲染，所以既能与动态图集合批，还有最多 8 张字体图集可以使用！**

### 脱胎换骨的 Char 缓存模式

**如果你不知道该选择什么缓存模式，那就遇事不决，先选 Char 缓存模式。**

虽然 Char 模式也有一些缺点，但由于它既能与动态图集一起合批，还是是按字符进行复用的，所以相比 Bitmap 模式它有着更高的性能优势。

不用担心字符图集会被用完，内部会用引用计数自动释放废弃字符所占用的空间。

但 Char 缓存模式不适合下面的场景：

- 无法显示带有像 emoji 的字素簇的字符串，这种字符串现在不能被完美地分割成单个字符，所以 Char 缓存模式也就不能正常显示了。
- 接上条，像聊天消息、输入框这类不可控的内容文本都不建议用 Char 缓存模式。
- Char 缓存模式不支持一些字体样式，可以在官方文档中了解详情。
- 巨大的字体大小（比如几百的）可能会瞬间占满整张字符图集，字符图集虽然有 8 张但也不能这么霍霍。

### 兜底的 Bitmap 缓存模式

即使不能选择 Char 缓存模式，Bitmap 缓存模式也能成为批次的最后一道防线。

在解决了动态图集的复用问题后，Bitmap 缓存模式的纹理也会使用引用计数自动释放，并且不会有 Char 缓存模式无法显示字素簇的问题。

但当然，Bitmap 缓存模式也不是万能的，如果遇到了下面这种情况，就需要考虑使用调整节点顺序这样的老办法来解决了：

- 巨大的字体大小也会瞬间占满整张动态图集，动态图集也不能这么霍霍。
- 在大量的 Label 需频繁改变文本的情况下，请使用性能分析工具检查动态图集的性能消耗，避免合批的弊大于利。

:::caution 注意

无论使用哪种缓存模式，在做缩放动画时不要对 `fontSize` 属性进行缓动，这会导致每帧都需要重新生成文字纹理，造成巨大的性能负担，可以使用节点的 `scale` 来代替。

:::

### 注意事项

- **Char 缓存模式所使用的字符图集与动态图集不是一个东西**

有多种因素导致没有让 Char 缓存模式直接使用动态图集来实现，这个原因在 Char 缓存模式的原理文档中有详细解释。

- **Char 缓存模式依然不能在图集用完的情况下正常渲染**

原因有以下几点：

- 我们认为 8 张数量已经够多了，8 张都用完的情况大部分是没有合理搭配使用两种缓存模式
- 8 张是多纹理渲染的上限，这意味着如果超过 8 张，1 个 Label 有 100 个字，就可能有 100 个 Draw Call

---
## 总结

以上就是新合批指南的全部内容了，稍微总结一下渲染批次合并的几个要点：

- 启用动态合图，只需要合理地释放资源即可保持动态合图的一直有效
- 优先使用 Char 缓存模式，不适合则使用 Bitmap 缓存模式，都不适合则采用老方法
- 不要优先考虑修改节点顺序这种需要维护成本的优化方式

如果你对批次合并还有着更高的需求，可以阅读 [进阶合批指南](./advance-batcher-guide.md)。