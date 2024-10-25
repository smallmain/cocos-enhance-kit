---
sidebar_position: 3
description: "了解并上手社区版提供的新特性。"
---

# 新引擎特性

社区版添加了一些实用的新特性，帮助你更好地开发游戏。

## 支持 SpriteFrame 给 Spine 换装

官方文档中介绍了替换 attachment 对象进行换装的方法，但如果动画中有切换 attachment 的关键帧，这种方法就失效了。

还有一种方法是修改 attachment 的 region 对象来进行换装，但这种方法引擎没有直接支持，所以社区版对其进行了支持。

只需要一句代码即可使用 cc.SpriteFrame 的数据修改 attachment 的 region 对象数据：

```js
skeletonComponent.setRegionData('Head', 'Head', new sp.RegionData(spriteFrame));
```

![changespine](./assets/changespine.png)

> 图片中是被换头的小男孩。

这样做是直接修改了 SkeletonData 的数据，所有使用该数据的 Spine 组件都会受到影响（被换头），但我们提供了克隆 SkeletonData 数据的接口，可前往 [Spine](../user-guide/spine/spine-intro.mdx) 文档了解更多详情。

## 支持 RichText 自定义材质

可前往 [RichText 自定义材质](../user-guide/text-render/text-richtext.md) 文档了解更多详情。
