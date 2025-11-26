import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import LoadingSpinner from "../components/shared/LoadingSpinner";
import ProtectedRoute from "../components/shared/ProtectedRoute";
import AdminRoute from "../components/shared/AdminRoute";

// Layout
import MainLayout from "../components/layout/MainLayout";

// Lazy loading хуудаснууд
const HomePage = lazy(() => import("../pages/HomePage"));
const NotFoundPage = lazy(() => import("../pages/NotFoundPage"));

// Auth Pages
const LoginPage = lazy(() => import("../features/auth/pages/LoginPage"));
const RegisterPage = lazy(() => import("../features/auth/pages/RegisterPage"));

// Product Pages
const ProductsPage = lazy(() =>
  import("../features/products/pages/ProductsPage")
);
const ProductDetailPage = lazy(() =>
  import("../features/products/pages/ProductDetailPage")
);

// Cart & Checkout
const CartPage = lazy(() => import("../features/cart/pages/CartPage"));
// const CheckoutPage = lazy(() => import('../features/checkout/pages/CheckoutPage'));
// const OrderSuccessPage = lazy(() => import('../features/checkout/pages/OrderSuccessPage'));

// Checkout Pages
const CheckoutPage = lazy(() =>
  import("../features/checkout/pages/CheckoutPage")
);
const OrderSuccessPage = lazy(() =>
  import("../features/checkout/pages/OrderSuccessPage")
);

// User Pages (Protected)
const ProfilePage = lazy(() => import("../features/user/pages/ProfilePage"));
const OrdersPage = lazy(() => import("../features/orders/pages/OrdersPage"));
const OrderDetailPage = lazy(() =>
  import("../features/orders/pages/OrderDetailPage")
);
const WishlistPage = lazy(() => import("../features/user/pages/WishlistPage"));

// Admin Pages (Admin Only)
const AdminDashboard = lazy(() =>
  import("../features/admin/pages/AdminDashboard")
);
const AdminProducts = lazy(() =>
  import("../features/admin/pages/AdminProducts")
);
const AdminOrders = lazy(() => import("../features/admin/pages/AdminOrders"));
const AdminUsers = lazy(() => import("../features/admin/pages/AdminUsers"));

function AppRouter() {
  return (
    <Suspense fallback={<LoadingSpinner fullScreen />}>
      <Routes>
        <Route element={<MainLayout />}>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />

          {/* Auth Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Cart (Public but persists) */}
          <Route path="/cart" element={<CartPage />} />

          {/* Protected Routes - Нэвтэрсэн хэрэглэгч шаардлагатай */}
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <CheckoutPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/order-success/:orderId"
            element={
              <ProtectedRoute>
                <OrderSuccessPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <OrdersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders/:id"
            element={
              <ProtectedRoute>
                <OrderDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/wishlist"
            element={
              <ProtectedRoute>
                <WishlistPage />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes - Admin эрх шаардлагатай */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/products"
            element={
              <AdminRoute>
                <AdminProducts />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <AdminRoute>
                <AdminOrders />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <AdminRoute>
                <AdminUsers />
              </AdminRoute>
            }
          />

          {/* 404 Not Found */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default AppRouter;
