import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  //页面的元数据
  title: "Yang的文档站",
  titleTemplate: ":title | Yang的文档站", //这里的 :title 将替换为从页面的第一个 <h1> 标题推断出文本
  lang: "zh-CN",
  base: "/",
  // base: "/document/",//如果计划在子路径例如 GitHub 页面下部署站点，则需要设置此项。
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
          {
            text: "vite-press",
            link: "/vue-ecology/vite-press",
          },
          {
            text: "vitest",
            link: "/vue-ecology/vitest",
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
            {
              text: "vite-press",
              link: "/vue-ecology/vite-press",
            },
            {
              text: "vitest",
              link: "/vue-ecology/vitest",
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
