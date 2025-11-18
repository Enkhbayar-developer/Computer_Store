import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Card, CardContent } from "../../../components/ui/card";
import LoadingSpinner from "../../../components/shared/LoadingSpinner";
import { useWishlist } from "../../../hooks/useWishlist";
import { useCart } from "../../../hooks/useCart";
import { useGetProductsQuery } from "../../../features/products/productsAPI";

function WishlistPage() {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart, isInCart } = useCart();

  // Бүх бүтээгдэхүүн авах
  const { data: productsData, isLoading } = useGetProductsQuery({
    category: "all",
    sortBy: "newest",
    searchTerm: "",
    page: 1,
    pageSize: 100,
  });

  // Wishlist-ийн бүтээгдэхүүнүүдийг filter хийх
  const wishlistProducts = useMemo(() => {
    if (!productsData?.products || !wishlist.length) return [];
    return productsData.products.filter((product) =>
      wishlist.includes(product.id)
    );
  }, [productsData, wishlist]);

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  const handleRemoveFromWishlist = (productId) => {
    removeFromWishlist(productId);
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Миний wishlist</h1>
        <p className="text-muted-foreground">
          {wishlistProducts.length} бүтээгдэхүүн
        </p>
      </div>

      {/* Wishlist Items */}
      {wishlistProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistProducts.map((product) => (
            <Card
              key={product.id}
              className="group overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Image */}
              <Link to={`/products/${product.id}`}>
                <div className="relative aspect-square overflow-hidden bg-muted">
                  <img
                    src={product.images?.[0] || "/placeholder.png"}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* Remove Button */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleRemoveFromWishlist(product.id);
                    }}
                    className="absolute top-2 right-2 p-2 bg-background/80 rounded-full hover:bg-destructive hover:text-destructive-foreground transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>

                  {/* Badges */}
                  <div className="absolute top-2 left-2 flex flex-col gap-2">
                    {product.stock === 0 && (
                      <span className="px-2 py-1 text-xs font-semibold bg-destructive text-destructive-foreground rounded">
                        Дууссан
                      </span>
                    )}
                    {product.discountPrice && (
                      <span className="px-2 py-1 text-xs font-semibold bg-destructive text-destructive-foreground rounded">
                        -
                        {Math.round(
                          ((product.price - product.discountPrice) /
                            product.price) *
                            100
                        )}
                        %
                      </span>
                    )}
                  </div>
                </div>
              </Link>

              {/* Content */}
              <CardContent className="p-4 space-y-3">
                <Link to={`/products/${product.id}`}>
                  <h3 className="font-semibold line-clamp-2 hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                </Link>

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

                {/* Add to Cart Button */}
                <Button
                  size="sm"
                  className="w-full"
                  onClick={() => handleAddToCart(product)}
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
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Wishlist хоосон байна</h3>
          <p className="text-muted-foreground mb-6">
            Таалагдсан бүтээгдэхүүнээ wishlist-д нэмээрэй
          </p>
          <Link to="/products">
            <Button>Бүтээгдэхүүн үзэх</Button>
          </Link>
        </div>
      )}

      {/* Actions */}
      {wishlistProducts.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => {
              wishlistProducts.forEach((product) => {
                if (product.stock > 0 && !isInCart(product.id)) {
                  addToCart(product);
                }
              });
            }}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Бүгдийг сагслах
          </Button>
          <Button
            variant="destructive"
            className="flex-1"
            onClick={() => {
              wishlistProducts.forEach((product) => {
                removeFromWishlist(product.id);
              });
            }}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Бүгдийг устгах
          </Button>
        </div>
      )}
    </div>
  );
}

export default WishlistPage;
