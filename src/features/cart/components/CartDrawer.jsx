import { Link } from "react-router-dom";
import { X, ShoppingBag, Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { useCart } from "../../../hooks/useCart";

function CartDrawer({ isOpen, onClose }) {
  const { items, count, subtotal, tax, total, increase, decrease, removeItem } =
    useCart();

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-background shadow-xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            <h2 className="text-lg font-semibold">Сагс ({count})</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Сагс хоосон байна</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Бүтээгдэхүүн нэмж эхлээрэй
              </p>
              <Button onClick={onClose} asChild>
                <Link to="/products">Бүтээгдэхүүн үзэх</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-3 rounded-lg border bg-card"
                >
                  {/* Image */}
                  <div className="w-20 h-20 rounded-md overflow-hidden bg-muted flex-shrink-0">
                    <img
                      src={item.image || "/placeholder.png"}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium line-clamp-2 text-sm mb-1">
                      {item.name}
                    </h3>
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="font-semibold text-primary">
                        {item.price.toLocaleString()}₮
                      </span>
                      {item.originalPrice !== item.price && (
                        <span className="text-xs text-muted-foreground line-through">
                          {item.originalPrice.toLocaleString()}₮
                        </span>
                      )}
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => decrease(item.id)}
                          className="h-7 w-7 rounded-md border flex items-center justify-center hover:bg-muted transition-colors"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="text-sm font-medium w-8 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => increase(item.id)}
                          disabled={item.quantity >= item.stock}
                          className="h-7 w-7 rounded-md border flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-2 text-destructive hover:bg-destructive/10 rounded-md transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Stock warning */}
                    {item.quantity >= item.stock && (
                      <p className="text-xs text-destructive mt-1">
                        Хамгийн их тоо ширхэг
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer - Summary & Checkout */}
        {items.length > 0 && (
          <div className="border-t p-4 space-y-4">
            {/* Summary */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Нийт дүн:</span>
                <span className="font-medium">
                  {subtotal.toLocaleString()}₮
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">НӨАТ (10%):</span>
                <span className="font-medium">{tax.toLocaleString()}₮</span>
              </div>
              <div className="flex justify-between text-lg font-semibold pt-2 border-t">
                <span>Төлөх дүн:</span>
                <span className="text-primary">{total.toLocaleString()}₮</span>
              </div>
            </div>

            {/* Buttons */}
            <div className="space-y-2">
              <Button asChild className="w-full" size="lg">
                <Link to="/checkout" onClick={onClose}>
                  Төлбөр төлөх
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="w-full"
                onClick={onClose}
              >
                <Link to="/cart">Сагс үзэх</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default CartDrawer;
