export default {
  pages: ["pages/index/index", "pages/complexDemo/index"],
  window: {
    backgroundTextStyle: "light",
    navigationBarBackgroundColor: "#fff",
    navigationBarTitleText: "WeChat",
    navigationBarTextStyle: "black",
  },
  tabBar: {
      list: [
      {
        text: "简单例子",
        pagePath: "pages/index/index",
      },
      {
        text: "复杂例子",
        pagePath: "pages/complexDemo/index",
      },
    ],
  },
};
