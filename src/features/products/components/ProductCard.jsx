import { Link } from "react-router-dom";
import { ShoppingCart, Heart, Star } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardFooter } from "../../../components/ui/card";
import { useCart } from "../../../hooks/useCart";
import { useAuth } from "../../../hooks/useAuth";

function ProductCard({ product }) {
  const { addToCart, isInCart } = useCart();
  const { isAuthenticated } = useAuth();

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product);
  };

  const discountPercentage = product.discountPrice
    ? Math.round(
        ((product.price - product.discountPrice) / product.price) * 100
      )
    : 0;

  return (
    <Link to={`/products/${product.id}`}>
      <Card className="group overflow-hidden hover:shadow-lg transition-shadow duration-300">
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-muted">
          <img
            src={product.images?.[0] || "/placeholder.png"}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-2">
            {product.stock === 0 && (
              <span className="px-2 py-1 text-xs font-semibold bg-destructive text-destructive-foreground rounded">
                Дууссан
              </span>
            )}
            {discountPercentage > 0 && (
              <span className="px-2 py-1 text-xs font-semibold bg-destructive text-destructive-foreground rounded">
                -{discountPercentage}%
              </span>
            )}
            {product.featured && (
              <span className="px-2 py-1 text-xs font-semibold bg-primary text-primary-foreground rounded">
                Онцлох
              </span>
            )}
          </div>

          {/* Wishlist Button */}
          {isAuthenticated && (
            <button
              onClick={(e) => {
                e.preventDefault();
                // Add to wishlist logic
              }}
              className="absolute top-2 right-2 p-2 bg-background/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Heart className="h-4 w-4" />
            </button>
          )}

          {/* Quick View (optional) */}
          <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              size="sm"
              variant="secondary"
              className="w-full"
              onClick={handleAddToCart}
              disabled={product.stock === 0 || isInCart(product.id)}
            >
              {isInCart(product.id) ? (
                "Сагсанд байна"
              ) : (
                <>
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Сагслах
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Content */}
        <CardContent className="p-4 space-y-2">
          {/* Brand */}
          <p className="text-xs text-muted-foreground uppercase">
            {product.brand}
          </p>

          {/* Name */}
          <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{product.rating || 0}</span>
            <span className="text-xs text-muted-foreground">
              ({product.reviews?.length || 0})
            </span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-primary">
              {(product.discountPrice || product.price).toLocaleString()}₮
            </span>
            {product.discountPrice && (
              <span className="text-sm text-muted-foreground line-through">
                {product.price.toLocaleString()}₮
              </span>
            )}
          </div>

          {/* Stock Status */}
          {product.stock > 0 && product.stock <= 10 && (
            <p className="text-xs text-destructive">
              Үлдэгдэл: {product.stock} ширхэг
            </p>
          )}
        </CardContent>

        {/* Footer - Add to Cart Button (Mobile) */}
        <CardFooter className="p-4 pt-0 md:hidden">
          <Button
            size="sm"
            className="w-full"
            onClick={handleAddToCart}
            disabled={product.stock === 0 || isInCart(product.id)}
          >
            {isInCart(product.id) ? (
              "Сагсанд байна"
            ) : (
              <>
                <ShoppingCart className="h-4 w-4 mr-2" />
                Сагслах
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}

export default ProductCard;
