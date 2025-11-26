import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";

/**
 * RTK Query Base API Slice
 * Firebase Firestore ашиглах учраас REST API биш
 * fakeBaseQuery ашиглана
 */
export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["Products", "Orders", "Users", "Reviews", "Categories"],
  endpoints: () => ({}), // Endpoints-ийг feature-д нэмнэ
});

export default apiSlice;
