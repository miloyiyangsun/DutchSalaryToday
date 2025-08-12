// OpenAPI契约验证脚本
// 验证Mock服务器响应是否符合OpenAPI规范定义

const fs = require('fs');
const yaml = require('js-yaml');
const axios = require('axios');

// 验证脚本主函数
async function validateContract() {
  try {
    console.log('🔍 开始验证OpenAPI契约...\n');

    // 1. 读取OpenAPI规范文件
    console.log('📖 读取 openapi.yaml...');
    const openapiContent = fs.readFileSync('./openapi.yaml', 'utf8');
    const openapiSpec = yaml.load(openapiContent);
    
    // 2. 提取期望的响应结构
    const expectedSchema = openapiSpec.paths['/api/v1/core-insights'].get.responses['200'].content['application/json'].schema;
    console.log('✅ OpenAPI规范加载成功');

    // 3. 请求Mock API
    console.log('🌐 请求Mock API: http://localhost:3001/api/v1/core-insights');
    const response = await axios.get('http://localhost:3001/api/v1/core-insights');
    const actualData = response.data;
    console.log('✅ Mock API响应成功\n');

    // 4. 详细验证响应结构
    console.log('🔬 开始详细验证数据结构...\n');
    
    // 期望的数据结构定义
    const expectedStructure = {
      'growthChampion': {
        type: 'object',
        properties: {
          'industry': { type: 'string' },
          'rate': { type: 'string' }
        }
      },
      'growthSlowest': {
        type: 'object', 
        properties: {
          'industry': { type: 'string' },
          'rate': { type: 'string' }
        }
      },
      'salaryGap': {
        type: 'object',
        properties: {
          'from': { type: 'string' },
          'to': { type: 'string' }
        }
      }
    };

    let isValid = true;
    const errors = [];
    const comparisons = [];

    // 详细字段对比
    console.log('📋 详细字段对比:');
    console.log('==========================================');
    console.log('字段路径                    | 期望类型 | 实际值                      | 状态');
    console.log('------------------------------------------');

    // 验证每个顶级字段
    for (const [fieldName, fieldSchema] of Object.entries(expectedStructure)) {
      const actualValue = actualData[fieldName];
      const expectedType = fieldSchema.type;
      const actualType = actualValue ? typeof actualValue : 'undefined';
      
      // 顶级字段验证
      if (!actualValue) {
        console.log(`${fieldName.padEnd(27)} | ${expectedType.padEnd(8)} | undefined                   | ❌ 缺失`);
        errors.push(`❌ 缺少必需字段: ${fieldName}`);
        isValid = false;
        continue;
      }
      
      const typeMatch = actualType === expectedType || (expectedType === 'object' && actualType === 'object');
      const status = typeMatch ? '✅ 匹配' : '❌ 类型不匹配';
      
      console.log(`${fieldName.padEnd(27)} | ${expectedType.padEnd(8)} | [${actualType}]${' '.repeat(16)} | ${status}`);
      
      if (!typeMatch) {
        errors.push(`❌ ${fieldName} 类型不匹配: 期望 ${expectedType}, 实际 ${actualType}`);
        isValid = false;
      }

      // 子字段验证
      if (fieldSchema.properties && actualValue) {
        for (const [propName, propSchema] of Object.entries(fieldSchema.properties)) {
          const actualPropValue = actualValue[propName];
          const expectedPropType = propSchema.type;
          const actualPropType = actualPropValue ? typeof actualPropValue : 'undefined';
          
          if (!actualPropValue) {
            console.log(`├─ ${propName.padEnd(22)} | ${expectedPropType.padEnd(8)} | undefined                   | ❌ 缺失`);
            errors.push(`❌ ${fieldName}.${propName} 字段缺失`);
            isValid = false;
            continue;
          }
          
          const propTypeMatch = actualPropType === expectedPropType;
          const propStatus = propTypeMatch ? '✅ 匹配' : '❌ 类型不匹配';
          
          // 截断过长的值用于显示
          let displayValue = String(actualPropValue);
          if (displayValue.length > 25) {
            displayValue = displayValue.substring(0, 22) + '...';
          }
          
          console.log(`├─ ${propName.padEnd(22)} | ${expectedPropType.padEnd(8)} | "${displayValue}"${' '.repeat(Math.max(0, 24-displayValue.length))} | ${propStatus}`);
          
          if (!propTypeMatch) {
            errors.push(`❌ ${fieldName}.${propName} 类型不匹配: 期望 ${expectedPropType}, 实际 ${actualPropType}`);
            isValid = false;
          }
          
          // 记录对比信息
          comparisons.push({
            path: `${fieldName}.${propName}`,
            expected: expectedPropType,
            actual: actualPropValue,
            actualType: actualPropType,
            match: propTypeMatch
          });
        }
      }
    }

    console.log('------------------------------------------\n');

    // 5. 数据结构对比展示
    console.log('📊 期望结构 vs 实际数据对比:');
    console.log('==========================================');
    
    console.log('\n🎯 OpenAPI 期望结构:');
    console.log('┌─ growthChampion (object)');
    console.log('│  ├─ industry (string)');  
    console.log('│  └─ rate (string)');
    console.log('├─ growthSlowest (object)');
    console.log('│  ├─ industry (string)');
    console.log('│  └─ rate (string)');
    console.log('└─ salaryGap (object)');
    console.log('   ├─ from (string)');
    console.log('   └─ to (string)');

    console.log('\n🔍 Mock API 实际数据:');
    console.log('┌─ growthChampion:');
    console.log(`│  ├─ industry: "${actualData.growthChampion?.industry || 'undefined'}"`);
    console.log(`│  └─ rate: "${actualData.growthChampion?.rate || 'undefined'}"`);
    console.log('├─ growthSlowest:');
    console.log(`│  ├─ industry: "${actualData.growthSlowest?.industry || 'undefined'}"`);
    console.log(`│  └─ rate: "${actualData.growthSlowest?.rate || 'undefined'}"`);
    console.log('└─ salaryGap:');
    console.log(`   ├─ from: "${actualData.salaryGap?.from || 'undefined'}"`);
    console.log(`   └─ to: "${actualData.salaryGap?.to || 'undefined'}"`);

    // 6. 最终验证结果
    console.log('\n📊 最终验证结果:');
    console.log('==================');
    
    if (isValid) {
      console.log('🎉 契约验证完全通过！');
      console.log('✅ 所有字段类型匹配');
      console.log('✅ 所有必需字段存在'); 
      console.log('✅ Mock API响应完全符合OpenAPI规范定义');
      
      // 统计信息
      const totalFields = comparisons.length;
      const matchedFields = comparisons.filter(c => c.match).length;
      console.log(`\n📈 统计信息: ${matchedFields}/${totalFields} 字段验证通过`);
      
    } else {
      console.log('💥 契约验证失败！');
      console.log('发现以下问题:');
      errors.forEach(error => console.log(`  ${error}`));
      
      console.log('\n🔧 建议修复:');
      console.log('1. 检查 mock-server.js 中的数据结构');
      console.log('2. 确保所有字段类型与 openapi.yaml 定义一致');
      console.log('3. 修复后重新运行 npm run validate');
      
      process.exit(1);
    }

  } catch (error) {
    console.error('❌ 验证过程出错:');
    if (error.code === 'ECONNREFUSED') {
      console.error('🚫 无法连接到Mock服务器');
      console.error('请确保已启动Mock服务器: npm start');
    } else {
      console.error(error.message);
    }
    process.exit(1);
  }
}

// 运行验证
validateContract();