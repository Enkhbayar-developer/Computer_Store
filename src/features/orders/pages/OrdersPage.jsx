import { Link } from "react-router-dom";
import { Package, ChevronRight } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Card, CardContent } from "../../../components/ui/card";
import LoadingSpinner from "../../../components/shared/LoadingSpinner";
import { useGetUserOrdersQuery } from "../ordersAPI";
import { useAuth } from "../../../hooks/useAuth";

function OrdersPage() {
  const { user } = useAuth();
  const { data: orders, isLoading } = useGetUserOrdersQuery(user?.uid);

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return "Хүлээгдэж байна";
      case "processing":
        return "Боловсруулж байна";
      case "shipped":
        return "Хүргэгдэж байна";
      case "delivered":
        return "Хүргэгдсэн";
      case "cancelled":
        return "Цуцлагдсан";
      default:
        return status;
    }
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Миний захиалгууд</h1>
        <p className="text-muted-foreground">{orders?.length || 0} захиалга</p>
      </div>

      {/* Orders List */}
      {orders && orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Left - Order Info */}
                  <div className="flex-1 space-y-4">
                    {/* Order Header */}
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">
                          Захиалгын дугаар
                        </p>
                        <p className="font-bold text-lg">{order.orderNumber}</p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {getStatusText(order.status)}
                      </span>
                    </div>

                    {/* Order Date */}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>
                        {new Date(order.createdAt).toLocaleDateString("mn-MN", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                      <span>•</span>
                      <span>{order.items.length} бараа</span>
                      <span>•</span>
                      <span className="font-semibold text-foreground">
                        {order.total.toLocaleString()}₮
                      </span>
                    </div>

                    {/* Order Items Preview */}
                    <div className="flex items-center gap-2">
                      {order.items.slice(0, 3).map((item, index) => (
                        <div
                          key={index}
                          className="w-16 h-16 rounded-lg overflow-hidden bg-muted border"
                        >
                          <img
                            src={item.image || "/placeholder.png"}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <div className="w-16 h-16 rounded-lg bg-muted border flex items-center justify-center text-sm font-medium text-muted-foreground">
                          +{order.items.length - 3}
                        </div>
                      )}
                    </div>

                    {/* Shipping Address */}
                    <div className="text-sm">
                      <p className="text-muted-foreground mb-1">Хүргэх хаяг:</p>
                      <p className="font-medium">
                        {order.shippingInfo.address},{" "}
                        {order.shippingInfo.district}
                      </p>
                    </div>
                  </div>

                  {/* Right - Actions */}
                  <div className="flex lg:flex-col gap-2 lg:justify-center">
                    <Link
                      to={`/orders/${order.id}`}
                      className="flex-1 lg:flex-none"
                    >
                      <Button variant="outline" className="w-full">
                        Дэлгэрэнгүй
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                    {order.status === "delivered" && (
                      <Button variant="ghost" className="flex-1 lg:flex-none">
                        Үнэлэх
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Захиалга байхгүй байна</h3>
          <p className="text-muted-foreground mb-6">
            Та одоогоор захиалга хийгээгүй байна
          </p>
          <Link to="/products">
            <Button>Бүтээгдэхүүн үзэх</Button>
          </Link>
        </div>
      )}
    </div>
  );
}

export default OrdersPage;
