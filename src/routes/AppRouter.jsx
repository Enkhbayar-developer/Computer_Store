import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import LoadingSpinner from "../components/shared/LoadingSpinner";

// Lazy loading хуудаснууд
const HomePage = lazy(() => import("../pages/HomePage"));
const NotFoundPage = lazy(() => import("../pages/NotFoundPage"));

// Layout
import MainLayout from "../components/layout/MainLayout";

function AppRouter() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />

          {/* Бусад route-ууд энд нэмэгдэнэ */}
          {/* Products, Cart, Checkout, Orders, Profile гэх мэт */}

          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default AppRouter;
