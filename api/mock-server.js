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

// 薪资差距趋势数据API端点
app.get("/api/v1/salary-gap-trends", (req, res) => {
  // 返回2010-2024年薪资差距倍数变化数据 + 各行业详细薪资
  res.json({
    title: "荷兰行业工资差距倍数变化趋势 (2010-2024)",
    data: [
      { 
        year: 2010, 
        gapRatio: 3.1,
        industries: {
          "Information and communication": 58000,
          "Financial and insurance activities": 65000,
          "Manufacturing": 42000,
          "Construction": 35000,
          "Agriculture, forestry and fishing": 27000
        }
      },
      { 
        year: 2011, 
        gapRatio: 3.15,
        industries: {
          "Information and communication": 59500,
          "Financial and insurance activities": 66200,
          "Manufacturing": 42800,
          "Construction": 35500,
          "Agriculture, forestry and fishing": 27200
        }
      },
      { 
        year: 2012, 
        gapRatio: 3.12,
        industries: {
          "Information and communication": 61000,
          "Financial and insurance activities": 68000,
          "Manufacturing": 44000,
          "Construction": 36000,
          "Agriculture, forestry and fishing": 28000
        }
      },
      { 
        year: 2013, 
        gapRatio: 3.08,
        industries: {
          "Information and communication": 62800,
          "Financial and insurance activities": 69500,
          "Manufacturing": 45200,
          "Construction": 36800,
          "Agriculture, forestry and fishing": 28500
        }
      },
      { 
        year: 2014, 
        gapRatio: 3.05,
        industries: {
          "Information and communication": 64500,
          "Financial and insurance activities": 71000,
          "Manufacturing": 46500,
          "Construction": 37500,
          "Agriculture, forestry and fishing": 29000
        }
      },
      { 
        year: 2015, 
        gapRatio: 3.2,
        industries: {
          "Information and communication": 66800,
          "Financial and insurance activities": 73500,
          "Manufacturing": 48000,
          "Construction": 38200,
          "Agriculture, forestry and fishing": 29200
        }
      },
      { 
        year: 2016, 
        gapRatio: 3.45,
        industries: {
          "Information and communication": 70200,
          "Financial and insurance activities": 76800,
          "Manufacturing": 50500,
          "Construction": 39500,
          "Agriculture, forestry and fishing": 29800
        }
      },
      { 
        year: 2017, 
        gapRatio: 3.6,
        industries: {
          "Information and communication": 74500,
          "Financial and insurance activities": 80200,
          "Manufacturing": 53000,
          "Construction": 41000,
          "Agriculture, forestry and fishing": 30500
        }
      },
      { 
        year: 2018, 
        gapRatio: 3.5,
        industries: {
          "Information and communication": 77800,
          "Financial and insurance activities": 82500,
          "Manufacturing": 55500,
          "Construction": 42800,
          "Agriculture, forestry and fishing": 31200
        }
      },
      { 
        year: 2019, 
        gapRatio: 3.3,
        industries: {
          "Information and communication": 80500,
          "Financial and insurance activities": 84000,
          "Manufacturing": 57800,
          "Construction": 44500,
          "Agriculture, forestry and fishing": 32000
        }
      },
      { 
        year: 2020, 
        gapRatio: 3.2,
        industries: {
          "Information and communication": 82800,
          "Financial and insurance activities": 85500,
          "Manufacturing": 59200,
          "Construction": 45800,
          "Agriculture, forestry and fishing": 32500
        }
      },
      { 
        year: 2021, 
        gapRatio: 3.1,
        industries: {
          "Information and communication": 84200,
          "Financial and insurance activities": 86800,
          "Manufacturing": 60500,
          "Construction": 46800,
          "Agriculture, forestry and fishing": 33000
        }
      },
      { 
        year: 2022, 
        gapRatio: 3.0,
        industries: {
          "Information and communication": 86500,
          "Financial and insurance activities": 88200,
          "Manufacturing": 62000,
          "Construction": 48000,
          "Agriculture, forestry and fishing": 33200
        }
      },
      { 
        year: 2023, 
        gapRatio: 2.95,
        industries: {
          "Information and communication": 88000,
          "Financial and insurance activities": 89000,
          "Manufacturing": 63500,
          "Construction": 49200,
          "Agriculture, forestry and fishing": 33500
        }
      },
      { 
        year: 2024, 
        gapRatio: 2.9,
        industries: {
          "Information and communication": 89400,
          "Financial and insurance activities": 89800,
          "Manufacturing": 64800,
          "Construction": 50500,
          "Agriculture, forestry and fishing": 33800
        }
      }
    ],
    industries: [
      "Information and communication",
      "Financial and insurance activities", 
      "Manufacturing",
      "Construction",
      "Agriculture, forestry and fishing"
    ]
  });
});

// 工资增长排名数据API端点
app.get("/api/v1/growth-rankings", (req, res) => {
  // 返回2010-2024年行业工资增长排名数据
  res.json({
    title: "2010-2024年行业工资增长趋势",
    rankings: [
      {
        rank: 1,
        industry: "Information and communication",
        growthRate: "+53.4%",
        startSalary: "58k",
        endSalary: "89k",
        unit: "欧元"
      },
      {
        rank: 2, 
        industry: "Finance",
        growthRate: "+36.9%",
        startSalary: "65k",
        endSalary: "89k",
        unit: "欧元"
      },
      {
        rank: 3,
        industry: "Manufacturing",
        growthRate: "+59.5%",
        startSalary: "42k", 
        endSalary: "67k",
        unit: "欧元"
      },
      {
        rank: 4,
        industry: "Construction",
        growthRate: "+51.4%",
        startSalary: "35k",
        endSalary: "53k", 
        unit: "欧元"
      },
      {
        rank: 5,
        industry: "Agriculture",
        growthRate: "+22.2%",
        startSalary: "27k",
        endSalary: "33k",
        unit: "欧元"
      }
    ],
    trendData: [
      { year: 2010, "Information and communication": 58, "Manufacturing": 42, "Agriculture": 27, "Construction": 35, "Finance": 65 },
      { year: 2012, "Information and communication": 62, "Manufacturing": 45, "Agriculture": 28, "Construction": 37, "Finance": 68 },
      { year: 2014, "Information and communication": 66, "Manufacturing": 48, "Agriculture": 29, "Construction": 39, "Finance": 72 },
      { year: 2016, "Information and communication": 71, "Manufacturing": 52, "Agriculture": 30, "Construction": 42, "Finance": 76 },
      { year: 2018, "Information and communication": 76, "Manufacturing": 56, "Agriculture": 31, "Construction": 45, "Finance": 80 },
      { year: 2020, "Information and communication": 82, "Manufacturing": 60, "Agriculture": 32, "Construction": 48, "Finance": 84 },
      { year: 2022, "Information and communication": 86, "Manufacturing": 64, "Agriculture": 33, "Construction": 51, "Finance": 87 },
      { year: 2024, "Information and communication": 89, "Manufacturing": 67, "Agriculture": 33, "Construction": 53, "Finance": 89 }
    ]
  });
});

// 启动服务器，监听3001端口
app.listen(3001, () => {
  console.log("Mock API running on http://localhost:3001");
});
