---
sidebar_position: 2
description: "随心所欲地控制动态合图的使用。"
---

# SpriteFrame 换装

引擎提供了一个替换插槽的 attachment 对象进行换装的方法，可以在 [Spine 组件参考](https://docs.cocos.com/creator/2.4/manual/zh/components/spine.html) 官方文档进行了解。

但是这种方法比较绕，并且 Spine 动画中有切换 attachment 的关键帧时会导致失效。

而 attachment 对象都持有着一个 region 对象，region 对象有点类似引擎的 SpriteFrame，所以我们可以通过更换 region 对象来进行换装。

---
## Region 与 SpriteFrame 互转

首先服务包提供了 Region 与 SpriteFrame 对象相互转换的接口。

SpriteFrame 转为 Region：

```js
const region = sp.SkeletonData.createRegion(spriteFrame);
```

Region 转为 SpriteFrame：

```js
const spriteFrame = sp.SkeletonData.createSpriteFrame(region);
```

:::caution 注意

Spine 的 Region 支持 `0`、`90`、`180`、`270` 四种旋转角度，而 Cocos Creator 的 SpriteFrame 只支持 `0` 与 `270` 两种旋转角度，所以如果是 Region 转为 SpriteFrame 则可能导致方向不同的问题，**要进行换装的话使用的是 SpriteFrame 转为 Region，所以不用担心这个问题。**

:::

---
## 替换 Region 对象

使用上面的接口将 SpriteFrame 转为 Region 后，就可以调用服务包提供的设置 Region 接口来进行换装了。

这个接口在 Spine 组件上：

```js
spine.setRegion(slotName, attachmentName, region);
```

还有一个获取 Region 对象的接口：

```js
a.getRegion(slotName, attachmentName);
```

将转换与设置的代码结合，你就可以使用一行代码进行换装了。

```
spine.setRegion('head', 'head', sp.SkeletonData.createRegion(spriteFrame));
```

效果就像这样：



---
## 注意事项


### 多实例问题

替换 Region 对象实际上是在 Spine 组件所使用的 SkeletonData 上进行替换的，所以所有使用这个 SkeletonData 进行渲染的组件都会被替换。

如果你只想替换其中一个组件的显示，那么就可以让所有组件都使用不同的 SkeletonData 进行渲染。

服务包提供了一个克隆接口来实现这个需求，你可以使用：

```js
const clonedSkeletonData = skeletonData.clone();
```

克隆 SkeletonData，然后再进行换装，赋值给 Spine 组件。

---
以上所有用法你可以在 [演示项目](TODO) 中找到示范代码。
