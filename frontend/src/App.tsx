// App.tsx - 路由容器
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import IceAndFirePage from './pages/stories/IceAndFirePage';
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
        {/* 404页面 */}
        <Route path="*" element={<div>404 - Page Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;