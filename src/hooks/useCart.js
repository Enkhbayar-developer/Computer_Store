import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import {
  addToCart as addToCartAction,
  incrementQuantity,
  decrementQuantity,
  updateQuantity,
  removeFromCart,
  clearCart,
  selectCartItems,
  selectCartCount,
  selectCartSubtotal,
  selectCartTax,
  selectCartTotal,
} from "../features/cart/cartSlice";

/**
 * Cart Hook - бүх cart logic энд
 */
export const useCart = () => {
  const dispatch = useDispatch();
  const items = useSelector(selectCartItems);
  const count = useSelector(selectCartCount);
  const subtotal = useSelector(selectCartSubtotal);
  const tax = useSelector(selectCartTax);
  const total = useSelector(selectCartTotal);

  // Сагсанд нэмэх
  const addToCart = (product) => {
    // Stock шалгах
    if (product.stock <= 0) {
      toast.error("Бүтээгдэхүүн дууссан байна");
      return;
    }

    // Аль хэдийн сагсанд байгаа эсэхийг шалгах
    const existingItem = items.find((item) => item.id === product.id);
    if (existingItem && existingItem.quantity >= product.stock) {
      toast.error("Нөөцөнд байгаа хамгийн их тоо ширхэг");
      return;
    }

    dispatch(addToCartAction(product));
    toast.success("Сагсанд нэмэгдлээ");
  };

  // Тоо ширхэг нэмэх
  const increase = (productId) => {
    const item = items.find((item) => item.id === productId);
    if (item && item.quantity >= item.stock) {
      toast.error("Нөөцөнд байгаа хамгийн их тоо ширхэг");
      return;
    }
    dispatch(incrementQuantity(productId));
  };

  // Тоо ширхэг хасах
  const decrease = (productId) => {
    dispatch(decrementQuantity(productId));
  };

  // Тоо ширхэг өөрчлөх
  const changeQuantity = (productId, quantity) => {
    const item = items.find((item) => item.id === productId);

    if (!item) return;

    if (quantity > item.stock) {
      toast.error("Нөөцөнд байгаа хамгийн их тоо ширхэг");
      return;
    }

    if (quantity < 1) {
      toast.error("Хамгийн багадаа 1 байх ёстой");
      return;
    }

    dispatch(updateQuantity({ id: productId, quantity }));
  };

  // Устгах
  const removeItem = (productId) => {
    dispatch(removeFromCart(productId));
    toast.success("Сагснаас хасагдлаа");
  };

  // Бүх зүйлийг устгах
  const clearAllItems = () => {
    dispatch(clearCart());
    toast.success("Сагс хоослогдлоо");
  };

  // Сагсанд байгаа эсэхийг шалгах
  const isInCart = (productId) => {
    return items.some((item) => item.id === productId);
  };

  // Бүтээгдэхүүний тоо ширхэг авах
  const getItemQuantity = (productId) => {
    const item = items.find((item) => item.id === productId);
    return item ? item.quantity : 0;
  };

  return {
    items,
    count,
    subtotal,
    tax,
    total,
    addToCart,
    increase,
    decrease,
    changeQuantity,
    removeItem,
    clearAllItems,
    isInCart,
    getItemQuantity,
  };
};
