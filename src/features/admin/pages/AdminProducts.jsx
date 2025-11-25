import { useState } from "react";
import { Plus, Search, Edit, Trash2, Eye } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import LoadingSpinner from "../../../components/shared/LoadingSpinner";
import {
  useGetProductsQuery,
  useDeleteProductMutation,
} from "../../products/productsAPI";
import toast from "react-hot-toast";

function AdminProducts() {
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("all");

  const { data, isLoading } = useGetProductsQuery({
    category,
    sortBy: "newest",
    searchTerm,
    page: 1,
    pageSize: 50,
  });

  const [deleteProduct] = useDeleteProductMutation();

  const handleDelete = async (productId, productName) => {
    if (!window.confirm(`"${productName}" бүтээгдэхүүнийг устгах уу?`)) {
      return;
    }

    try {
      await deleteProduct(productId).unwrap();
      toast.success("Бүтээгдэхүүн амжилттай устгагдлаа");
    } catch (error) {
      console.error("Delete product error:", error);
      toast.error("Устгахад алдаа гарлаа");
    }
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  const products = data?.products || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Бүтээгдэхүүн удирдах</h1>
          <p className="text-muted-foreground">
            {products.length} бүтээгдэхүүн
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Шинэ бүтээгдэхүүн
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Бүтээгдэхүүн хайх..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category Filter */}
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="h-10 px-3 rounded-lg border border-input bg-background text-sm"
            >
              <option value="all">Бүх ангилал</option>
              <option value="laptop">Зөөврийн компьютер</option>
              <option value="desktop">Суурин компьютер</option>
              <option value="monitor">Монитор</option>
              <option value="accessories">Дагалдах хэрэгсэл</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>Бүтээгдэхүүний жагсаалт</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold text-sm">
                    Зураг
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">
                    Нэр
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">
                    Ангилал
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">
                    Үнэ
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">
                    Нөөц
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">
                    Статус
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-sm">
                    Үйлдэл
                  </th>
                </tr>
              </thead>
              <tbody>
                {products.length > 0 ? (
                  products.map((product) => (
                    <tr key={product.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4">
                        <img
                          src={product.images?.[0] || "/placeholder.png"}
                          alt={product.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-medium line-clamp-2 max-w-xs">
                          {product.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {product.brand}
                        </p>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm capitalize">
                          {product.category}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-semibold">
                            {(
                              product.discountPrice || product.price
                            ).toLocaleString()}
                            ₮
                          </p>
                          {product.discountPrice && (
                            <p className="text-xs text-muted-foreground line-through">
                              {product.price.toLocaleString()}₮
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`text-sm font-medium ${
                            product.stock === 0
                              ? "text-destructive"
                              : product.stock <= 10
                              ? "text-yellow-600"
                              : "text-green-600"
                          }`}
                        >
                          {product.stock}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            product.stock > 0
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {product.stock > 0 ? "Нөөцтэй" : "Дууссан"}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              handleDelete(product.id, product.name)
                            }
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="7"
                      className="py-12 text-center text-muted-foreground"
                    >
                      Бүтээгдэхүүн олдсонгүй
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default AdminProducts;
