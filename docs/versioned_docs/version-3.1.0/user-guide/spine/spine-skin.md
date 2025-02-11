---
sidebar_position: 2
description: "随心所欲地更换 Spine 动画的部份纹理。"
---

# SpriteFrame 换装

引擎提供了一个替换插槽的 attachment 对象进行换装的方法，可以在 [Spine 组件参考](https://docs.cocos.com/creator/2.4/manual/zh/components/spine.html) 官方文档进行了解。

但是使用替换插槽的 attachment 对象这种方法比较绕，并且 Spine 动画中有切换 attachment 的关键帧时这种方法就没用了。

而 attachment 对象持有一个 region 对象，这个对象类似引擎的 SpriteFrame，所以我们可以通过修改 region 对象的数据来进行换装。

---
## 认识 RegionData

请勿混淆 RegionData 与 region，RegionData 主要作为 SpriteFrame 和 region 对象之间的桥梁，实现两者的相互转换。

将 SpriteFrame 转换为 RegionData：

```js
const regionData = new sp.RegionData(spriteFrame);
```

将 RegionData 转换为 SpriteFrame：

```js
const spriteFrame = regionData.toSpriteFrame();
```

将 attachment 对象的 region 数据转换为 RegionData ：

```js
const regionData = new sp.RegionData(attachment);
```

将 RegionData 数据更新到 attachment 对象上：

```js
regionData.assignToAttachment(attachment);
```

:::caution 注意

Spine 的 Region 支持 `0`、`90`、`180`、`270` 四种旋转角度，而 Cocos Creator 的 SpriteFrame 只支持 `0` 与 `270` 两种旋转角度，所以如果是 RegionData 转为 SpriteFrame 则可能导致方向不同的问题。

**要进行换装的话使用的是 SpriteFrame 转为 RegionData，所以不用担心这个问题。**

:::

---
## 使用 SpriteFrame 修改 Region 数据

虽然使用上面的 RegionData 即可实现使用 SpriteFrame 换装的需求，但我们还在 Spine 组件上提供了两个更方便的接口：

只使用 `regionData.assignToAttachment(attachment)` 只会修改 SkeletonData 的数据，但不会触发 Spine 组件的渲染更新。

推荐直接使用：

```js
skeletonComponent.setRegionData('Head', 'Head', new sp.RegionData(spriteFrame));
```

在修改的同时刷新组件的渲染实现换装，并且不会打断当前正在播放的动画。

还提供了一个通过 attachment 名称获取 RegionData 的接口：

```js
a.getRegion(slotName, attachmentName);
```

---
## 注意事项


### 多实例问题

由于是直接修改 Spine 组件所使用 SkeletonData 的 attachment 数据，所以所有 Spine 组件都会受到影响。

如果你只想替换其中一个组件，那么就可以克隆这个 SkeletonData 让每个组件都使用不同的 SkeletonData 实例进行渲染。

社区版提供了一个克隆数据的接口来实现这个需求：

```js
const clonedSkeletonData = skeletonData.clone();
```

使用以上代码克隆 SkeletonData 后再进行换装，赋值给 Spine 组件，那么替换操作就只会对这个 Spine 组件生效。

---
以上所有用法你可以在演示项目中找到示范代码。
