import { apiSlice } from "../../store/api/apiSlice";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../services/firebase/config";
import { COLLECTIONS } from "../../utils/constants";

/**
 * Orders RTK Query API
 */
export const ordersAPI = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Хэрэглэгчийн бүх захиалга авах
    getUserOrders: builder.query({
      async queryFn(userId) {
        try {
          const q = query(
            collection(db, COLLECTIONS.ORDERS),
            where("userId", "==", userId),
            orderBy("createdAt", "desc")
          );

          const snapshot = await getDocs(q);
          const orders = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          return { data: orders };
        } catch (error) {
          console.error("Get user orders error:", error);
          return { error: error.message };
        }
      },
      providesTags: ["Orders"],
    }),

    // Нэг захиалгын дэлгэрэнгүй
    getOrderById: builder.query({
      async queryFn(orderId) {
        try {
          const orderDoc = await getDoc(doc(db, COLLECTIONS.ORDERS, orderId));

          if (!orderDoc.exists()) {
            return { error: "Order not found" };
          }

          return {
            data: {
              id: orderDoc.id,
              ...orderDoc.data(),
            },
          };
        } catch (error) {
          console.error("Get order error:", error);
          return { error: error.message };
        }
      },
      providesTags: (result, error, id) => [{ type: "Orders", id }],
    }),

    // Захиалгын статус шинэчлэх (Admin)
    updateOrderStatus: builder.mutation({
      async queryFn({ orderId, status }) {
        try {
          const orderRef = doc(db, COLLECTIONS.ORDERS, orderId);

          await updateDoc(orderRef, {
            status,
            updatedAt: new Date().toISOString(),
          });

          return { data: { id: orderId, status } };
        } catch (error) {
          console.error("Update order status error:", error);
          return { error: error.message };
        }
      },
      invalidatesTags: (result, error, { orderId }) => [
        "Orders",
        { type: "Orders", id: orderId },
      ],
    }),

    // Бүх захиалга авах (Admin)
    getAllOrders: builder.query({
      async queryFn() {
        try {
          const q = query(
            collection(db, COLLECTIONS.ORDERS),
            orderBy("createdAt", "desc")
          );

          const snapshot = await getDocs(q);
          const orders = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          return { data: orders };
        } catch (error) {
          console.error("Get all orders error:", error);
          return { error: error.message };
        }
      },
      providesTags: ["Orders"],
    }),
  }),
});

export const {
  useGetUserOrdersQuery,
  useGetOrderByIdQuery,
  useUpdateOrderStatusMutation,
  useGetAllOrdersQuery,
} = ordersAPI;
