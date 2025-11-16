import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import {
  registerUser,
  loginUser,
  logoutUser,
  subscribeToAuthChanges,
} from "../services/firebase/auth.service";
import {
  setUser,
  setLoading,
  setError,
  logout as logoutAction,
  selectUser,
  selectIsAuthenticated,
  selectIsAdmin,
  selectAuthLoading,
  selectAuthError,
} from "../features/auth/authSlice";

/**
 * Auth Hook - бүх authentication logic энд
 */
export const useAuth = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isAdmin = useSelector(selectIsAdmin);
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);

  // Auth state-ийг Firebase-тай sync хийх
  useEffect(() => {
    dispatch(setLoading(true));

    const unsubscribe = subscribeToAuthChanges((userData) => {
      if (userData) {
        dispatch(setUser(userData));
      } else {
        dispatch(logoutAction());
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  // Бүртгүүлэх
  const register = async (email, password, name) => {
    try {
      dispatch(setLoading(true));
      const userData = await registerUser(email, password, name);
      dispatch(setUser(userData));
      toast.success("Амжилттай бүртгэгдлээ!");
      return userData;
    } catch (error) {
      const errorMessage = getAuthErrorMessage(error.code);
      dispatch(setError(errorMessage));
      toast.error(errorMessage);
      throw error;
    }
  };

  // Нэвтрэх
  const login = async (email, password) => {
    try {
      dispatch(setLoading(true));
      const userData = await loginUser(email, password);
      dispatch(setUser(userData));
      toast.success(`Тавтай морил, ${userData.name}!`);
      return userData;
    } catch (error) {
      const errorMessage = getAuthErrorMessage(error.code);
      dispatch(setError(errorMessage));
      toast.error(errorMessage);
      throw error;
    }
  };

  // Гарах
  const logout = async () => {
    try {
      dispatch(setLoading(true));
      await logoutUser();
      dispatch(logoutAction());
      toast.success("Амжилттай гарлаа");
    } catch (error) {
      const errorMessage = "Гарахад алдаа гарлаа";
      dispatch(setError(errorMessage));
      toast.error(errorMessage);
      throw error;
    }
  };

  return {
    user,
    isAuthenticated,
    isAdmin,
    loading,
    error,
    register,
    login,
    logout,
  };
};

// Firebase алдааны мессеж
const getAuthErrorMessage = (errorCode) => {
  switch (errorCode) {
    case "auth/email-already-in-use":
      return "Энэ имэйл хаяг аль хэдийн бүртгэгдсэн байна";
    case "auth/invalid-email":
      return "Буруу имэйл хаяг";
    case "auth/weak-password":
      return "Нууц үг хэт хялбар байна (8+ тэмдэгт шаардлагатай)";
    case "auth/user-not-found":
      return "Хэрэглэгч олдсонгүй";
    case "auth/wrong-password":
      return "Нууц үг буруу байна";
    case "auth/too-many-requests":
      return "Хэт олон оролдлого хийлээ. Түр хүлээнэ үү";
    case "auth/network-request-failed":
      return "Интернэт холболтоо шалгана уу";
    default:
      return "Алдаа гарлаа. Дахин оролдоно уу";
  }
};
