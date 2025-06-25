const path = require("path");

module.exports = {
  transpileDependencies: true,

  // Proxy để tránh lỗi CORS & fetch thất bại
  devServer: {
    proxy: {
      "/api": {
        target: "http://localhost/backend_tkb",
        changeOrigin: true,
        pathRewrite: {
          "^/api": "/api",
        },
      },
    },
  },

  configureWebpack: {
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
  },
};
