---
pageId: docs-skill-profile
kind: documentation
contentStatus: prototype
templateId: provisional-doc
title: Skill 与 Profile
description: 面向 Profile 定义 Agent 和引用行为 Skill 的 Constitution 对齐暂定文档。
---

# Skill 与 Profile

<PrototypeDocShell eyebrow="运行时 / 身份" summary="规范视觉关系：一个 YAML Profile 完全定义一个 Agent。" />

## Overview / 概述

一个 YAML Profile 完全定义一个 Agent。Profile 是 Agent 的完整声明式身份，不需要第二个配置对象来完成定义。

## Intended design / 预期设计

Profile 可以声明或引用 Skill。Skill 提供行为指令并作为 prompt context 加载；它不是可执行 Tool。

## Status placeholder / 状态占位

该关系反映 Constitution 的预期设计。具体 Schema 字段、加载行为、验证和生命周期仍需核验。

## Limitations placeholder / 限制占位

<LimitationsPlaceholder />

本页不提供示例 Profile，因为该 Feature 不发布未经核验的可执行配置。

## Related navigation / 相关导航

- [设计原则](/zh/docs/concepts/design-principles)
- [Tool 边界](/zh/docs/runtime/tool)
- [架构视觉模型](/zh/architecture)
