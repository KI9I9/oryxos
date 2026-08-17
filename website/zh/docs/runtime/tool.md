---
pageId: docs-tool
kind: documentation
contentStatus: prototype
templateId: provisional-doc
title: Tool 边界
description: 面向 OryxOS 运行时模型中受限 Tool 调用的暂定视觉说明。
---

# Tool 边界

<PrototypeDocShell eyebrow="运行时 / TOOL" summary="让动作边界与策略检查可见的页面形态。" />

## Overview / 概述

Tool 表示明确动作边界。视觉模型将 Tool 调用与 Skill 指令、Provider 通信和 Memory 访问分开。

## Intended design / 预期设计

未来文档应分别解释注册、Schema、白名单策略、输入验证、执行隔离、结果处理和审计记录。

## Status placeholder / 状态占位

本页不会给 Tool 实现、沙箱强度或集成目录分配真实能力状态。

## Limitations placeholder / 限制占位

<LimitationsPlaceholder />

安全保证和支持的 Tool 行为需要威胁分析与实现证据。

## Related navigation / 相关导航

- [设计原则](/zh/docs/concepts/design-principles)
- [ReAct 循环](/zh/docs/runtime/react-loop)
- [Skill 与 Profile](/zh/docs/runtime/skill-profile)
