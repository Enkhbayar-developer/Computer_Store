import { useState } from "react";
import { Search, Eye } from "lucide-react";
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
  useGetAllOrdersQuery,
  useUpdateOrderStatusMutation,
} from "../../orders/ordersAPI";
import toast from "react-hot-toast";

function AdminOrders() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: orders, isLoading } = useGetAllOrdersQuery();
  const [updateOrderStatus] = useUpdateOrderStatusMutation();

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus({ orderId, status: newStatus }).unwrap();
      toast.success("Статус амжилттай шинэчлэгдлээ");
    } catch (error) {
      console.error("Update status error:", error);
      toast.error("Алдаа гарлаа");
    }
  };

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

  // Filter orders (safe guards for missing fields)
  const filteredOrders = orders?.filter((order) => {
    const term = (searchTerm || "").toLowerCase();
    const orderNumber = (order.orderNumber || "").toLowerCase();
    const shippingName = (order.shippingInfo?.name || "").toLowerCase();
    const matchesSearch =
      orderNumber.includes(term) || shippingName.includes(term);
    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Захиалга удирдах</h1>
        <p className="text-muted-foreground">
          {filteredOrders?.length || 0} захиалга
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Захиалга хайх..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-10 px-3 rounded-lg border border-input bg-background text-sm"
            >
              <option value="all">Бүх статус</option>
              <option value="pending">Хүлээгдэж байна</option>
              <option value="processing">Боловсруулж байна</option>
              <option value="shipped">Хүргэгдэж байна</option>
              <option value="delivered">Хүргэгдсэн</option>
              <option value="cancelled">Цуцлагдсан</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Захиалгын жагсаалт</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold text-sm">
                    Захиалгын дугаар
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">
                    Хэрэглэгч
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">
                    Огноо
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">
                    Дүн
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">
                    Статус
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">
                    Статус өөрчлөх
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-sm">
                    Үйлдэл
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders && filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => (
                    <tr key={order.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4">
                        <p className="font-medium">{order.orderNumber}</p>
                        <p className="text-xs text-muted-foreground">
                          {order.items.length} бараа
                        </p>
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-medium">{order.shippingInfo.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {order.shippingInfo.phone}
                        </p>
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-sm">
                          {new Date(order.createdAt).toLocaleDateString(
                            "mn-MN",
                            {
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(order.createdAt).toLocaleTimeString(
                            "mn-MN",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </p>
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-semibold">
                          {order.total.toLocaleString()}₮
                        </p>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {getStatusText(order.status)}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <select
                          value={order.status}
                          onChange={(e) =>
                            handleStatusChange(order.id, e.target.value)
                          }
                          className="text-sm px-2 py-1 rounded-lg border border-input bg-background"
                        >
                          <option value="pending">Хүлээгдэж байна</option>
                          <option value="processing">Боловсруулж байна</option>
                          <option value="shipped">Хүргэгдэж байна</option>
                          <option value="delivered">Хүргэгдсэн</option>
                          <option value="cancelled">Цуцлах</option>
                        </select>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end">
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
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
                      Захиалга олдсонгүй
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

export default AdminOrders;
