<script setup lang="ts">
import { computed } from "vue";
import { useData, withBase } from "vitepress";

import CapabilityLegend from "./CapabilityLegend.vue";

const { lang } = useData();
const isChinese = computed(() => lang.value.toLowerCase().startsWith("zh"));
const positioningSignals = computed(() =>
  isChinese.value
    ? ["Java 原生", "自托管", "单节点重点", "Pre-alpha", "开源"]
    : ["Java-native", "Self-hosted", "Single-node focus", "Pre-alpha", "Open source"]
);
</script>

<template>
  <main class="home-landing">
    <section class="home-hero" aria-labelledby="home-title">
      <div class="home-hero__content">
        <p class="home-hero__eyebrow">JAVA 21 / SELF-HOSTED / PRE-ALPHA</p>
        <h1 id="home-title">
          {{ isChinese ? "为需要清晰运行模型的 Agent" : "A runtime kernel for agents that need an" }}
          <span>{{ isChinese ? "构建运行时内核。" : "operating model." }}</span>
        </h1>
        <p class="home-hero__summary">
          {{
            isChinese
              ? "OryxOS 探索 Java 原生基础，用于在你控制的基础设施上定义、运行和观察 Agent。当前视觉雏形聚焦单节点系统形态。"
              : "OryxOS explores a Java-native foundation for defining, running, and observing agents on infrastructure you control. This visual prototype focuses on the single-node system shape."
          }}
        </p>
        <div class="home-hero__actions">
          <a class="button button--primary" :href="withBase(isChinese ? '/zh/architecture' : '/architecture')">
            {{ isChinese ? "查看系统形态" : "Inspect the system shape" }}
            <span aria-hidden="true">→</span>
          </a>
          <a class="button button--secondary" :href="withBase(isChinese ? '/zh/docs/' : '/docs/')">
            {{ isChinese ? "浏览文档" : "Explore documentation" }}
          </a>
        </div>
        <ul class="home-hero__signals" :aria-label="isChinese ? '雏形定位' : 'Prototype positioning'">
          <li v-for="signal in positioningSignals" :key="signal">{{ signal }}</li>
        </ul>
      </div>

      <div class="kernel-map" :aria-label="isChinese ? '运行时内核示意图' : 'Illustrative runtime kernel map'">
        <div class="kernel-map__header">
          <span>ORYX / NODE-00</span>
          <span>{{ isChinese ? "视觉模型" : "VISUAL MODEL" }}</span>
        </div>
        <div class="kernel-map__body">
          <div class="kernel-map__profile">
            <span>01</span>
            <strong>YAML Profile</strong>
            <small>{{ isChinese ? "完全定义一个 Agent" : "defines one Agent" }}</small>
          </div>
          <div class="kernel-map__line" aria-hidden="true"></div>
          <div class="kernel-map__core">
            <span>02</span>
            <strong>{{ isChinese ? "运行时内核" : "Runtime kernel" }}</strong>
            <small>{{ isChinese ? "协调预期执行循环" : "coordinates an intended loop" }}</small>
          </div>
          <div class="kernel-map__ports">
            <div><span>03A</span><strong>Tools</strong></div>
            <div><span>03B</span><strong>Memory</strong></div>
            <div><span>03C</span><strong>Provider</strong></div>
          </div>
        </div>
        <div class="kernel-map__footer">
          <span>{{ isChinese ? "静态雏形" : "STATIC PROTOTYPE" }}</span>
          <span>{{ isChinese ? "无运行时连接" : "NO RUNTIME CONNECTION" }}</span>
        </div>
      </div>
    </section>

    <section class="home-principle" aria-labelledby="agent-os-title">
      <div class="section-heading">
        <span class="section-heading__index">MODEL / 01</span>
        <div>
          <h2 id="agent-os-title">
            {{ isChinese ? "这是 Agent OS，而不是聊天机器人包装器。" : "An Agent OS, not a chatbot wrapper." }}
          </h2>
          <p>
            {{
              isChinese
                ? "设计视角是编排：明确身份、受限执行、可检查上下文，以及不会隐藏运行模型的可演进接口。"
                : "The design lens is orchestration: explicit identity, bounded execution, inspectable context, and interfaces that can evolve without hiding the operating model."
            }}
          </p>
        </div>
      </div>
      <div class="principle-grid">
        <article>
          <span>DEFINE</span>
          <h3>{{ isChinese ? "Profile 优先的身份" : "Profile-first identity" }}</h3>
          <p>
            {{
              isChinese
                ? "一个 YAML Profile 完全定义一个 Agent，并可引用提供行为指令的 Skill。"
                : "One YAML Profile completely defines an Agent and may reference a behavioral Skill."
            }}
          </p>
        </article>
        <article>
          <span>RUN</span>
          <h3>{{ isChinese ? "内核形态的执行" : "Kernel-shaped execution" }}</h3>
          <p>
            {{
              isChinese
                ? "页面形态将编排、Provider 访问、Tool 与外置状态分开表达。"
                : "The page form separates orchestration, provider access, tools, and externalized state."
            }}
          </p>
        </article>
        <article>
          <span>OBSERVE</span>
          <h3>{{ isChinese ? "先有证据，再作声明" : "Evidence before claims" }}</h3>
          <p>
            {{
              isChinese
                ? "未来公开能力声明必须与源码、测试和发布证据关联。"
                : "Future public capability statements must be tied to source, tests, and release evidence."
            }}
          </p>
        </article>
      </div>
    </section>

    <CapabilityLegend />

    <section class="home-direction" aria-labelledby="direction-title">
      <div>
        <p class="home-direction__eyebrow">
          {{ isChinese ? "长期方向 / 非当前声明" : "LONG-TERM DIRECTION / NOT A CURRENT CLAIM" }}
        </p>
        <h2 id="direction-title">
          {{ isChinese ? "从可靠节点走向 Agent 协作。" : "From a dependable node toward agent collaboration." }}
        </h2>
      </div>
      <p>
        {{
          isChinese
            ? "分布式 Agent 协作仍是长期方向。本雏形刻意从一个可检查运行时节点的视觉语言开始，并且不会给该方向分配能力状态徽章。"
            : "Distributed agent collaboration remains a long-term direction. This prototype deliberately starts with the visual language of one inspectable runtime node and does not assign that direction a capability-state badge."
        }}
      </p>
      <a :href="withBase(isChinese ? '/zh/roadmap' : '/roadmap')">
        {{ isChinese ? "查看暂定顺序" : "Review the draft sequence" }}
        <span aria-hidden="true">↗</span>
      </a>
    </section>
  </main>
</template>
