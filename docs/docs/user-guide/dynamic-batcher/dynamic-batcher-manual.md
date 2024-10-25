---
sidebar_position: 2
description: "随心所欲地控制动态合图的使用。"
---

# 手动管理合图

有时候你可能需要更细致地去控制哪些纹理加入动态图集，考虑到这一点，社区版在保留原来所有接口的基础上完全开放了动态图集相关的所有接口。

---
## 访问图集数组与已用空间集合

你可以通过

```js
cc.dynamicAtlasManager.atlases
```

和

```js
cc.dynamicAtlasManager.rects
```

分别访问到图集数组与所有图集的已用空间集合。

---
## 添加 SpriteFrame 到动态图集

```js
cc.dynamicAtlasManager.insertSpriteFrame(spriteFrame);
```

可以将 SpriteFrame 所使用的纹理添加到动态图集，这是引擎原有接口，但社区版对其做了一点修改，这个接口不再会检查纹理的 `packable` 属性，也就是变成了一个强制添加的接口。

这样设计的原因是你可以将所有纹理的 `packable` 都设为 `false`，或者直接将 `maxFrameSize` 设为 `0`，然后完全手动地进行动态合图。

---
## 从动态图集删除 SpriteFrame

```js
cc.dynamicAtlasManager.deleteSpriteFrame(spriteFrame);
```

可以使 SpriteFrame 取消使用动态图集纹理，这不一定会将 SpriteFrame 的纹理从动态图集删除，因为可能还会有其它 SpriteFrame 在使用，只有没有 SpriteFrame 在使用时才会删除纹理。

---
## 从动态图集删除 Texture

```js
cc.dynamicAtlasManager.deleteTexture(texture);
```

这个接口与 `deleteSpriteFrame` 相似，但是它会直接删除纹理，并且会使使用该纹理的 SpriteFrame 全部恢复。

---
## 更多接口

虽然还暴露了其它接口出来，但因为太过于底层所以不推荐使用，如果你想了解可以阅读原理文档。
