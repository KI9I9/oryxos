<script setup lang="ts">
import { computed } from "vue";
import { useData, withBase } from "vitepress";

const { lang } = useData();
const isChinese = computed(() => lang.value.toLowerCase().startsWith("zh"));
</script>

<template>
  <section class="architecture-map" aria-labelledby="architecture-map-title">
    <div class="architecture-map__intro">
      <p class="architecture-map__eyebrow">SYSTEM MAP / DRAFT</p>
      <h2 id="architecture-map-title">
        {{ isChinese ? "把运行时看作一组清晰边界" : "Read the runtime as a set of explicit boundaries" }}
      </h2>
      <p>
        {{
          isChinese
            ? "该图用于评审信息结构，不代表所有模块已经实现或可用。"
            : "This map reviews information structure; it does not assert that every module is implemented or available."
        }}
      </p>
    </div>

    <figure class="architecture-map__figure">
      <img
        :src="withBase('/diagrams/system-architecture.svg')"
        :alt="isChinese ? 'OryxOS 单节点运行时视觉架构草图' : 'Visual draft of an OryxOS single-node runtime architecture'"
      />
      <figcaption>
        {{
          isChinese
            ? "Profile 驱动的 Agent 进入运行时内核，并与 Provider、Tool、Memory 及接口边界形成关系。"
            : "A Profile-defined Agent enters the runtime kernel and relates to provider, tool, memory, and interface boundaries."
        }}
      </figcaption>
    </figure>

    <div class="architecture-map__details">
      <article>
        <span>01 / IDENTITY</span>
        <h3>{{ isChinese ? "Profile 完全定义 Agent" : "Profile completely defines the Agent" }}</h3>
        <p>
          {{
            isChinese
              ? "Profile 可以声明或引用 Skill；Skill 提供行为指令，并作为 prompt context 加载。"
              : "The Profile may declare or reference a Skill that supplies behavioral instructions and is loaded as prompt context."
          }}
        </p>
      </article>
      <article>
        <span>02 / EXECUTION</span>
        <h3>{{ isChinese ? "内核承载执行边界" : "The kernel carries execution boundaries" }}</h3>
        <p>
          {{
            isChinese
              ? "视觉模型将推理循环、工具调用和状态访问分开表达，以便评审责任边界。"
              : "The visual model separates reasoning, tool invocation, and state access so responsibilities can be reviewed."
          }}
        </p>
      </article>
      <article>
        <span>03 / INTERFACES</span>
        <h3>{{ isChinese ? "接口是待核验的边缘" : "Interfaces are verification edges" }}</h3>
        <p>
          {{
            isChinese
              ? "CLI 与 REST 仅作为页面结构占位，不展示未核验的可执行命令或 endpoint。"
              : "CLI and REST appear only as page-form placeholders, without unverified runnable commands or endpoints."
          }}
        </p>
      </article>
    </div>
  </section>
</template>
