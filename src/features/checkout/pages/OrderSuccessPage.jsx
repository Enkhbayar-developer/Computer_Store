import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { CheckCircle, Package, Home, FileText } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Card, CardContent } from "../../../components/ui/card";
import LoadingSpinner from "../../../components/shared/LoadingSpinner";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../services/firebase/config";
import { COLLECTIONS } from "../../../utils/constants";

function OrderSuccessPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const orderDoc = await getDoc(doc(db, COLLECTIONS.ORDERS, orderId));
        if (orderDoc.exists()) {
          setOrder({ id: orderDoc.id, ...orderDoc.data() });
        }
      } catch (error) {
        console.error("Fetch order error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">Захиалга олдсонгүй</p>
        <Link to="/orders">
          <Button>Захиалгууд үзэх</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Success Icon */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 text-green-600 mb-4">
          <CheckCircle className="h-12 w-12" />
        </div>
        <h1 className="text-3xl font-bold">Захиалга амжилттай!</h1>
        <p className="text-muted-foreground">
          Таны захиалга амжилттай баталгаажлаа. Имэйл хаягруу баталгаажуулах
          мэдээлэл илгээлээ.
        </p>
      </div>

      {/* Order Details */}
      <Card>
        <CardContent className="p-6 space-y-6">
          {/* Order Number */}
          <div className="flex items-center justify-between pb-4 border-b">
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                Захиалгын дугаар
              </p>
              <p className="text-2xl font-bold">{order.orderNumber}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground mb-1">Огноо</p>
              <p className="font-medium">
                {new Date(order.createdAt).toLocaleDateString("mn-MN")}
              </p>
            </div>
          </div>

          {/* Shipping Info */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Package className="h-5 w-5" />
              Хүргэлтийн мэдээлэл
            </h3>
            <div className="space-y-1 text-sm">
              <p>
                <strong>Нэр:</strong> {order.shippingInfo.name}
              </p>
              <p>
                <strong>Утас:</strong> {order.shippingInfo.phone}
              </p>
              <p>
                <strong>Хаяг:</strong> {order.shippingInfo.address},{" "}
                {order.shippingInfo.district}, {order.shippingInfo.city}
              </p>
              {order.shippingInfo.apartment && (
                <p>
                  <strong>Орц:</strong> {order.shippingInfo.apartment}
                </p>
              )}
            </div>
          </div>

          {/* Order Items */}
          <div>
            <h3 className="font-semibold mb-3">Захиалсан бүтээгдэхүүн</h3>
            <div className="space-y-3">
              {order.items.map((item, index) => (
                <div key={index} className="flex gap-3">
                  <img
                    src={item.image || "/placeholder.png"}
                    alt={item.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.quantity} × {item.price.toLocaleString()}₮
                    </p>
                  </div>
                  <p className="font-semibold">
                    {(item.price * item.quantity).toLocaleString()}₮
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-2 pt-4 border-t">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Нийт дүн:</span>
              <span>{order.subtotal.toLocaleString()}₮</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">НӨАТ:</span>
              <span>{order.tax.toLocaleString()}₮</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Хүргэлт:</span>
              <span className="text-green-600">Үнэгүй</span>
            </div>
            <div className="flex justify-between text-lg font-bold pt-2 border-t">
              <span>Төлсөн дүн:</span>
              <span className="text-primary">
                {order.total.toLocaleString()}₮
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button asChild size="lg" className="flex-1">
          <Link to="/orders">
            <FileText className="h-5 w-5 mr-2" />
            Захиалгууд үзэх
          </Link>
        </Button>
        <Button asChild size="lg" variant="outline" className="flex-1">
          <Link to="/">
            <Home className="h-5 w-5 mr-2" />
            Нүүр хуудас
          </Link>
        </Button>
      </div>

      {/* Additional Info */}
      <Card className="bg-muted/50">
        <CardContent className="p-6">
          <h3 className="font-semibold mb-2">Дараагийн алхамууд</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>✓ Таны захиалгыг боловсруулж эхэллээ</li>
            <li>✓ Бэлтгэл болсон үед SMS болон имэйлээр мэдэгдэх болно</li>
            <li>✓ Хүргэлт 2-3 хоногийн дотор хийгдэнэ</li>
            <li>✓ Асуудал гарвал 7000-0000 утсаар холбогдоно уу</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

export default OrderSuccessPage;
