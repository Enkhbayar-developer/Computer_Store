import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ShoppingCart,
  Heart,
  Star,
  Minus,
  Plus,
  Truck,
  Shield,
  ChevronLeft,
} from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Card, CardContent } from "../../../components/ui/card";
import LoadingSpinner from "../../../components/shared/LoadingSpinner";
import { useGetProductByIdQuery } from "../productsAPI";
import { useCart } from "../../../hooks/useCart";
import { useAuth } from "../../../hooks/useAuth";

function ProductDetailPage() {
  const { id } = useParams();
  const { data: product, isLoading } = useGetProductByIdQuery(id);
  const { addToCart, isInCart, getItemQuantity, increase, decrease } =
    useCart();
  const { isAuthenticated } = useAuth();

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Бүтээгдэхүүн олдсонгүй</p>
        <Link to="/products">
          <Button className="mt-4">Буцах</Button>
        </Link>
      </div>
    );
  }

  const discountPercentage = product.discountPrice
    ? Math.round(
        ((product.price - product.discountPrice) / product.price) * 100
      )
    : 0;

  const handleAddToCart = () => {
    addToCart(product);
  };

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link to="/" className="hover:text-primary">
          Нүүр
        </Link>
        <span>/</span>
        <Link to="/products" className="hover:text-primary">
          Бүтээгдэхүүн
        </Link>
        <span>/</span>
        <span className="text-foreground">{product.name}</span>
      </div>

      {/* Back Button */}
      <Link to="/products">
        <Button variant="ghost" size="sm">
          <ChevronLeft className="h-4 w-4 mr-2" />
          Буцах
        </Button>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Images */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="aspect-square rounded-lg overflow-hidden bg-muted">
            <img
              src={product.images?.[selectedImage] || "/placeholder.png"}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="grid grid-cols-5 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImage === index
                      ? "border-primary"
                      : "border-transparent hover:border-muted-foreground"
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          {/* Brand & Rating */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground uppercase">
              {product.brand}
            </span>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">{product.rating || 0}</span>
              <span className="text-sm text-muted-foreground">
                ({product.reviews?.length || 0} үнэлгээ)
              </span>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold">{product.name}</h1>

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="text-4xl font-bold text-primary">
              {(product.discountPrice || product.price).toLocaleString()}₮
            </span>
            {product.discountPrice && (
              <>
                <span className="text-xl text-muted-foreground line-through">
                  {product.price.toLocaleString()}₮
                </span>
                <span className="px-2 py-1 text-sm font-semibold bg-destructive text-destructive-foreground rounded">
                  -{discountPercentage}%
                </span>
              </>
            )}
          </div>

          {/* Stock Status */}
          <div>
            {product.stock > 0 ? (
              <div className="flex items-center gap-2 text-green-600">
                <div className="h-2 w-2 rounded-full bg-green-600" />
                <span className="font-medium">
                  Нөөцөнд байгаа ({product.stock})
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-destructive">
                <div className="h-2 w-2 rounded-full bg-destructive" />
                <span className="font-medium">Дууссан</span>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="font-semibold">Тайлбар</h3>
            <p className="text-muted-foreground leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Specifications */}
          {product.specifications && (
            <div className="space-y-2">
              <h3 className="font-semibold">Техник үзүүлэлт</h3>
              <div className="space-y-2">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground capitalize">
                      {key}:
                    </span>
                    <span className="font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add to Cart */}
          <div className="space-y-4 pt-4">
            {!isInCart(product.id) ? (
              <Button
                size="lg"
                className="w-full"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Сагслах
              </Button>
            ) : (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3 border rounded-lg p-2">
                  <button
                    onClick={() => decrease(product.id)}
                    className="h-8 w-8 rounded-md hover:bg-muted transition-colors flex items-center justify-center"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="text-lg font-semibold w-12 text-center">
                    {getItemQuantity(product.id)}
                  </span>
                  <button
                    onClick={() => increase(product.id)}
                    disabled={getItemQuantity(product.id) >= product.stock}
                    className="h-8 w-8 rounded-md hover:bg-muted transition-colors flex items-center justify-center disabled:opacity-50"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <Link to="/cart" className="flex-1">
                  <Button size="lg" className="w-full">
                    Сагс үзэх
                  </Button>
                </Link>
              </div>
            )}

            {isAuthenticated && (
              <Button variant="outline" size="lg" className="w-full">
                <Heart className="h-5 w-5 mr-2" />
                Хадгалах
              </Button>
            )}
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-2 gap-4 pt-4">
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Truck className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm">Үнэгүй хүргэлт</p>
                  <p className="text-xs text-muted-foreground">
                    500,000₮-с дээш
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm">Баталгаа</p>
                  <p className="text-xs text-muted-foreground">1 жил</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailPage;
