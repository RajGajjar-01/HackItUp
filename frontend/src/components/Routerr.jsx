import { Routes, Route, BrowserRouter } from "react-router-dom";
import Landing from "../pages/Landing";
import Dashboard from "../pages/Dashboard";
import InventoryPage from "../pages/inventory";
import Menu from "../pages/Menu";
import WasteAnalysis from "../pages/WasteAnalysis";
import PageNotFound from "../pages/PageNotFound";

const appRoutes = [
  { path: "/", element: <Landing /> },
  { path: "/dashboard", element: <Dashboard /> },
  { path: "/inventory", element: <InventoryPage /> },
  { path: "/menu", element: <Menu /> },
  { path: "/waste-analysis", element: <WasteAnalysis /> },
];

function Routerr() {
  return (
    <BrowserRouter>
    <Routes>
      {appRoutes.map((route, index) => (
        <Route key={index} path={route.path} element={route.element} />
      ))}
      <Route path="*" element={<PageNotFound />} />
    </Routes>
    </BrowserRouter>
  );
}

export default Routerr;