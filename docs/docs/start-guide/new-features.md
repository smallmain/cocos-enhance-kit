---
sidebar_position: 3
description: "了解并上手增强包提供的所有其他新特性。"
---

# 上手其它新特性

除了前面提到的多纹理渲染、新动态图集、新 Label Char 缓存模式等特性之外，还有一些其它的也很实用的新特性。

---
## 高 DPI 文本渲染

以前我们会使用将 Label 字号放大一倍，Label 节点缩小一倍的方式去解决字体模糊的问题。

而现在不需要了，你可以通过一句代码调整渲染比例：

```js
cc.sp.labelRetinaScale = 2;     // 渲染文本时纹理的缩放倍数，默认值为 1.
```

![labelscaledemo](./assets/labelscaledemo.png)

> 图片中，上方的是开启后效果，下面是未开启效果。

**推荐你根据设备像素比（devicePixelRatio）来动态设置该值，并且该值不要大于 `2`，这不会带来更好的效果，但却将字体纹理放大了数倍，会影响到游戏整体性能，影响动态图集的效率。**

可前往 [高 DPI 支持](../user-guide/text-render/text-high-dpi.md) 文档了解更多详情。

---
## 使用 SpriteFrame 进行 Spine 换装

官方文档中介绍了替换 attachment 对象进行换装的方法，但如果动画中有切换 attachment 的关键帧，这种方法就失效了。

还有一种方法是修改 attachment 的 region 对象来进行换装，但这种方法引擎没有直接支持，所以增强包对其进行了支持。

只需要一句代码即可使用 cc.SpriteFrame 的数据修改 attachment 的 region 对象数据：

```js
skeletonComponent.setRegionData('Head', 'Head', new sp.RegionData(spriteFrame));
```

![changespine](./assets/changespine.png)

> 图片中是被换头的小男孩。

这样做是直接修改了 SkeletonData 的数据，所有使用该数据的 Spine 组件都会受到影响（被换头），但我们提供了克隆 SkeletonData 数据的接口，可前往 [Spine](../user-guide/spine/spine-intro.mdx) 文档了解更多详情。

:::tip 提示

还有一个小特性，Spine 组件也支持了自动参与动态图集，并且也支持了和其它组件合批。

:::

---
## 给 RichText 使用自定义材质

虽然加上去也简单，但这可能是很少用得到的功能，主要还是我们看到几乎所有渲染组件都可以自定义材质，这个组件却不可以。

可前往 [RichText 自定义材质](../user-guide/text-render/text-richtext.md) 文档了解更多详情。
