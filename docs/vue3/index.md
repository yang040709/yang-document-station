# 1.基础

## 1.两个 vue 版本的区别

当根组件没有设置 template 选项时，Vue 将自动使用容器的 innerHTML 作为模板。

一个版本的 vue 是包含模板编译器的，另一个版本就没有。

在使用构建工具进行编程的过程中构建工具会帮你处理模板，在运行的过程中不需要模板编译器。

下面是在 html 直接写 vue 代码，需要使用带有模板编译器版本的 vue

根组件的模板通常是组件本身的一部分，但也可以直接通过在挂载容器内编写模板来单独提供：

```
<div id="app">
  <button @click="count++">{{ count }}</button>
</div>

js
import { createApp } from 'vue'

const app = createApp({
  data() {
    return {
      count: 0
    }
  }
})

app.mount('#app')
```

当以无构建步骤方式使用 Vue 时，组件模板要么是写在页面的 HTML 中，要么是内联的 JavaScript 字符串。在这些场景中，为了执行动态模板编译，Vue 需要将模板编译器运行在浏览器中。相对的，如果我们使用了构建步骤，由于提前编译了模板，那么就无须再在浏览器中运行了。为了减小打包出的客户端代码体积，Vue 提供了[多种格式的“构建文件”](https://unpkg.com/browse/vue@3/dist/)以适配不同场景下的优化需求。

- 前缀为 `vue.runtime.*` 的文件是**只包含运行时的版本**：不包含编译器，当使用这个版本时，所有的模板都必须由构建步骤预先编译。
- 名称中不包含 `.runtime` 的文件则是**完全版**：即包含了编译器，并支持在浏览器中直接编译模板。然而，体积也会因此增长大约 14kb。

默认的工具链中都会使用仅含运行时的版本，因为所有单文件组件中的模板都已经被预编译了。如果因为某些原因，在有构建步骤时，你仍需要浏览器内的模板编译，你可以更改构建工具配置，将 `vue` 改为相应的版本 `vue/dist/vue.esm-bundler.js`。

如果你需要一种更轻量级，不依赖构建步骤的替代方案，也可以看看 [petite-vue](https://github.com/vuejs/petite-vue)。

## 2.vue 的全局错误捕获

Vue 3 的 `app.config.errorHandler` 🛡️ 是项目中**非常重要且常用**的全局错误处理机制。它主要用于捕获和处理 Vue 应用内**未捕获的运行时错误**，是提升应用健壮性和用户体验的关键一环。

下面是一个表格，汇总了 `app.config.errorHandler` 在项目不同阶段的核心用途：

| 阶段         | 主要目标       | 核心应用                                                     |
| :----------- | :------------- | :----------------------------------------------------------- |
| **开发阶段** | **调试与定位** | 在控制台输出详细错误信息，帮助快速定位和修复问题。           |
| **生产阶段** | **监控与体验** | 捕获错误并上报至监控平台，同时为用户展示友好提示，避免白屏。 |

`errorHandler` 函数接收三个参数 ：

1.  `err`：捕获到的错误对象，包含错误的详细信息（如错误消息、堆栈跟踪）。
2.  `vm`：触发该错误的 Vue 组件实例。通过这个实例，你可以访问组件的状态、数据和方法，有助于更精确地定位问题。
3.  `info`：一个字符串，提供了关于错误发生位置或上下文的 Vue 特定信息。常见的值包括：
    - `'render function'`：组件渲染函数中的错误。
    - `'event handler'`：事件处理函数中的错误。
    - `'mounted hook'`：`mounted` 生命周期钩子中的错误。
    - `'setup function'`：`setup` 函数中的错误。
    - `'watcher callback'`：侦听器回调中的错误。
    - `'directive hook'`：自定义指令钩子中的错误。
    - `'transition hook'`：过渡钩子中的错误。

### 项目中如何使用

#### 1. 基本配置（在 `main.js` 或 `main.ts` 中）

通常在创建 Vue 应用实例后立即配置。

```
import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)

// 配置全局错误处理器
app.config.errorHandler = (err, vm, info) => {
  // err: 捕获到的错误对象
  // vm: 发生错误的组件实例（在 Vue 3.3+ 中可能为 null）
  // info: Vue 特定的错误信息字符串（如 'render function', 'onCreated hook'）

  // 这里编写你的错误处理逻辑
  console.error('Global error caught:', err)
  console.log('Error in component:', vm)
  console.log('Error origin:', info)
}

app.mount('#app')
```

#### 2. 开发阶段（Development）

在开发模式下，`errorHandler` 的核心作用是**辅助调试**。

- **详细输出**：在控制台打印完整的错误信息、组件实例和错误来源（`info`），帮助开发者快速定位问题所在的生命周期钩子、渲染函数或计算属性等。
- **与 DevTools 协同**：结合 Vue DevTools 进行深度调试。`errorHandler` 提供了错误发生的上下文，而 DevTools 可以帮助你检查组件树、状态和事件。

#### 3. 生产阶段（Production）

构建上线后，`errorHandler` 的角色转变为**应用监控和用户体验守护者**。

- **错误上报 (Crucial)**：这是生产环境最重要的功能。将捕获的错误信息（如 `err.message`, `err.stack`, `info`）发送到你的监控平台（如 **Sentry**, **Fundebug**, 或自建服务）。这能让你及时发现并修复线上问题。

  ```
  app.config.errorHandler = (err, vm, info) => {
    // 示例：上报错误到 Sentry（需先集成 Sentry SDK）
    if (window.$sentry) {
      window.$sentry.captureException(err, {
        tags: { component: vm?.$options.name, error_info: info }
      })
    }

    // 或者上报到你自己的日志服务
    myErrorReportingService.log(err, vm, info)
  }
  ```

- **友好的用户反馈**：避免让用户看到崩溃的白屏或控制台错误。可以展示一个友好的错误提示组件或消息。

  ```
  import { showGlobalErrorToast } from './utils/feedback'

  app.config.errorHandler = (err, vm, info) => {
    // ... 错误上报逻辑 ...

    // 提示用户
    showGlobalErrorToast('抱歉，应用出了点小问题。请稍后重试或联系支持。')
  }
  ```

#### 4. 区分环境配置

在实际项目中，我们通常会根据环境变量来调整 `errorHandler` 的行为。

```
app.config.errorHandler = (err, vm, info) => {
  // 1. 错误上报：生产和开发环境都可能需要，但上报的详细程度或目标可能不同
  if (import.meta.env.PROD) {
    // 生产环境：上报到正式的监控平台
    myProductionErrorService.report(err, vm, info)
  } else {
    // 开发环境：可能只记录到控制台，或上报到测试环境
    console.error('Dev Error:', err, info)
    myDevErrorService.log(err) // 可选
  }

  // 2. 用户界面反馈：通常只在生产环境展示友好提示，避免干扰开发调试
  if (import.meta.env.PROD) {
    showUserFriendlyErrorMessage()
  }
}
```

### ⚠️ 注意事项与局限性

1. **并非“万能”**：`app.config.errorHandler` 主要捕获的是： Vue 组件渲染函数中的错误 观察者（Watcher）回调函数中的错误 生命周期钩子中的错误 自定义指令钩子中的错误 `setup()` 函数中的错误

2. **无法捕获以下错误**：

   - **事件处理函数内部的异步错误**（如 `setTimeout`, `Promise` 内的错误）。
   - **全局事件监听器**（如通过 `window.addEventListener` 添加的）中的错误。
   - **异步回调**（如 `setTimeout`、`setInterval`、`Promise` 的 `then`/catch 链中未被处理的错误）通常需要 `window.onunhandledrejection` 来捕获。

   ```
   // 需要单独处理异步错误
   window.addEventListener('unhandledrejection', (event) => {
     console.error('Unhandled Promise rejection:', event.reason)
     // 同样可以在这里上报错误
   })
   ```

3. **与 `errorCaptured` 的关系**：组件生命周期钩子 `errorCaptured` 可以捕获其子孙组件中发生的错误。它可以决定是否阻止错误继续向上冒泡到全局的 `errorHandler`（通过返回 `false`）。

4. **避免在 `errorHandler` 中抛出错误**：确保你的错误处理器本身非常健壮，否则可能导致无限循环。

### 💡 进阶用法：结合错误边界 (Error Boundary)

在大型项目中，你可以考虑实现类似 React 的“错误边界”概念。即创建一个专用组件，利用 `errorCaptured` 钩子捕获其整个子树内的错误，并在组件内部优雅地降级显示，而不是让整个应用崩溃或每次都触发全局处理。

```
<!-- ErrorBoundary.vue -->
<template>
  <div v-if="hasError">
    <h2>Something went wrong in this section.</h2>
    <button @click="tryToRecover">Try Again</button>
    <!-- 可展示详细的友好错误信息 -->
  </div>
  <slot v-else></slot>
</template>

<script setup>
import { ref, onErrorCaptured } from 'vue'

const hasError = ref(false)
const error = ref(null)

onErrorCaptured((err, instance, info) => {
  error.value = err
  hasError.value = true
  // 可以在这里上报该边界内的错误
  myErrorReportingService.log(err, instance, info)
  // 阻止错误继续冒泡到全局 handler，实现局部降级
  return false
})

function tryToRecover() {
  hasError.value = false
  error.value = null
}
</script>
```

然后在可能出错的组件外围使用它：

```
<ErrorBoundary>
  <UnstableComponent />
</ErrorBoundary>
```

### 💎 总结

`app.config.errorHandler` 在正常项目中**肯定会使用**，它是 Vue 应用错误处理体系的基石。

- **开发时**：它是你**调试的得力助手**，通过控制台输出精准定位问题。
- **构建后**：它是应用的**安全网和哨兵**，负责捕获未预料错误、上报日志、并优雅地通知用户。

最佳实践是：**将其与 `window.onunhandledrejection`、组件级的 `errorCaptured` 或“错误边界”、以及异步操作中的 `try/catch` 结合起来**，构建一个多层次、全方位的错误处理防御系统，从而极大提升应用的健壮性和用户体验。

## 3.props 技巧

1.同名简写
仅支持 3.4 版本及以上
如果 attribute 的名称与绑定的 JavaScript 变量的名称相同，那么可以进一步简化语法，省略 attribute 值：

```
<!-- 与 :id="id" 相同 -->
<div :id></div>
<!-- 这也同样有效 -->

<div v-bind:id></div>
```

这与在 JavaScript 中声明对象时使用的属性简写语法类似。请注意，这是一个只在 Vue 3.4 及以上版本中可用的特性。

2.动态绑定多个值
如果你有像这样的一个包含多个 attribute 的 JavaScript 对象：

```
const objectOfAttrs = {
  id: 'container',
  class: 'wrapper',
  style: 'background-color:green'
}
```

通过不带参数的 v-bind，你可以将它们绑定到单个元素上：

```
<div v-bind="objectOfAttrs"></div>
```

但是这样使用其实有一些坑

1.ref 无法自动解构，如果你传进去的时候是对象

如果你使用

```vue
<script setup>
import Child from "./child.vue";
const var1 = ref(1);
const var2 = ref("hello");
const childProps = {
  prop1: var1,
  prop2: var2,
};
</script>

<template>
  <h1>You did it!</h1>
  <!-- <child :prop1="var1" :prop2="var2" /> -->
  <child v-bind="childProps" />
  <button @click="var1++">Click me</button>
  <input v-model="var2" />
</template>

<style scoped></style>
```

那么结果是：

并没有帮你自动解构你传进去的 ref

你可以通过

```
const childProps = reactive({
  prop1: var1,
  prop2: var2,
});
```

来顺利解决

2.dom 属性会被自动绑定

**DOM 属性 vs HTML 属性**
对象里如果出现 `value: 123`、`checked: true`、`indeterminate: true` 这类**只有 DOM 属性才认**的字段，会被 Vue 当成 **HTML attribute** 写进去，结果字符串化后失灵。
解决：在对象里用 `valueProp`、`checkedProp` 等名字，再单独 `:value.prop="obj.valueProp"`；或把对象拆成 `domProps` / `attr` 两个对象。

```vue
<script setup>
import Child from "./child.vue";
const var1 = ref(1);
const var2 = ref("hello");
// const childProps = reactive({
//   prop1: var1,
//   prop2: var2,
// });
const childProps = {
  prop1: var1,
  prop2: var2,
  name: "name",
};
</script>

<template>
  <h1>You did it!</h1>
  <!-- <child :prop1="var1" :prop2="var2" /> -->
  <child v-bind="childProps" />
  <button @click="var1++">Click me</button>
  <input v-model="var2" />
</template>

<style scoped></style>
```
