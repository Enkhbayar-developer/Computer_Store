import { Link, useParams } from "react-router-dom";
import {
  Package,
  MapPin,
  CreditCard,
  Truck,
  ChevronLeft,
  CheckCircle,
} from "lucide-react";
import { Button } from "../../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import LoadingSpinner from "../../../components/shared/LoadingSpinner";
import { useGetOrderByIdQuery } from "../ordersAPI";

function OrderDetailPage() {
  const { id } = useParams();
  const { data: order, isLoading } = useGetOrderByIdQuery(id);

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

  // Order tracking steps
  const getTrackingSteps = (currentStatus) => {
    const steps = [
      { status: "pending", label: "Захиалга хүлээн авсан", icon: Package },
      { status: "processing", label: "Боловсруулж байна", icon: CheckCircle },
      { status: "shipped", label: "Хүргэлтэнд гарсан", icon: Truck },
      { status: "delivered", label: "Хүргэгдсэн", icon: CheckCircle },
    ];

    const statusOrder = ["pending", "processing", "shipped", "delivered"];
    const currentIndex = statusOrder.indexOf(currentStatus);

    return steps.map((step, index) => ({
      ...step,
      completed: index <= currentIndex,
      active: index === currentIndex,
    }));
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">Захиалга олдсонгүй</p>
        <Link to="/orders">
          <Button>Буцах</Button>
        </Link>
      </div>
    );
  }

  const trackingSteps = getTrackingSteps(order.status);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back Button */}
      <Link to="/orders">
        <Button variant="ghost" size="sm">
          <ChevronLeft className="h-4 w-4 mr-2" />
          Захиалгууд руу буцах
        </Button>
      </Link>

      {/* Order Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Захиалгын дэлгэрэнгүй</h1>
          <p className="text-muted-foreground">
            Захиалгын дугаар:{" "}
            <span className="font-semibold">{order.orderNumber}</span>
          </p>
        </div>
        <span
          className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(
            order.status
          )}`}
        >
          {getStatusText(order.status)}
        </span>
      </div>

      {/* Order Tracking */}
      {order.status !== "cancelled" && (
        <Card>
          <CardHeader>
            <CardTitle>Хүргэлтийн явц</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              {/* Progress Line */}
              <div className="absolute top-5 left-0 right-0 h-0.5 bg-muted">
                <div
                  className="h-full bg-primary transition-all duration-500"
                  style={{
                    width: `${
                      (trackingSteps.filter((s) => s.completed).length - 1) *
                      (100 / (trackingSteps.length - 1))
                    }%`,
                  }}
                />
              </div>

              {/* Steps */}
              <div className="relative flex justify-between">
                {trackingSteps.map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <div
                      key={index}
                      className="flex flex-col items-center flex-1"
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                          step.completed
                            ? "bg-primary border-primary text-primary-foreground"
                            : "bg-background border-muted text-muted-foreground"
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <p
                        className={`mt-2 text-xs sm:text-sm text-center ${
                          step.active
                            ? "font-semibold text-foreground"
                            : "text-muted-foreground"
                        }`}
                      >
                        {step.label}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Shipping Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Хүргэлтийн мэдээлэл
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div>
              <p className="text-muted-foreground">Нэр:</p>
              <p className="font-medium">{order.shippingInfo.name}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Утас:</p>
              <p className="font-medium">{order.shippingInfo.phone}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Имэйл:</p>
              <p className="font-medium">{order.shippingInfo.email}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Хаяг:</p>
              <p className="font-medium">
                {order.shippingInfo.address}, {order.shippingInfo.district},{" "}
                {order.shippingInfo.city}
              </p>
              {order.shippingInfo.apartment && (
                <p className="text-muted-foreground text-xs mt-1">
                  {order.shippingInfo.apartment}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Payment Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Төлбөрийн мэдээлэл
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div>
              <p className="text-muted-foreground">Төлбөрийн хэлбэр:</p>
              <p className="font-medium">
                Карт (**** {order.paymentInfo.cardLast4})
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Төлбөрийн статус:</p>
              <p className="font-medium text-green-600">Төлөгдсөн</p>
            </div>
            <div>
              <p className="text-muted-foreground">Огноо:</p>
              <p className="font-medium">
                {new Date(order.createdAt).toLocaleDateString("mn-MN", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Order Items */}
      <Card>
        <CardHeader>
          <CardTitle>Захиалсан бүтээгдэхүүн</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {order.items.map((item, index) => (
              <div
                key={index}
                className="flex gap-4 pb-4 border-b last:border-0 last:pb-0"
              >
                <img
                  src={item.image || "/placeholder.png"}
                  alt={item.name}
                  className="w-20 h-20 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h4 className="font-semibold mb-1">{item.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    Тоо ширхэг: {item.quantity}
                  </p>
                  <p className="text-sm font-medium">
                    {item.price.toLocaleString()}₮
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">
                    {(item.price * item.quantity).toLocaleString()}₮
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Order Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Захиалгын дүн</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Нийт дүн:</span>
            <span className="font-medium">
              {order.subtotal.toLocaleString()}₮
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">НӨАТ (10%):</span>
            <span className="font-medium">{order.tax.toLocaleString()}₮</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Хүргэлт:</span>
            <span className="font-medium text-green-600">Үнэгүй</span>
          </div>
          <div className="flex justify-between text-lg font-bold pt-3 border-t">
            <span>Нийт:</span>
            <span className="text-primary">
              {order.total.toLocaleString()}₮
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      {order.status === "delivered" && (
        <div className="flex gap-4">
          <Button className="flex-1">Дахин захиалах</Button>
          <Button variant="outline" className="flex-1">
            Үнэлгээ өгөх
          </Button>
        </div>
      )}
    </div>
  );
}

export default OrderDetailPage;
