import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import ProductCard from "../components/ProductCard";
import LoadingSpinner from "../../../components/shared/LoadingSpinner";
import { useGetProductsQuery } from "../productsAPI";
import { SORT_OPTIONS, PRODUCT_CATEGORIES } from "../../../utils/constants";

function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Query params авах
  const category = searchParams.get("category") || "all";
  const sortBy = searchParams.get("sort") || "newest";
  const page = parseInt(searchParams.get("page") || "1");

  // Products авах
  const { data, isLoading } = useGetProductsQuery({
    category,
    sortBy,
    searchTerm,
    page,
    pageSize: 12,
  });

  const handleCategoryChange = (newCategory) => {
    setSearchParams({ category: newCategory, sort: sortBy, page: "1" });
  };

  const handleSortChange = (newSort) => {
    setSearchParams({ category, sort: newSort, page: page.toString() });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchParams({ category, sort: sortBy, page: "1" });
  };

  const handlePageChange = (newPage) => {
    setSearchParams({ category, sort: sortBy, page: newPage.toString() });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Бүтээгдэхүүн</h1>
          <p className="text-muted-foreground">
            {data?.totalCount || 0} бүтээгдэхүүн олдлоо
          </p>
        </div>

        {/* Mobile Filter Toggle */}
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="lg:hidden"
        >
          <SlidersHorizontal className="h-4 w-4 mr-2" />
          Шүүлтүүр
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar - Filters */}
        <aside
          className={`lg:w-64 space-y-6 ${
            showFilters ? "block" : "hidden lg:block"
          }`}
        >
          {/* Search */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Хайх</label>
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Бүтээгдэхүүн хайх..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </form>
          </div>

          {/* Categories */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Ангилал</label>
            <div className="space-y-1">
              <button
                onClick={() => handleCategoryChange("all")}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  category === "all"
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                }`}
              >
                Бүгд
              </button>
              <button
                onClick={() => handleCategoryChange("laptop")}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  category === "laptop"
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                }`}
              >
                Зөөврийн компьютер
              </button>
              <button
                onClick={() => handleCategoryChange("desktop")}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  category === "desktop"
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                }`}
              >
                Суурин компьютер
              </button>
              <button
                onClick={() => handleCategoryChange("monitor")}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  category === "monitor"
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                }`}
              >
                Монитор
              </button>
              <button
                onClick={() => handleCategoryChange("accessories")}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  category === "accessories"
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                }`}
              >
                Дагалдах хэрэгсэл
              </button>
            </div>
          </div>

          {/* Sort */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Эрэмбэлэх</label>
            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm"
            >
              <option value="newest">Шинэ эхэндээ</option>
              <option value="price_asc">Үнэ: Багаас их</option>
              <option value="price_desc">Үнэ: Ихээс бага</option>
              <option value="name_asc">Нэр: А-Я</option>
              <option value="rating">Үнэлгээ</option>
              <option value="popular">Алдартай</option>
            </select>
          </div>
        </aside>

        {/* Products Grid */}
        <div className="flex-1">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : data?.products && data.products.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {data.totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-8">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                  >
                    Өмнөх
                  </Button>

                  <div className="flex gap-1">
                    {Array.from(
                      { length: data.totalPages },
                      (_, i) => i + 1
                    ).map((pageNum) => (
                      <Button
                        key={pageNum}
                        variant={page === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(pageNum)}
                      >
                        {pageNum}
                      </Button>
                    ))}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === data.totalPages}
                  >
                    Дараах
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Бүтээгдэхүүн олдсонгүй</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductsPage;
