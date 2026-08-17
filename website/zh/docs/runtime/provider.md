---
pageId: docs-provider
kind: documentation
contentStatus: prototype
templateId: provisional-doc
title: Provider 边界
description: 面向 OryxOS 运行时模型中 Provider 协议边界的暂定视觉说明。
---

# Provider 边界

<PrototypeDocShell eyebrow="运行时 / PROVIDER" summary="将模型 Provider 协议与运行时编排分开表达的视觉形态。" />

## Overview / 概述

Provider 主题表示运行时与模型服务通信的边界，同时保持编排责任清晰可见。

## Intended design / 预期设计

正式说明应把协议转换、Provider 选择、请求上下文、响应处理和失败边界与 Agent 运行模型区分开。

## Status placeholder / 状态占位

本雏形不会给任何 Provider 集成分配真实能力状态。

## Limitations placeholder / 限制占位

<LimitationsPlaceholder />

支持范围、配置键、凭据、限制和错误行为在发布前需要逐项核验。

## Related navigation / 相关导航

- [ReAct 循环](/zh/docs/runtime/react-loop)
- [Tool 边界](/zh/docs/runtime/tool)
- [架构视觉模型](/zh/architecture)
