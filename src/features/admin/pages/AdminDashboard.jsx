import { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  ShoppingBag,
  Users,
  Package,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import LoadingSpinner from "../../../components/shared/LoadingSpinner";
import { useGetAllOrdersQuery } from "../../orders/ordersAPI";
import { useGetProductsQuery } from "../../products/productsAPI";

function AdminDashboard() {
  const { data: ordersData, isLoading: ordersLoading } = useGetAllOrdersQuery();
  const { data: productsData, isLoading: productsLoading } =
    useGetProductsQuery({
      category: "all",
      sortBy: "newest",
      searchTerm: "",
      page: 1,
      pageSize: 100,
    });

  // Calculate statistics
  const stats = useMemo(() => {
    if (!ordersData || !productsData) return null;

    const orders = ordersData || [];
    const products = productsData?.products || [];

    // Total Revenue
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);

    // Today's Revenue
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayRevenue = orders
      .filter((order) => new Date(order.createdAt) >= today)
      .reduce((sum, order) => sum + order.total, 0);

    // Total Orders
    const totalOrders = orders.length;

    // Pending Orders
    const pendingOrders = orders.filter(
      (order) => order.status === "pending"
    ).length;

    // Total Products
    const totalProducts = products.length;

    // Low Stock Products
    const lowStockProducts = products.filter(
      (product) => product.stock <= 10
    ).length;

    // Total Users (Mock - Firebase Auth-аас авна)
    const totalUsers = 150;

    return {
      totalRevenue,
      todayRevenue,
      totalOrders,
      pendingOrders,
      totalProducts,
      lowStockProducts,
      totalUsers,
    };
  }, [ordersData, productsData]);

  // Recent Orders
  const recentOrders = useMemo(() => {
    if (!ordersData) return [];
    return ordersData.slice(0, 5);
  }, [ordersData]);

  if (ordersLoading || productsLoading) {
    return <LoadingSpinner fullScreen />;
  }

  if (!stats) {
    return <div>Мэдээлэл байхгүй байна</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Админ удирдлага</h1>
        <p className="text-muted-foreground">
          Ерөнхий мэдээлэл болон статистик
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Revenue */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Нийт орлого
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalRevenue.toLocaleString()}₮
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <span className="flex items-center text-green-600">
                <ArrowUpRight className="h-3 w-3" />
                +20.1%
              </span>
              өмнөх сартай харьцуулахад
            </p>
          </CardContent>
        </Card>

        {/* Total Orders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Нийт захиалга
            </CardTitle>
            <ShoppingBag className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="font-semibold text-yellow-600">
                {stats.pendingOrders}
              </span>{" "}
              хүлээгдэж байна
            </p>
          </CardContent>
        </Card>

        {/* Total Products */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Нийт бүтээгдэхүүн
            </CardTitle>
            <Package className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="font-semibold text-destructive">
                {stats.lowStockProducts}
              </span>{" "}
              бага нөөцтэй
            </p>
          </CardContent>
        </Card>

        {/* Total Users */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Нийт хэрэглэгч
            </CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <span className="flex items-center text-green-600">
                <ArrowUpRight className="h-3 w-3" />
                +12
              </span>
              энэ сард
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link to="/admin/products">
          <Button variant="outline" className="w-full">
            <Package className="h-4 w-4 mr-2" />
            Бүтээгдэхүүн
          </Button>
        </Link>
        <Link to="/admin/orders">
          <Button variant="outline" className="w-full">
            <ShoppingBag className="h-4 w-4 mr-2" />
            Захиалга
          </Button>
        </Link>
        <Link to="/admin/users">
          <Button variant="outline" className="w-full">
            <Users className="h-4 w-4 mr-2" />
            Хэрэглэгчид
          </Button>
        </Link>
        <Link to="/admin/analytics">
          <Button variant="outline" className="w-full">
            <TrendingUp className="h-4 w-4 mr-2" />
            Тайлан
          </Button>
        </Link>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Сүүлийн захиалгууд</CardTitle>
            <Link to="/admin/orders">
              <Button variant="ghost" size="sm">
                Бүгдийг үзэх
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {recentOrders.length > 0 ? (
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between py-3 border-b last:border-0"
                >
                  <div className="flex-1">
                    <p className="font-semibold">{order.orderNumber}</p>
                    <p className="text-sm text-muted-foreground">
                      {order.shippingInfo.name} • {order.items.length} бараа
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      {order.total.toLocaleString()}₮
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString("mn-MN")}
                    </p>
                  </div>
                  <Link to={`/admin/orders`}>
                    <Button variant="ghost" size="sm" className="ml-4">
                      Үзэх
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              Захиалга байхгүй байна
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default AdminDashboard;
