// 路由相关类型定义
// Route related type definitions

// 路由路径常量 - 支持所有5个故事Sprint
export const ROUTES = {
  // 主页
  HOME: '/',
  
  // 故事路由 - 按Sprint组织 (重新排序后)
  ICE_AND_FIRE: '/ice-and-fire',           // Sprint 1: Industry Ice and Fire
  WORK_HOURS: '/work-hours',               // Sprint 2: Work Hours Analysis 
  GENDER_POWER: '/gender-power',           // Sprint 3: Gender Power (未来)
  WORK_INTENSIFICATION: '/work-intensification', // Sprint 4: Work Intensification (未来)
  HIDDEN_COSTS: '/hidden-costs'            // Sprint 5: Hidden Costs (未来)
} as const;

// 故事主题类型 - 更新后的顺序
export type StoryTheme = 'ice-and-fire' | 'work-hours' | 'gender-power' | 'work-intensification' | 'hidden-costs';