---
pageId: docs-design-principles
kind: documentation
contentStatus: prototype
templateId: provisional-doc
title: 设计原则
description: 面向 OryxOS 运行时边界、证据和自托管运行的暂定信息架构。
---

# 设计原则

<PrototypeDocShell eyebrow="概念 / 原则" summary="用于表达 OryxOS 约束条件的紧凑视觉系统。" />

## Overview / 概述

本雏形围绕明确身份、可理解执行、受限集成、外置状态、自托管运行和证据支持的公开声明组织页面。

## Intended design / 预期设计

一个 YAML Profile 完全定义一个 Agent。Profile 可以声明或引用 Skill；Skill 提供行为指令并作为 prompt context 加载。Skill 不作为可执行 Tool 呈现。

## Status placeholder / 状态占位

这些内容表达预期设计与 Constitution 对齐关系，不是能力清单。

## Limitations placeholder / 限制占位

<LimitationsPlaceholder />

详细保证、威胁模型和运行限制不属于本视觉雏形 Feature。

## Related navigation / 相关导航

- [什么是 OryxOS](/zh/docs/concepts/what-is-oryxos)
- [Skill 与 Profile](/zh/docs/runtime/skill-profile)
- [Tool 边界](/zh/docs/runtime/tool)
