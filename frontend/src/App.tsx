// App.tsx - 路由容器
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import IceAndFirePage from "./pages/stories/IceAndFirePage";
import WorkHoursPage from "./pages/stories/WorkHoursPage";
import GenderPowerPage from "./pages/stories/GenderPowerPage";
import WorkIntensificationPage from "./pages/stories/WorkIntensificationPage";
import HiddenCostPage from "./pages/stories/HiddenCostPage";
import { ROUTES } from "./types/routes";

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
        {/* Sprint3故事页面路由 - Gender Power Rise */}
        <Route path={ROUTES.GENDER_POWER} element={<GenderPowerPage />} />
        {/* Sprint4故事页面路由 - Work Intensification Revolution */}
        <Route
          path={ROUTES.WORK_INTENSIFICATION}
          element={<WorkIntensificationPage />}
        />
        {/* Sprint5故事页面路由 - Hidden Labor Costs */}
        <Route path={ROUTES.HIDDEN_COSTS} element={<HiddenCostPage />} />
        {/* 404页面 */}
        <Route path="*" element={<div>404 - Page Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
