// 引入Express框架和CORS跨域中间件
const express = require("express");
const cors = require("cors");

// 创建Express应用实例
const app = express();
// 启用CORS，允许前端跨域访问
app.use(cors());

// 定义核心洞察数据API端点
app.get("/api/v1/core-insights", (req, res) => {
  // 返回Sprint 1的三个核心数字
  res.json({
    growthChampion: {
      industry: "Information and communication", // 增长冠军行业
      rate: "164.5%", // 增长率
    },
    growthSlowest: {
      industry: "Agriculture, forestry and fishing", // 增长最慢行业
      rate: "20.8%", // 增长率
    },
    salaryGap: {
      from: "2.6x", // 2010年差距倍数
      to: "3.4x", // 2024年差距倍数
    },
  });
});

// 启动服务器，监听3001端口
app.listen(3001, () => {
  console.log("Mock API running on http://localhost:3001");
});
