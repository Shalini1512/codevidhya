module.exports = {
  // productionSourceMap: true,
  devServer: {
    proxy: {
      "^/api": {
        target: "http://localhost:3010",
        changeOrigin: true,
        pathRewrite: {
          "^/api": ""
        }
      },
    
      "/pythonapi": {
        target: "http://localhost:3500",
        changeOrigin: true,
        pathRewrite: {
          "^/pythonapi": ""
        }
      },
      "/Codeplay": {
        target: "http://localhost:5000",
        changeOrigin: true,
        pathRewrite: {
          "^/Codeplay": ""
        }
      },
      "/dynamic": {
        target: "http://localhost:5000",
        changeOrigin: true,
        pathRewrite: {
          "^/dynamic": ""
        }
      },
      "/resources": {
        target: "http://localhost:5000",
        changeOrigin: true,
        pathRewrite: {
          "^/resources": ""
        }
      },
      "/share": {
        target: "http://localhost:3020",
        changeOrigin: true,
        pathRewrite: {
          "^/share": ""
        }
      }
    }
  }
};
