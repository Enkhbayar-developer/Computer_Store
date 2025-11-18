import { Link } from "react-router-dom";
import {
  ArrowRight,
  Truck,
  Shield,
  Headphones,
  TrendingUp,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import ProductCard from "../features/products/components/ProductCard";
import { useGetFeaturedProductsQuery } from "../features/products/productsAPI";
import LoadingSpinner from "../components/shared/LoadingSpinner";

function HomePage() {
  const { data: featuredProducts, isLoading } = useGetFeaturedProductsQuery();

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-8 md:p-12 lg:p-16">
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            Компьютерийн дэлхий таны гарт
          </h1>
          <p className="text-lg md:text-xl mb-8 text-primary-foreground/90">
            Хамгийн сайн үнээр, өндөр чанарын компьютер болон дагалдах хэрэгсэл
          </p>
          <div className="flex flex-wrap gap-4">
            <Button asChild size="lg" variant="secondary">
              <Link to="/products">
                Бүтээгдэхүүн үзэх
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10"
            >
              <Link to="/deals">Хямдрал үзэх</Link>
            </Button>
          </div>
        </div>

        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-foreground/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-primary-foreground/10 rounded-full translate-y-1/2" />
      </section>

      {/* Features */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Truck className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Үнэгүй хүргэлт</h3>
            <p className="text-sm text-muted-foreground">
              500,000₮-с дээш захиалгад
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Баталгаат</h3>
            <p className="text-sm text-muted-foreground">
              1 жилийн албан ёсны баталгаа
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Headphones className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">24/7 Тусламж</h3>
            <p className="text-sm text-muted-foreground">
              Өдрийн 24 цаг дэмжлэг үзүүлнэ
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Шилдэг үнэ</h3>
            <p className="text-sm text-muted-foreground">
              Зах зээлийн хамгийн сайн үнэ
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Featured Products */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">Онцлох бүтээгдэхүүн</h2>
            <p className="text-muted-foreground">
              Хамгийн их борлуулалттай бүтээгдэхүүнүүд
            </p>
          </div>
          <Button asChild variant="outline">
            <Link to="/products">
              Бүгдийг үзэх
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : featuredProducts && featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              Одоогоор онцлох бүтээгдэхүүн байхгүй байна
            </p>
          </div>
        )}
      </section>

      {/* Categories Banner */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link to="/products?category=laptop">
          <Card className="overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow">
            <div className="relative h-64 bg-gradient-to-br from-blue-500 to-blue-600">
              <CardContent className="p-8 h-full flex flex-col justify-end text-white relative z-10">
                <h3 className="text-2xl font-bold mb-2">Зөөврийн компьютер</h3>
                <p className="text-white/90 mb-4">Дээд зэргийн гүйцэтгэлтэй</p>
                <Button variant="secondary" size="sm" className="w-fit">
                  Үзэх <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>
          </Card>
        </Link>

        <Link to="/products?category=accessories">
          <Card className="overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow">
            <div className="relative h-64 bg-gradient-to-br from-purple-500 to-purple-600">
              <CardContent className="p-8 h-full flex flex-col justify-end text-white relative z-10">
                <h3 className="text-2xl font-bold mb-2">Дагалдах хэрэгсэл</h3>
                <p className="text-white/90 mb-4">Чанартай, найдвартай</p>
                <Button variant="secondary" size="sm" className="w-fit">
                  Үзэх <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>
          </Card>
        </Link>
      </section>

      {/* Newsletter */}
      <section className="rounded-2xl bg-muted p-8 md:p-12 text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">
          Хямдрал, шинэ бүтээгдэхүүний мэдээлэл авах уу?
        </h2>
        <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
          Манай имэйл жагсаалтад элсэж, хамгийн сүүлийн үеийн мэдээлэл, онцгой
          санал авна уу
        </p>
        <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
          <input
            type="email"
            placeholder="Имэйл хаягаа оруулна уу"
            className="flex-1 h-12 px-4 rounded-lg border border-input bg-background"
          />
          <Button size="lg" className="sm:w-auto">
            Бүртгүүлэх
          </Button>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
