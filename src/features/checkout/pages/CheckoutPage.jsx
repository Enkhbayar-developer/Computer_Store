import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CreditCard, MapPin, User, Phone, Mail } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { useCart } from "../../../hooks/useCart";
import { useAuth } from "../../../hooks/useAuth";
import toast from "react-hot-toast";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../../services/firebase/config";
import { COLLECTIONS } from "../../../utils/constants";

function CheckoutPage() {
  const navigate = useNavigate();
  const { items, total, clearAllItems } = useCart();
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    // Shipping Info
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
    city: "Улаанбаатар",
    district: "",
    apartment: "",

    // Payment Info
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
  });

  const [errors, setErrors] = useState({});

  if (items.length === 0) {
    navigate("/cart");
    return null;
  }

  // Ensure user is present (if not, redirect to login)
  if (!user) {
    navigate("/login");
    return null;
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: "",
      });
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Нэр оруулна уу";
    if (!formData.email.trim()) newErrors.email = "Имэйл оруулна уу";
    if (!formData.phone.trim()) newErrors.phone = "Утас оруулна уу";
    if (!formData.address.trim()) newErrors.address = "Хаяг оруулна уу";
    if (!formData.district.trim()) newErrors.district = "Дүүрэг сонгоно уу";

    if (!formData.cardNumber.trim())
      newErrors.cardNumber = "Картын дугаар оруулна уу";
    if (!formData.cardName.trim()) newErrors.cardName = "Картын нэр оруулна уу";
    if (!formData.expiryDate.trim())
      newErrors.expiryDate = "Дуусах хугацаа оруулна уу";
    if (!formData.cvv.trim()) newErrors.cvv = "CVV оруулна уу";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const generateOrderNumber = () => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `ORD-${timestamp}-${random}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      toast.error("Мэдээллээ бүрэн бөглөнө үү");
      return;
    }

    setLoading(true);

    try {
      // Order үүсгэх
      const orderData = {
        orderNumber: generateOrderNumber(),
        userId: user.uid,
        userEmail: user.email,

        // Shipping Info
        shippingInfo: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          district: formData.district,
          apartment: formData.apartment,
        },

        // Order Items
        items: items.map((item) => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),

        // Pricing
        subtotal: items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        ),
        tax:
          total -
          items.reduce((sum, item) => sum + item.price * item.quantity, 0),
        total: total,

        // Payment Info (Бодит төсөлд encrypt хийх ёстой)
        paymentInfo: {
          method: "card",
          cardLast4: formData.cardNumber.slice(-4),
        },

        // Status
        status: "pending",
        paymentStatus: "completed",

        // Timestamps
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Firestore-д хадгалах
      const orderRef = await addDoc(
        collection(db, COLLECTIONS.ORDERS),
        orderData
      );

      // Сагс цэвэрлэх
      clearAllItems();

      // Success page руу шилжих
      toast.success("Захиалга амжилттай баталгаажлаа!");
      navigate(`/order-success/${orderRef.id}`);
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Алдаа гарлаа. Дахин оролдоно уу");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Төлбөр төлөх</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Side - Forms */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Хүргэлтийн мэдээлэл
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Нэр *</label>
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Таны нэр"
                    />
                    {errors.name && (
                      <p className="text-sm text-destructive">{errors.name}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Утас *</label>
                    <Input
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="99119911"
                    />
                    {errors.phone && (
                      <p className="text-sm text-destructive">{errors.phone}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Имэйл *</label>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="email@example.com"
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Хот *</label>
                    <Input
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="Улаанбаатар"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Дүүрэг *</label>
                    <select
                      name="district"
                      value={formData.district}
                      onChange={handleChange}
                      className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm"
                    >
                      <option value="">Сонгох</option>
                      <option value="Баянгол">Баянгол</option>
                      <option value="Баянзүрх">Баянзүрх</option>
                      <option value="Сүхбаатар">Сүхбаатар</option>
                      <option value="Чингэлтэй">Чингэлтэй</option>
                      <option value="Хан-Уул">Хан-Уул</option>
                      <option value="Сонгинохайрхан">Сонгинохайрхан</option>
                    </select>
                    {errors.district && (
                      <p className="text-sm text-destructive">
                        {errors.district}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Дэлгэрэнгүй хаяг *
                  </label>
                  <Input
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Гудамж, байр, тоот"
                  />
                  {errors.address && (
                    <p className="text-sm text-destructive">{errors.address}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Орц, давхар (Заавал биш)
                  </label>
                  <Input
                    name="apartment"
                    value={formData.apartment}
                    onChange={handleChange}
                    placeholder="Орц 2, Давхар 5, Тоот 12"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Payment Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Төлбөрийн мэдээлэл
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Картын дугаар *</label>
                  <Input
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleChange}
                    placeholder="1234 5678 9012 3456"
                    maxLength="19"
                  />
                  {errors.cardNumber && (
                    <p className="text-sm text-destructive">
                      {errors.cardNumber}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Картын нэр *</label>
                  <Input
                    name="cardName"
                    value={formData.cardName}
                    onChange={handleChange}
                    placeholder="JOHN DOE"
                  />
                  {errors.cardName && (
                    <p className="text-sm text-destructive">
                      {errors.cardName}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Дуусах хугацаа *
                    </label>
                    <Input
                      name="expiryDate"
                      value={formData.expiryDate}
                      onChange={handleChange}
                      placeholder="MM/YY"
                      maxLength="5"
                    />
                    {errors.expiryDate && (
                      <p className="text-sm text-destructive">
                        {errors.expiryDate}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">CVV *</label>
                    <Input
                      name="cvv"
                      value={formData.cvv}
                      onChange={handleChange}
                      placeholder="123"
                      maxLength="3"
                      type="password"
                    />
                    {errors.cvv && (
                      <p className="text-sm text-destructive">{errors.cvv}</p>
                    )}
                  </div>
                </div>

                <div className="p-4 bg-muted rounded-lg text-sm text-muted-foreground">
                  🔒 Таны төлбөрийн мэдээлэл найдвартай шифрлэгдсэн
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Side - Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Захиалгын дүн</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Items */}
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <img
                        src={item.image || "/placeholder.png"}
                        alt={item.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium line-clamp-2">
                          {item.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {item.quantity} × {item.price.toLocaleString()}₮
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Нийт дүн:</span>
                    <span>
                      {items
                        .reduce(
                          (sum, item) => sum + item.price * item.quantity,
                          0
                        )
                        .toLocaleString()}
                      ₮
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">НӨАТ:</span>
                    <span>
                      {(
                        total -
                        items.reduce(
                          (sum, item) => sum + item.price * item.quantity,
                          0
                        )
                      ).toLocaleString()}
                      ₮
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Хүргэлт:</span>
                    <span className="text-green-600">Үнэгүй</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-2 border-t">
                    <span>Төлөх дүн:</span>
                    <span className="text-primary">
                      {total.toLocaleString()}₮
                    </span>
                  </div>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? "Түр хүлээнэ үү..." : "Төлбөр төлөх"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}

export default CheckoutPage;
