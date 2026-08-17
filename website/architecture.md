---
pageId: architecture
kind: core
contentStatus: prototype
title: Architecture visual model
description: A provisional system map for OryxOS Profile-defined agents and single-node runtime boundaries.
aside: false
outline: deep
---

# Architecture as explicit boundaries

This page evaluates how the OryxOS system shape can be explained without turning a visual model into an implementation claim.

<ArchitectureMap />

## Agent definition

One YAML Profile completely defines an Agent. The Profile may declare or reference a Skill that supplies behavioral instructions and is loaded as prompt context.

![Profile-defined Agent and referenced Skill relationship](/diagrams/agent-skill-profile.svg)

## Intended execution model

The ReAct diagram is an explanatory target form. It separates observation, reasoning, intended action, bounded tool access, and the next observation without presenting a runnable interface.

![Provisional ReAct loop visual model](/diagrams/react-loop.svg)

<CapabilityLegend />

## Prototype limitations

<LimitationsPlaceholder />

Module boundaries, interface behavior, and capability maturity still require source-level and release-level verification before public documentation.

## Related navigation

- [Review the provisional roadmap](/roadmap)
- [Explore runtime topic forms](/docs/runtime/provider)
- [Read the project-status placeholder](/docs/project/project-status)
