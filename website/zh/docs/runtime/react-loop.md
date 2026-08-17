---
pageId: docs-react-loop
kind: documentation
contentStatus: prototype
templateId: provisional-doc
title: ReAct 循环
description: 面向 OryxOS 预期推理与动作编排边界的暂定页面形态。
---

# ReAct 循环

<PrototypeDocShell eyebrow="运行时 / 编排" summary="用于讨论推理与受限动作、但不发布可执行行为的视觉顺序。" />

## Overview / 概述

ReAct 主题描述一种预期编排循环：观察上下文、推理下一步、选择可能的受限动作，并把结果作为下一次观察。

## Intended design / 预期设计

页面形态把运行时控制与 Provider 协议转换、Tool 执行、Memory 访问和外部接口分开表达。

## Status placeholder / 状态占位

该顺序仅供说明，不表示每个转换、停止条件或失败路径已经实现。

## Limitations placeholder / 限制占位

<LimitationsPlaceholder />

循环语义、预算、重试、取消、审计和错误恢复需要源码支持的文档。

## Related navigation / 相关导航

- [Provider 边界](/zh/docs/runtime/provider)
- [Tool 边界](/zh/docs/runtime/tool)
- [Memory 边界](/zh/docs/runtime/memory)
