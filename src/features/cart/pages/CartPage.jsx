import { Link } from "react-router-dom";
import { ShoppingBag, Trash2, Minus, Plus, ArrowRight } from "lucide-react";
import { Button } from "../../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { useCart } from "../../../hooks/useCart";

function CartPage() {
  const {
    items,
    count,
    subtotal,
    tax,
    total,
    increase,
    decrease,
    changeQuantity,
    removeItem,
    clearAllItems,
  } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-4">
          <ShoppingBag className="h-24 w-24 text-muted-foreground mx-auto" />
          <h2 className="text-2xl font-bold">Сагс хоосон байна</h2>
          <p className="text-muted-foreground">Бүтээгдэхүүн нэмж эхлээрэй</p>
          <Button asChild size="lg">
            <Link to="/products">
              Бүтээгдэхүүн үзэх
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Сагс</h1>
          <p className="text-muted-foreground">{count} бүтээгдэхүүн</p>
        </div>
        <Button variant="destructive" size="sm" onClick={clearAllItems}>
          <Trash2 className="h-4 w-4 mr-2" />
          Бүгдийг устгах
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-4">
                <div className="flex gap-4">
                  {/* Image */}
                  <Link
                    to={`/products/${item.id}`}
                    className="w-24 h-24 rounded-lg overflow-hidden bg-muted flex-shrink-0"
                  >
                    <img
                      src={item.image || "/placeholder.png"}
                      alt={item.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform"
                    />
                  </Link>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-2">
                      <Link
                        to={`/products/${item.id}`}
                        className="font-semibold hover:text-primary line-clamp-2"
                      >
                        {item.name}
                      </Link>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors flex-shrink-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="flex items-baseline gap-2 mb-3">
                      <span className="text-lg font-bold text-primary">
                        {item.price.toLocaleString()}₮
                      </span>
                      {item.originalPrice !== item.price && (
                        <span className="text-sm text-muted-foreground line-through">
                          {item.originalPrice.toLocaleString()}₮
                        </span>
                      )}
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 border rounded-lg p-1">
                        <button
                          onClick={() => decrease(item.id)}
                          className="h-8 w-8 rounded-md hover:bg-muted transition-colors flex items-center justify-center"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <Input
                          type="number"
                          min="1"
                          max={item.stock}
                          value={item.quantity}
                          onChange={(e) => {
                            const value = parseInt(e.target.value);
                            if (!isNaN(value)) {
                              changeQuantity(item.id, value);
                            }
                          }}
                          className="h-8 w-16 text-center border-0 focus-visible:ring-0 p-0"
                        />
                        <button
                          onClick={() => increase(item.id)}
                          disabled={item.quantity >= item.stock}
                          className="h-8 w-8 rounded-md hover:bg-muted transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>

                      <span className="font-semibold">
                        {(item.price * item.quantity).toLocaleString()}₮
                      </span>
                    </div>

                    {/* Stock Warning */}
                    {item.quantity >= item.stock && (
                      <p className="text-xs text-destructive mt-2">
                        Нөөцөнд байгаа хамгийн их тоо ширхэг
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Захиалгын дүн</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Summary Details */}
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Нийт дүн ({count} бараа):
                  </span>
                  <span className="font-medium">
                    {subtotal.toLocaleString()}₮
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">НӨАТ (10%):</span>
                  <span className="font-medium">{tax.toLocaleString()}₮</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Хүргэлт:</span>
                  <span className="font-medium text-green-600">Үнэгүй</span>
                </div>
                <div className="border-t pt-3 flex justify-between text-lg font-bold">
                  <span>Төлөх дүн:</span>
                  <span className="text-primary">
                    {total.toLocaleString()}₮
                  </span>
                </div>
              </div>

              {/* Promo Code */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Промо код</label>
                <div className="flex gap-2">
                  <Input placeholder="Код оруулах" />
                  <Button variant="outline">Хэрэглэх</Button>
                </div>
              </div>

              {/* Checkout Button */}
              <Button asChild size="lg" className="w-full">
                <Link to="/checkout">
                  Төлбөр төлөх
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>

              {/* Continue Shopping */}
              <Button asChild variant="outline" className="w-full">
                <Link to="/products">Үргэлжлүүлэх</Link>
              </Button>

              {/* Info */}
              <div className="pt-4 border-t space-y-2 text-sm text-muted-foreground">
                <p className="flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-primary" />
                  Аюулгүй төлбөр
                </p>
                <p className="flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-primary" />
                  500,000₮-с дээш үнэгүй хүргэлт
                </p>
                <p className="flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-primary" />
                  14 хоногийн буцаалт
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default CartPage;
