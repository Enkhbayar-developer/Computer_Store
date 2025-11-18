import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../services/firebase/config";
import { COLLECTIONS } from "../utils/constants";
import {
  addToWishlist,
  removeFromWishlist,
  toggleWishlist,
  selectWishlist,
} from "../features/user/userSlice";
import { useAuth } from "./useAuth";

/**
 * Wishlist Hook
 */
export const useWishlist = () => {
  const dispatch = useDispatch();
  const wishlist = useSelector(selectWishlist);
  const { user, isAuthenticated } = useAuth();

  // Wishlist-д байгаа эсэхийг шалгах
  const isInWishlist = (productId) => {
    return wishlist.includes(productId);
  };

  // Wishlist-д нэмэх
  const addToWishlistHandler = async (productId) => {
    if (!isAuthenticated) {
      toast.error("Нэвтрэх шаардлагатай");
      return;
    }

    try {
      dispatch(addToWishlist(productId));

      // Firebase-д хадгалах
      if (user?.uid) {
        const userRef = doc(db, COLLECTIONS.USERS, user.uid);
        await updateDoc(userRef, {
          wishlist: [...wishlist, productId],
          updatedAt: new Date().toISOString(),
        });
      }

      toast.success("Wishlist-д нэмэгдлээ");
    } catch (error) {
      console.error("Add to wishlist error:", error);
      toast.error("Алдаа гарлаа");
    }
  };

  // Wishlist-аас хасах
  const removeFromWishlistHandler = async (productId) => {
    if (!isAuthenticated) {
      return;
    }

    try {
      dispatch(removeFromWishlist(productId));

      // Firebase-д хадгалах
      if (user?.uid) {
        const newWishlist = wishlist.filter((id) => id !== productId);
        const userRef = doc(db, COLLECTIONS.USERS, user.uid);
        await updateDoc(userRef, {
          wishlist: newWishlist,
          updatedAt: new Date().toISOString(),
        });
      }

      toast.success("Wishlist-аас хасагдлаа");
    } catch (error) {
      console.error("Remove from wishlist error:", error);
      toast.error("Алдаа гарлаа");
    }
  };

  // Toggle wishlist
  const toggleWishlistHandler = async (productId) => {
    if (!isAuthenticated) {
      toast.error("Нэвтрэх шаардлагатай");
      return;
    }

    const isIn = isInWishlist(productId);

    try {
      dispatch(toggleWishlist(productId));

      // Firebase-д хадгалах
      if (user?.uid) {
        const newWishlist = isIn
          ? wishlist.filter((id) => id !== productId)
          : [...wishlist, productId];

        const userRef = doc(db, COLLECTIONS.USERS, user.uid);
        await updateDoc(userRef, {
          wishlist: newWishlist,
          updatedAt: new Date().toISOString(),
        });
      }

      toast.success(isIn ? "Wishlist-аас хасагдлаа" : "Wishlist-д нэмэгдлээ");
    } catch (error) {
      console.error("Toggle wishlist error:", error);
      toast.error("Алдаа гарлаа");
    }
  };

  return {
    wishlist,
    isInWishlist,
    addToWishlist: addToWishlistHandler,
    removeFromWishlist: removeFromWishlistHandler,
    toggleWishlist: toggleWishlistHandler,
  };
};
