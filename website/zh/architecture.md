---
pageId: architecture
kind: core
contentStatus: prototype
title: 架构视觉模型
description: 面向 OryxOS Profile 定义 Agent 与单节点运行时边界的暂定系统图。
aside: false
outline: deep
---

# 用清晰边界表达架构

本页用于评审 OryxOS 系统形态的展示方式，不会把视觉模型写成实现完成声明。

<ArchitectureMap />

## Agent 定义

一个 YAML Profile 完全定义一个 Agent。Profile 可以声明或引用 Skill；Skill 提供行为指令，并作为 prompt context 加载。

![Profile 定义 Agent 并引用 Skill 的关系](/diagrams/agent-skill-profile.svg)

## 预期执行模型

ReAct 图仅用于说明目标页面形态。它区分观察、推理、预期动作、受限 Tool 访问与下一次观察，不提供可执行接口。

![ReAct 循环暂定视觉模型](/diagrams/react-loop.svg)

<CapabilityLegend />

## 雏形限制

<LimitationsPlaceholder />

模块边界、接口行为和能力成熟度在成为公开文档前仍需源码与发布证据核验。

## 相关导航

- [查看暂定路线图](/zh/roadmap)
- [浏览运行时主题形态](/zh/docs/runtime/provider)
- [阅读项目状态占位页](/zh/docs/project/project-status)
