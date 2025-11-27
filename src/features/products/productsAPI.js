import { apiSlice } from "../../store/api/apiSlice";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "../../services/firebase/config";
import { COLLECTIONS } from "../../utils/constants";

/**
 * Products RTK Query API
 */
export const productsAPI = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Бүх бүтээгдэхүүн авах
    getProducts: builder.query({
      async queryFn({ category, sortBy, searchTerm, page = 1, pageSize = 12 }) {
        try {
          let q = collection(db, COLLECTIONS.PRODUCTS);
          let conditions = [];

          // Category filter
          if (category && category !== "all") {
            conditions.push(where("category", "==", category));
          }

          // Search (Firebase-д full-text search байхгүй, client-д filter хийнэ)

          // Sorting
          let orderByField = "createdAt";
          let orderDirection = "desc";

          if (sortBy === "price_asc") {
            orderByField = "price";
            orderDirection = "asc";
          } else if (sortBy === "price_desc") {
            orderByField = "price";
            orderDirection = "desc";
          } else if (sortBy === "name_asc") {
            orderByField = "name";
            orderDirection = "asc";
          } else if (sortBy === "rating") {
            orderByField = "rating";
            orderDirection = "desc";
          } else if (sortBy === "popular") {
            orderByField = "saleCount";
            orderDirection = "desc";
          }

          // Query үүсгэх
          if (conditions.length > 0) {
            q = query(
              collection(db, COLLECTIONS.PRODUCTS),
              ...conditions,
              orderBy(orderByField, orderDirection)
            );
          } else {
            q = query(
              collection(db, COLLECTIONS.PRODUCTS),
              orderBy(orderByField, orderDirection)
            );
          }

          const snapshot = await getDocs(q);
          let products = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          // Client-side search (safely handle missing fields)
          if (searchTerm) {
            const st = (searchTerm || "").toLowerCase();
            products = products.filter((product) => {
              const name = (product.name || "").toLowerCase();
              const desc = (product.description || "").toLowerCase();
              const brand = (product.brand || "").toLowerCase();
              return (
                name.includes(st) || desc.includes(st) || brand.includes(st)
              );
            });
          }

          // Pagination
          const startIndex = (page - 1) * pageSize;
          const endIndex = startIndex + pageSize;
          const paginatedProducts = products.slice(startIndex, endIndex);

          return {
            data: {
              products: paginatedProducts,
              totalCount: products.length,
              currentPage: page,
              totalPages: Math.ceil(products.length / pageSize),
            },
          };
        } catch (error) {
          console.error("Get products error:", error);
          return { error: error.message };
        }
      },
      providesTags: ["Products"],
    }),

    // Нэг бүтээгдэхүүний дэлгэрэнгүй
    getProductById: builder.query({
      async queryFn(productId) {
        try {
          const productDoc = await getDoc(
            doc(db, COLLECTIONS.PRODUCTS, productId)
          );

          if (!productDoc.exists()) {
            return { error: "Product not found" };
          }

          return {
            data: {
              id: productDoc.id,
              ...productDoc.data(),
            },
          };
        } catch (error) {
          console.error("Get product error:", error);
          return { error: error.message };
        }
      },
      providesTags: (result, error, id) => [{ type: "Products", id }],
    }),

    // Бүтээгдэхүүн нэмэх (Admin)
    createProduct: builder.mutation({
      async queryFn(productData) {
        try {
          const newProduct = {
            ...productData,
            rating: 0,
            reviews: [],
            saleCount: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          const docRef = await addDoc(
            collection(db, COLLECTIONS.PRODUCTS),
            newProduct
          );

          return {
            data: {
              id: docRef.id,
              ...newProduct,
            },
          };
        } catch (error) {
          console.error("Create product error:", error);
          return { error: error.message };
        }
      },
      invalidatesTags: ["Products"],
    }),

    // Бүтээгдэхүүн засах (Admin)
    updateProduct: builder.mutation({
      async queryFn({ id, data }) {
        try {
          const productRef = doc(db, COLLECTIONS.PRODUCTS, id);

          const updateData = {
            ...data,
            updatedAt: new Date().toISOString(),
          };

          await updateDoc(productRef, updateData);

          return { data: { id, ...updateData } };
        } catch (error) {
          console.error("Update product error:", error);
          return { error: error.message };
        }
      },
      invalidatesTags: (result, error, { id }) => [
        "Products",
        { type: "Products", id },
      ],
    }),

    // Бүтээгдэхүүн устгах (Admin)
    deleteProduct: builder.mutation({
      async queryFn(productId) {
        try {
          await deleteDoc(doc(db, COLLECTIONS.PRODUCTS, productId));
          return { data: { id: productId } };
        } catch (error) {
          console.error("Delete product error:", error);
          return { error: error.message };
        }
      },
      invalidatesTags: ["Products"],
    }),

    // Featured products
    getFeaturedProducts: builder.query({
      async queryFn() {
        try {
          const q = query(
            collection(db, COLLECTIONS.PRODUCTS),
            where("featured", "==", true),
            limit(8)
          );

          const snapshot = await getDocs(q);
          const products = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          return { data: products };
        } catch (error) {
          console.error("Get featured products error:", error);
          return { error: error.message };
        }
      },
      providesTags: ["Products"],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetFeaturedProductsQuery,
} = productsAPI;
