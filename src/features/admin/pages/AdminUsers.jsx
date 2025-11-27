import { useState, useEffect } from "react";
import { Search, Shield, UserX } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import LoadingSpinner from "../../../components/shared/LoadingSpinner";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "../../../services/firebase/config";
import { COLLECTIONS } from "../../../utils/constants";
import toast from "react-hot-toast";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersSnapshot = await getDocs(collection(db, COLLECTIONS.USERS));
        const usersData = usersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(usersData);
      } catch (error) {
        console.error("Fetch users error:", error);
        toast.error("Хэрэглэгчид татахад алдаа гарлаа");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Update user role
  const handleRoleChange = async (userId, newRole) => {
    try {
      const userRef = doc(db, COLLECTIONS.USERS, userId);
      await updateDoc(userRef, {
        role: newRole,
        updatedAt: new Date().toISOString(),
      });

      // Update local state
      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId ? { ...user, role: newRole } : user
        )
      );

      toast.success("Эрх амжилттай солигдлоо");
    } catch (error) {
      console.error("Update role error:", error);
      toast.error("Алдаа гарлаа");
    }
  };

  // Filter users (safe guards for missing fields)
  const filteredUsers = users.filter((user) => {
    const term = (searchTerm || "").toLowerCase();
    const name = (user.name || "").toLowerCase();
    const email = (user.email || "").toLowerCase();
    return name.includes(term) || email.includes(term);
  });

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Хэрэглэгч удирдах</h1>
        <p className="text-muted-foreground">
          {filteredUsers.length} хэрэглэгч
        </p>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Хэрэглэгч хайх..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Хэрэглэгчдийн жагсаалт</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold text-sm">
                    Нэр
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">
                    Имэйл
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">
                    Утас
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">
                    Эрх
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">
                    Бүртгэлийн огноо
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-sm">
                    Үйлдэл
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="font-semibold text-primary">
                              {user.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <p className="font-medium">{user.name}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-sm">{user.email}</p>
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-sm">{user.phone || "-"}</p>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            user.role === "admin"
                              ? "bg-purple-100 text-purple-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {user.role === "admin" ? "Админ" : "Хэрэглэгч"}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-sm">
                          {new Date(user.createdAt).toLocaleDateString("mn-MN")}
                        </p>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-2">
                          <select
                            value={user.role}
                            onChange={(e) =>
                              handleRoleChange(user.id, e.target.value)
                            }
                            className="text-sm px-2 py-1 rounded-lg border border-input bg-background"
                          >
                            <option value="user">Хэрэглэгч</option>
                            <option value="admin">Админ</option>
                          </select>
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Идэвхгүй болгох"
                          >
                            <UserX className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="py-12 text-center text-muted-foreground"
                    >
                      Хэрэглэгч олдсонгүй
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

export default AdminUsers;
