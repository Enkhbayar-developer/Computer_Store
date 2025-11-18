import { useState } from "react";
import { User, Mail, Phone, MapPin, Save } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { useAuth } from "../../../hooks/useAuth";
import toast from "react-hot-toast";
import { updateUserProfile } from "../../../services/firebase/auth.service";

function ProfilePage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
  });

  const [errors, setErrors] = useState({});

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

    if (!formData.name.trim()) {
      newErrors.name = "Нэр оруулна уу";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Имэйл оруулна уу";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Буруу имэйл хаяг";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      toast.error("Мэдээллээ бүрэн бөглөнө үү");
      return;
    }

    setLoading(true);

    try {
      await updateUserProfile(user.uid, {
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
      });

      toast.success("Профайл амжилттай шинэчлэгдлээ");
    } catch (error) {
      console.error("Update profile error:", error);
      toast.error("Алдаа гарлаа. Дахин оролдоно уу");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Миний профайл</h1>
        <p className="text-muted-foreground">Өөрийн мэдээллээ шинэчлэх</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="lg:col-span-1">
          <CardContent className="p-6 text-center space-y-4">
            {/* Avatar */}
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
              <User className="h-12 w-12 text-primary" />
            </div>

            {/* User Info */}
            <div>
              <h3 className="font-bold text-xl">{user?.name}</h3>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>

            {/* Role Badge */}
            <div>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                {user?.role === "admin" ? "Админ" : "Хэрэглэгч"}
              </span>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div>
                <p className="text-2xl font-bold text-primary">0</p>
                <p className="text-xs text-muted-foreground">Захиалга</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">0</p>
                <p className="text-xs text-muted-foreground">Үнэлгээ</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Edit Form */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Мэдээлэл засах</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Нэр *</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Таны нэр"
                    className="pl-10"
                  />
                </div>
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name}</p>
                )}
              </div>

              {/* Email (Disabled) */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Имэйл хаяг *</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    disabled
                    className="pl-10 bg-muted cursor-not-allowed"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Имэйл хаягийг өөрчлөх боломжгүй
                </p>
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Утасны дугаар</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="99119911"
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Address */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Хаяг</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Улаанбаатар хот"
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <Button type="submit" className="w-full" disabled={loading}>
                <Save className="h-4 w-4 mr-2" />
                {loading ? "Хадгалж байна..." : "Хадгалах"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Security Section */}
      <Card>
        <CardHeader>
          <CardTitle>Нууцлал ба аюулгүй байдал</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b">
            <div>
              <p className="font-medium">Нууц үг солих</p>
              <p className="text-sm text-muted-foreground">
                Нууц үгээ тогтмол солих нь таны бүртгэлийг аюулгүй болгоно
              </p>
            </div>
            <Button variant="outline" size="sm">
              Солих
            </Button>
          </div>

          <div className="flex items-center justify-between py-3 border-b">
            <div>
              <p className="font-medium">Хоёр шаттай баталгаажуулалт</p>
              <p className="text-sm text-muted-foreground">
                Нэмэлт аюулгүй байдлын давхарга нэмэх
              </p>
            </div>
            <Button variant="outline" size="sm">
              Идэвхжүүлэх
            </Button>
          </div>

          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium">Бүртгэл устгах</p>
              <p className="text-sm text-muted-foreground">
                Бүх мэдээлэл бүрмөсөн устах болно
              </p>
            </div>
            <Button variant="destructive" size="sm">
              Устгах
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default ProfilePage;
