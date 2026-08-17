---
pageId: docs-skill-profile
kind: documentation
contentStatus: prototype
templateId: provisional-doc
title: Skill and Profile
description: Constitution-aligned provisional documentation for Profile-defined Agents and referenced behavioral Skills.
---

# Skill and Profile

<PrototypeDocShell eyebrow="RUNTIME / IDENTITY" summary="The canonical visual relationship: one YAML Profile completely defines an Agent." />

## Overview

One YAML Profile completely defines an Agent. The Profile is the complete declarative identity for the Agent and does not require a second configuration object to complete that definition.

## Intended design

The Profile may declare or reference a Skill. The Skill supplies behavioral instructions and is loaded as prompt context; it is not an executable Tool.

## Status placeholder

This relationship reflects the intended constitutional design. Specific schema fields, loading behavior, validation, and lifecycle remain to be verified.

## Limitations placeholder

<LimitationsPlaceholder />

No sample Profile is provided because this Feature does not publish unverified executable configuration.

## Related navigation

- [Design principles](/docs/concepts/design-principles)
- [Tool boundary](/docs/runtime/tool)
- [Architecture visual model](/architecture)
