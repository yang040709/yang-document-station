# VitePress

VitePress 是一个基于 vue 和 vite 的 SSG，能够帮助你快速搭建一个好看的文档类型的网站。

## 1.什么是 vitePress

VitePress 是一个[静态站点生成器](https://en.wikipedia.org/wiki/Static_site_generator) (SSG)，专为构建快速、以内容为中心的站点而设计。简而言之，VitePress 获取用 Markdown 编写的内容，对其应用主题，并生成可以轻松部署到任何地方的静态 HTML 页面。

使用场景：

**文档**

VitePress 附带一个专为技术文档设计的默认主题。你现在正在阅读的这个页面以及 [Vite](https://vitejs.dev/)、[Rollup](https://rollupjs.org/)、[Pinia](https://pinia.vuejs.org/)、[VueUse](https://vueuse.org/)、[Vitest](https://vitest.dev/)、[D3](https://d3js.org/)、[UnoCSS](https://unocss.dev/)、[Iconify](https://iconify.design/) [等](https://github.com/search?q=/"vitepress":+/+language:json&type=code)文档都是基于这个主题的。

[Vue.js 官方文档](https://cn.vuejs.org/)也是基于 VitePress 的。但是为了可以在不同的翻译文档之间切换，它自定义了自己的主题。

**博客、档案和营销网站**

VitePress 支持[完全的自定义主题](https://vitepress.dev/zh/guide/custom-theme)，具有标准 Vite + Vue 应用程序的开发体验。基于 Vite 构建还意味着可以直接利用其生态系统中丰富的 Vite 插件。此外，VitePress 提供了灵活的 API 来[加载数据](https://vitepress.dev/zh/guide/data-loading) (本地或远程)，也可以[动态生成路由](https://vitepress.dev/zh/guide/routing#dynamic-routes)。只要可以在构建时确定数据，就可以使用它来构建几乎任何东西。

[Vue.js 官方博客](https://blog.vuejs.org/)是一个简单的博客页面，它根据本地内容生成其索引页面

VitePress 旨在使用 Markdown 生成内容时提供出色的开发体验。

- **[Vite 驱动](https://cn.vitejs.dev/)**：即时服务器启动，始终立即反映 (<100ms) 编辑变化，无需重新加载页面。
- **[内置 Markdown 扩展](https://vitepress.dev/zh/guide/markdown)**：frontmatter、表格、语法高亮……应有尽有。具体来说，VitePress 提供了许多用于处理代码块的高级功能，使其真正成为技术文档的理想选择。
- **[Vue 增强的 Markdown](https://vitepress.dev/zh/guide/using-vue)**：每个 Markdown 页面都是 Vue [单文件组件](https://cn.vuejs.org/guide/scaling-up/sfc.html)，这要归功于 Vue 模板与 HTML 的 100% 语法兼容性。可以使用 Vue 模板语法或导入的 Vue 组件在静态内容中嵌入交互性。

与许多传统的 SSG 不同，每次导航都会导致页面完全重新加载，VitePress 生成的网站在初次访问时提供静态 HTML，但它变成了[单页应用程序](https://en.wikipedia.org/wiki/Single-page_application)（SPA）进行站点内的后续导航。我们认为，这种模式为性能提供了最佳平衡：

- **快速的初始加载**

  对任何页面的初次访问都将会是静态的、预呈现的 HTML，以实现极快的加载速度和最佳的 SEO。然后页面加载一个 JavaScript bundle，将页面变成 Vue SPA (这被称为“激活”)。与 SPA 激活缓慢的常见假设不同，由于 Vue 3 良好的原始性能和编译优化，这个过程实际上非常快。在 [PageSpeed Insights](https://pagespeed.web.dev/report?url=https%3A%2F%2Fvitepress.dev%2F) 上，典型的 VitePress 站点即使在网络速度较慢的低端移动设备上也能获得近乎完美的性能分数。

- **加载完成后可以快速切换**

  更重要的是，SPA 模型在首次加载后能够提升用户体验。用户在站点内导航时，不会再触发整个页面的刷新。而是通过获取并动态更新页面的内容来实现切换。VitePress 还会自动预加载视口范围内链接对应的页面片段。这样一来，大部分情况下，用户在加载完成后就能立即浏览新页面。

- **高效的交互**

  为了能够嵌入静态 Markdown 中的动态 Vue 部分，每个 Markdown 页面都被处理为 Vue 组件并编译成 JavaScript。这听起来可能效率低下，但 Vue 编译器足够聪明，可以将静态和动态部分分开，从而最大限度地减少激活成本和有效负载大小。对于初始的页面加载，静态部分会自动从 JavaScript 有效负载中删除，并在激活期间跳过。

## 2.快速开始

安装 vite 工程

```
pnpm add -D vitepress@next
```

搭建文档的结构

```
pnpm vitepress init
```

```hash
┌  Welcome to VitePress!
│
◇  Where should VitePress initialize the config?
│  ./docs
│
◇  Where should VitePress look for your markdown files?
│  ./docs
│
◇  Site title:
│  My Awesome Project
│
◇  Site description:
│  A VitePress Site
│
◇  Theme:
│  Default Theme
│
◇  Use TypeScript for config and theme files?
│  Yes
│
◇  Add VitePress npm scripts to package.json?
│  Yes
│
◇  Add a prefix for VitePress npm scripts?
│  Yes
│
◇  Prefix for VitePress npm scripts:
│  docs
│
└  Done! Now run pnpm run docs:dev and start writing.
```

系统自动生成的文件夹

```
.
|-- docs
│  ├─ .vitepress
│  │  └─ config.js
│  ├─ api-examples.md
│  ├─ markdown-examples.md
│  └─ index.md
└─ package.json
```

## 3.路由

基于文件的路由

VitePress 使用基于文件的路由，这意味着生成的 HTML 页面是从源 Markdown 文件的目录结构映射而来的。例如，给定以下目录结构：

```
.
├─ guide
│  ├─ getting-started.md
│  └─ index.md
├─ index.md
└─ prologue.md
```

生成的 HTML 页面会是这样：

```
index.md                  -->  /index.html (可以通过 / 访问)
prologue.md               -->  /prologue.html
guide/index.md            -->  /guide/index.html (可以通过 /guide/ 访问)
guide/getting-started.md  -->  /guide/getting-started.html
```

链接页面

```
[Getting Started](./getting-started)
```

可重写路径

```
export default {
  rewrites: {
    'packages/:pkg/src/(.*)': ':pkg/index.md'
  }
}
```

可以使用动态路由

详细见[路由 | VitePress](https://vitepress.dev/zh/guide/routing#dynamic-routes)

## 4.部署

之后补充

## 5.markdown 扩展语法

VitePress 在标准 Markdown 语法的基础上，提供了丰富的扩展功能，以增强文档的表达能力和交互性。以下是 VitePress 特有的主要 Markdown 扩展语法总结：

### 1. 前言（Frontmatter）

使用 YAML 格式的前言来配置页面元数据。

```yaml
---
title: 页面标题
description: 页面描述
sidebar: false
editLink: false
lastUpdated: true
---
```

### 2. 自定义容器（Custom Containers）

通过 `:::` 分隔符创建带有样式的提示块。

- **信息提示**

  ```markdown
  ::: info
  这是一个信息提示。
  :::
  ```

- **警告提示**

  ```markdown
  ::: warning
  这是一个警告提示。
  :::
  ```

- **危险警告**

  ```markdown
  ::: danger
  这是一个危险警告。
  :::
  ```

- **自定义标题**

  ```markdown
  ::: tip 自定义标题
  内容...
  :::
  ```

### 3. 代码块增强

- **行高亮**
  使用 `{}` 指定要高亮的行号。

  ````markdown
  ```js {2,3}
  export default {
    data() {
      return {
        msg: "Hello",
      };
    },
  };
  ```
  ````

- **行标记（行内高亮）**
  使用 `// [!code highlight]` 或 `// [!code focus]` 等注释标记特定行。

  ````markdown
  ```js
  function foo() {
    console.log("foo"); // [!code highlight]
  }
  ```
  ````

  支持的指令：

  - `[!code highlight]`: 高亮
  - `[!code focus]`: 聚焦（其他行变暗）
  - `[!code error]`: 错误行
  - `[!code warning]`: 警告行

### 4. 内联 Markdown 展开/折叠（Details/Summary）

原生支持 HTML `<details>` 和 `<summary>` 标签。

```markdown
<details>
<summary>点击展开</summary>

隐藏的内容...

</details>
```

### 5. 组件内联（Component Inlining）

在 Markdown 中直接使用 Vue 组件（需在 `config.js` 中注册或全局导入）。

```markdown
<MyComponent :prop="value" />
```

### 6. Headings 锚点自动链接

标题会自动生成锚点链接，鼠标悬停时显示链接图标。

### 7. Emoji 支持

直接使用 emoji 别名或 Unicode。

```markdown
这很棒 :tada: 或者 🎉
```

### 8. 缩写（Abbreviations）

使用 `*[...]` 定义缩写。

```markdown
\*[HTML]: Hyper Text Markup Language

HTML 是一种标记语言。
```

鼠标悬停时会显示完整解释。

### 9. 自动链接（Autolinks）

自动将 URL 转换为可点击链接。

```markdown
访问 https://vitepress.dev 查看文档。
```

### 10. 图片尺寸设置

支持在 Markdown 图片语法后添加尺寸。

```markdown
![图片](./image.png){width="200"}
```

### 11. VitePress 数据注入

在 Markdown 中访问 `frontmatter` 和 `$frontmatter` 等上下文数据（通常在组件中使用）。

### 12. 导入 Markdown 片段

使用 `@src` 别名导入其他 Markdown 文件内容。

```markdown
<!-- @/components/snippet.md -->
```

### 13. 主题定制类名

可以为元素添加自定义类名以配合 CSS 主题定制。

```markdown
<div class="custom-class">

内容...

</div>
```

---

这些扩展语法极大地提升了文档的可读性和功能性，是构建现代化静态网站文档的理想选择。建议结合官方文档和主题配置进一步探索高级用法。

### 14.style 和 script

Markdown 文件中的根级 `<script>` 和 `<style>` 标签与 Vue SFC 中的一样，包括 `<script setup>`、`<style module>` 等。这里的主要区别是没有 `<template>` 标签：所有其他根级内容都是 Markdown。另请注意，所有标签都应放在 frontmatter **之后**：

```markdown
---
hello: world
---

<script setup>
import { ref } from 'vue'

const count = ref(0)
</script>

## Markdown Content

The count is: {{ count }}

<button :class="$style.button" @click="count++">Increment</button>

<style module>
.button {
  color: red;
  font-weight: bold;
}
</style
```

## 6.自定义主题

创建以下文件结构

```
.
├─ docs                # 项目根目录
│  ├─ .vitepress
│  │  ├─ theme
│  │  │  └─ index.js   # 主题入口
│  │  └─ config.js     # 配置文件
│  └─ index.md
└─ package.json
```

VitePress 自定义主题是一个对象，该对象具有如下接口：

```
interface Theme {
  /**
   * 每个页面的根布局组件
   * @required
   */
  Layout: Component
  /**
   * 增强 Vue 应用实例
   * @optional
   */
  enhanceApp?: (ctx: EnhanceAppContext) => Awaitable<void>
  /**
   * 扩展另一个主题，在我们的主题之前调用它的 `enhanceApp`
   * @optional
   */
  extends?: Theme
}

interface EnhanceAppContext {
  app: App // Vue 应用实例
  router: Router // VitePress 路由实例
  siteData: Ref<SiteData> // 站点级元数据
}
```

主题入口文件需要将主题作为默认导出来导出：

.vitepress/theme/index.js

```
// 可以直接在主题入口导入 Vue 文件
// VitePress 已预先配置 @vitejs/plugin-vue
import Layout from './Layout.vue'

export default {
  Layout,
  enhanceApp({ app, router, siteData }) {
    // ...
  }
}
```

.vitepress/theme/Layout.vue

```
<template>
  <h1>Custom Layout!</h1>

  <!-- 此处将渲染 markd<script setup>
import { useData } from 'vitepress'
import NotFound from './NotFound.vue'
import Home from './Home.vue'
import Page from './Page.vue'

const { page, frontmatter } = useData()
</script>

<template>
  <h1>Custom Layout!</h1>

  <NotFound v-if="page.isNotFound" />
  <Home v-if="frontmatter.layout === 'home'" />
  <Page v-else /> <!-- <Page /> renders <Content /> -->
</template>own 内容 -->
  <Content />
</template>
```

## 7.扩展默认主题

### 1.自定义 CSS

可以通过覆盖根级别的 CSS 变量来自定义默认主题的 CSS：

.vitepress/theme/index.js

```
import DefaultTheme from 'vitepress/theme'
import './custom.css'

export default DefaultTheme
```

```
/* .vitepress/theme/custom.css */
:root {
  --vp-c-brand-1: #646cff;
  --vp-c-brand-2: #747bff;
}
```

### 2.注册全局组件

```
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    // 注册自定义全局组件
    app.component('MyGlobalComponent' /* ... */)
  }
} satisfies Theme
```

## 8.内置组件

徽标

徽标可让你为标题添加状态。例如，指定部分的类型或支持的版本可能很有用。

```
### Title <Badge type="info" text="default" />
### Title <Badge type="tip" text="^1.9.0" />
### Title <Badge type="warning" text="beta" />
### Title <Badge type="danger" text="caution" />
```

效果如下

```
### Title <Badge type="info" text="default" />
### Title <Badge type="tip" text="^1.9.0" />
### Title <Badge type="warning" text="beta" />
### Title <Badge type="danger" text="caution" />
```

## 9.配置

常用配置

这些配置是每个项目基本必备的

```js
// docs/.vitepress/config.js
export default {
  // 站点配置
  lang: "zh-CN",
  title: "我的文档",
  description: "一个使用 VitePress 构建的网站",

  // 主题配置
  themeConfig: {
    // 导航栏
    nav: [
      { text: "指南", link: "/guide/" },
      { text: "API", link: "/api/" },
    ],

    // 侧边栏
    sidebar: {
      "/guide/": [
        {
          text: "指南",
          items: [{ text: "快速开始", link: "/guide/getting-started" }],
        },
      ],
    },

    // 其他
    socialLinks: [{ icon: "github", link: "https://github.com/your/repo" }],
    lastUpdated: true,
    darkModeSwitchLabel: "外观",
  },
};
```

下面的配置是大部分我用得到的配置，一些我觉得没必要学的配置，没有在里面，如果查看完整配置，请查看 vitepress 官网

```js
import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  //页面的元数据
  title: "Yang的文档站",
  titleTemplate: ":title | Yang的文档站", //这里的 :title 将替换为从页面的第一个 <h1> 标题推断出文本
  lang: "zh-CN",
  base: "/", //果计划在子路径例如 GitHub 页面下部署站点，则需要设置此项。
  description:
    "一个记录我学习前端的文档站，系统梳理前端核心概念、API用法及实现原理，方便查阅和复习",
  head: [["link", { rel: "icon", type: "image/png", href: "/logo.png" }]],
  //路由
  cleanUrls: true, //当设置为 true 时，VitePress 将从 URL 中删除 .html 后缀
  // rewrites: {
  //   // 'source/:page': 'destination/:page' //例如这个规则
  // },
  //构建
  // srcDir: "./", //相对于项目根目录的 markdown 文件所在的文件夹
  // srcExclude: ["**/README.md"],
  // outDir: "docs/.vitepress/dist",//输出的位置
  // assetsDir: "assets",//静态资源的输出目录
  // ignoreDeadLinks: true,//当设置为 true 时，VitePress 将忽略所有死链接，而不是抛出错误
  //主题
  // appearance: "dark", //默认主题
  lastUpdated: true, //是否使用 Git 获取每个页面的最后更新时间戳

  themeConfig: {
    logo: "/logo.png",
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "首页", link: "/" },
      { text: "vue3文档", link: "/vue3" },
      { text: "vue2文档", link: "/vue2" },
      {
        text: "vue生态",
        items: [
          {
            text: "pinia",
            link: "/vue-ecology/pinia",
          },
          {
            text: "vue-router",
            link: "/vue-ecology/vue-router",
          },
        ],
      },
      {
        text: "博客",
        link: "http://yang0709.3vfree.club/",
      },
    ],
    sidebar: {
      "/": [
        {
          text: "vue3文档",
          items: [
            {
              text: "vue3",
              link: "/vue3",
            },
          ],
        },
        {
          text: "vue2文档",
          items: [
            {
              text: "vue2",
              link: "/vue2",
            },
          ],
        },
        {
          text: "vue生态",
          items: [
            {
              text: "pinia",
              link: "/vue-ecology/pinia",
            },
            {
              text: "vue-router",
              link: "/vue-ecology/vue-router",
            },
          ],
        },
      ],
    },
    // aside:"left",//false=>关闭,true=>右边,left=>左边
    // outline: [2, 3],
    socialLinks: [{ icon: "github", link: "https://github.com/yang040709" }],
    footer: {
      message: "基于 MIT 许可发布",
      copyright:
        "版权所有  © 2025-至今 <a href='https://github.com/yang040709/yang-document-station'>Yang 的文档站</a>",
    },
    docFooter: {
      prev: "上一篇",
      next: "下一篇",
    },
    search: {
      // 启动搜索
      provider: "local",
    },
    outline: {
      label: "页面导航",
      level: [2, 3],
    },

    lastUpdated: {
      text: "最后更新于",
    },

    notFound: {
      title: "页面未找到",
      quote:
        "但如果你不改变方向，并且继续寻找，你可能最终会到达你所前往的地方。",
      linkLabel: "前往首页",
      linkText: "带我回首页",
    },

    langMenuLabel: "多语言",
    returnToTopLabel: "回到顶部",
    sidebarMenuLabel: "菜单",
    darkModeSwitchLabel: "主题",
    lightModeSwitchTitle: "切换到浅色模式",
    darkModeSwitchTitle: "切换到深色模式",
    skipToContentLabel: "跳转到内容",
  },
  markdown: {
    lineNumbers: true,
    container: {
      tipLabel: "提示",
      warningLabel: "警告",
      dangerLabel: "危险",
      infoLabel: "信息",
      detailsLabel: "详细信息",
    },
    image: {
      lazyLoading: true, //是否启用图片懒加载
    },
  },
  vite: {
    server: {
      host: true,
      port: 4023,
    },
  },
});
```

## 10.frontmatter 常用配置

这个配置可以覆盖系统级的配置，从而实现页面的自定义

```
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
```

文档没有介绍的功能

[扩展默认主题 | VitePress](https://vitepress.dev/zh/guide/extending-default-theme)的布局插槽部分

[国际化 | VitePress](https://vitepress.dev/zh/guide/i18n)

[构建时数据加载 | VitePress](https://vitepress.dev/zh/guide/data-loading)

[SSR 兼容性 | VitePress](https://vitepress.dev/zh/guide/ssr-compat)

[运行时 API | VitePress](https://vitepress.dev/zh/reference/runtime-api)

[命令行接口 | VitePress](https://vitepress.dev/zh/reference/cli)

[团队页 | VitePress](https://vitepress.dev/zh/reference/default-theme-team-page)

[编辑链接 | VitePress](https://vitepress.dev/zh/reference/default-theme-edit-link)

建议读者根据需要去阅读这些文档，但是我介绍的作为一个静态文档网站基本就够用了
