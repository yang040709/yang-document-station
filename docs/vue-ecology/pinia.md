---
title: Pinia笔记
description: Pinia 是 Vue 的专属状态管理库，它允许你跨组件或页面共享状态。
head:
  - - meta
    - name: keywords
      content: "Pinia, Vue, 状态管理, 组合式 API"

navbar: true
sidebar: true
aside: true
footer: true
lastUpdated: true # 最后更新时间

prev: false # 关闭上一页
next:
  text: "vue-router文档"
  link: "/vue-ecology/vue-router"
---

# Pinia 笔记

[Pinia | The intuitive store for Vue.js](https://pinia.vuejs.org/)

文档很重要，请重点看官方文档

## 1.什么是 Pinia?

Pinia 是 Vue 的专属状态管理库，它允许你跨组件或页面共享状态。如果你熟悉组合式 API 的话，你可能会认为可以通过一行简单的 export const state = reactive({}) 来共享一个全局状态。对于单页应用来说确实可以，但如果应用在服务器端渲染，这可能会使你的应用暴露出一些安全漏洞。 而如果使用 Pinia，即使在小型单页应用中，你也可以获得如下功能：

使用 pinia 会带来下面的优点：

测试工具集
插件：可通过插件扩展 Pinia 功能
为 JS 开发者提供适当的 TypeScript 支持以及自动补全功能。
支持服务端渲染
Devtools 支持
追踪 actions、mutations 的时间线
在组件中展示它们所用到的 Store
让调试更容易的 Time travel
热更新
不必重载页面即可修改 Store
开发时可保持当前的 State

## 2.组合式写法：

写法和我们在 setup 函数或组合式函数里面的写法一模一样：

```js
import { defineStore } from "pinia";
import { ref } from "vue";

export const useCountStore = defineStore("countStore", () => {
  const count = ref(0);
  const changeCount = (num) => {
    count.value += num;
  };
  const addCount = () => {
    count.value++;
  };
  const reduceCount = () => {
    count.value--;
  };

  const doubleCount = computed(() => count.value * 2);

  const reset2 = () => {
    console.log(this); //和组合式函数一样这里的this为未定义
  };

  return {
    count,
    changeCount,
    addCount,
    reduceCount,
    doubleCount,
    reset2,
  };
});
```

那么如何使用这个 store 呢？

```js
const countStore = useCountStore();
const { changeCount, reset2 } = countStore;
const { count } = storeToRefs(countStore);
```

注意 store 里面的函数不需要通过 storeToRefs 进行结果

注意：Setup store 也可以依赖于全局提供的属性，比如路由。任何应用层面提供的属性都可以在 store 中使用 inject() 访问，就像在组件中一样：

```js
import { inject } from "vue";
import { useRoute } from "vue-router";
import { defineStore } from "pinia";

export const useSearchFilters = defineStore("search-filters", () => {
  const route = useRoute();
  // 这里假定 `app.provide('appProvided', 'value')` 已经调用过
  const appProvided = inject("appProvided");

  // ...

  return {
    // ...
  };
});
```

## 3.选项式写法:

一些 API

- [mapStores](https://pinia.vuejs.org/zh/cookbook/options-api.html#giving-access-to-the-whole-store)
- [mapState](https://pinia.vuejs.org/zh/core-concepts/state.html#usage-with-the-options-api)
- [mapWritableState](https://pinia.vuejs.org/zh/core-concepts/state.html#modifiable-state)
- ⚠️ [mapGetters](https://pinia.vuejs.org/zh/core-concepts/getters.html#without-setup) (只是为了迁移方便，请用 `mapState()` 代替)
- [mapActions](https://pinia.vuejs.org/zh/core-concepts/actions.html#without-setup)

store 的定义

```js
import { defineStore } from "pinia";

export const useCountStore = defineStore("count", {
  state: () => {
    return {
      count: 0,
    };
  },
  actions: {
    changeCount(num) {
      this.count += num;
    },
    addCount() {
      this.count++;
    },
    reduceCount() {
      this.count--;
    },
  },
  getters: {
    doubleCount: (state) => state.count * 2,
  },
});
```

在组件中使用：

```vue
<template>
  <div class="container">
    <h2>Child</h2>
    <p>{{ threeCount }}</p>
    <div>
      <input type="text" v-model.number="num" />
    </div>
    <button @click="addCount()">+1</button>
    <button @click="reduceCount()">-1</button>
    <button @click="changeCount(num)">Change Count</button>
    <button @click="addTwo">+2</button>
    <button @click="reduceTwo">-2</button>
  </div>
</template>

<script>
import { mapStores, mapActions, mapState } from "pinia";
import { useCountStore } from "./stores/count";
import { mapWritableState } from "pinia";
// import { mapState } from "pinia";
// import { mapActions } from "pinia";
export default {
  name: "Child",
  data() {
    return {
      num: 19,
    };
  },
  methods: {
    ...mapActions(useCountStore, ["addCount", "reduceCount", "changeCount"]),
    addTwo() {
      this.canWriteCount += 2;
    },
    reduceTwo() {
      this.countStore.$patch((state) => {
        // console.log(state);
        state.count = state.count - 2;
      });
    },
  },
  computed: {
    ...mapStores(useCountStore),
    ...mapState(useCountStore, ["count", "doubleCount"]),
    ...mapState(useCountStore, {
      threeCount: (state) => state.count * 3,
    }),
    ...mapWritableState(useCountStore, {
      canWriteCount: "count",
    }),
  },
  mounted() {
    console.log(this);
  },
};
</script>

<style lang="css" scoped></style>
```
