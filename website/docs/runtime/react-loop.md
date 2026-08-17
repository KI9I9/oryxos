---
pageId: docs-react-loop
kind: documentation
contentStatus: prototype
templateId: provisional-doc
title: ReAct loop
description: A provisional page form for the intended OryxOS reasoning-and-action orchestration boundary.
---

# ReAct loop

<PrototypeDocShell eyebrow="RUNTIME / ORCHESTRATION" summary="A visual sequence for discussing reasoning and bounded action without publishing executable behavior." />

## Overview

The ReAct topic describes an intended orchestration cycle in which context is observed, a next step is reasoned about, a bounded action may be selected, and the resulting observation returns to the loop.

## Intended design

The page form separates runtime-owned loop control from provider protocol conversion, Tool execution, Memory access, and externally visible interfaces.

## Status placeholder

The sequence is illustrative. It is not an assertion that every transition, stop condition, or failure path is implemented.

## Limitations placeholder

<LimitationsPlaceholder />

Loop semantics, budgets, retries, cancellation, audit behavior, and error recovery require source-backed documentation.

## Related navigation

- [Provider boundary](/docs/runtime/provider)
- [Tool boundary](/docs/runtime/tool)
- [Memory boundary](/docs/runtime/memory)
