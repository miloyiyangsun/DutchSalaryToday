// 路由相关类型定义
// Route related type definitions

// 路由路径常量 - 支持所有5个故事Sprint
export const ROUTES = {
  // 主页
  HOME: '/',
  
  // 故事路由 - 按Sprint组织
  ICE_AND_FIRE: '/ice-and-fire',           // Sprint 1: Industry Ice and Fire
  GENDER_POWER: '/gender-power',           // Sprint 2: Gender Power (未来)
  HIDDEN_COSTS: '/hidden-costs',           // Sprint 3: Hidden Costs (未来)
  WORK_REVOLUTION: '/work-revolution',     // Sprint 4: Work Revolution (未来)
  EFFICIENCY_MYSTERY: '/efficiency-mystery' // Sprint 5: Efficiency Mystery (未来)
} as const;

// 故事主题类型
export type StoryTheme = 'ice-and-fire' | 'gender-power' | 'hidden-costs' | 'work-revolution' | 'efficiency-mystery';