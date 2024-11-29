---
sidebar_position: 3
description: "在多线程中使用 XMLHttpRequest。"
---

# XMLHttpRequest

依次点击编辑器的菜单项 **项目 - 社区版设置**，然后勾选 **多线程驱动 XMLHttpRequest**，即可启用这一特性。

启用后，有关于 XMLHttpRequest 的操作将会在 Worker 线程中执行，完全释放对主线程的占用。

下面是在 Android 设备上，在开启前对游戏帧耗时的分析图：

![alt text](./assets/th-a.png)

下面是开启多线程支持后：

![alt text](./assets/th-b.png)

可以看到每次发起网络请求的耗时从 15.2ms 降低至 0.5ms。
