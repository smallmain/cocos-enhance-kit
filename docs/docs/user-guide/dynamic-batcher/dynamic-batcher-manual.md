---
sidebar_position: 2
---

# 手动管理合图

我们在保留原来所有接口的基础上重构了动态合图，除了通过 `maxFrameSize` `insertSpriteFrame` 等原有的接口来手动管理合图之外，还新增了以下方法：

## 控制图集

### 添加 SpriteFrame

你可以通过该接口添加 SpriteFrame 的 Texture 到图集中，内部也是使用该接口。

```
cc.dynamicAtlasManager.insertSpriteFrame(spriteFrame);
```

### 删除 SpriteFrame

`cc.dynamicAtlasManager.deleteSpriteFrame(spriteFrame)`

### 删除 Texture

`cc.dynamicAtlasManager.deleteTexture(texture)`
