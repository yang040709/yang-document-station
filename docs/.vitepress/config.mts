import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Yang的文档站",
  lang: "zh-CN",
  description: "好记性不如烂笔头",
  head: [["link", { rel: "icon", type: "image/png", href: "/logo.png" }]],
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
    sidebar: [
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
      lazyLoading: true,
    },
  },
});
