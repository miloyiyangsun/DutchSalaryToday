// App.tsx - 路由容器
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import IceAndFirePage from './pages/stories/IceAndFirePage';
import WorkHoursPage from './pages/stories/WorkHoursPage';
import { ROUTES } from './types/routes';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 首页路由 */}
        <Route path={ROUTES.HOME} element={<HomePage />} />
        {/* Sprint1故事页面路由 - Industry Ice and Fire */}
        <Route path={ROUTES.ICE_AND_FIRE} element={<IceAndFirePage />} />
        {/* Sprint2故事页面路由 - Work Hours Analysis */}
        <Route path={ROUTES.WORK_HOURS} element={<WorkHoursPage />} />
        {/* 404页面 */}
        <Route path="*" element={<div>404 - Page Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;