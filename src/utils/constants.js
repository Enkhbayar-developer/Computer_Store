/**
 * Application Constants
 */

// Order Status
export const ORDER_STATUS = {
  PENDING: "pending",
  PROCESSING: "processing",
  SHIPPED: "shipped",
  DELIVERED: "delivered",
  CANCELLED: "cancelled",
};

// Payment Status
export const PAYMENT_STATUS = {
  PENDING: "pending",
  COMPLETED: "completed",
  FAILED: "failed",
  REFUNDED: "refunded",
};

// User Roles
export const USER_ROLES = {
  USER: "user",
  ADMIN: "admin",
};

// Product Categories
export const PRODUCT_CATEGORIES = {
  LAPTOP: "laptop",
  DESKTOP: "desktop",
  MONITOR: "monitor",
  KEYBOARD: "keyboard",
  MOUSE: "mouse",
  HEADPHONE: "headphone",
  STORAGE: "storage",
  RAM: "ram",
  GPU: "gpu",
  CPU: "cpu",
  ACCESSORIES: "accessories",
};

// Sort Options
export const SORT_OPTIONS = {
  PRICE_LOW_HIGH: "price_asc",
  PRICE_HIGH_LOW: "price_desc",
  NAME_A_Z: "name_asc",
  NAME_Z_A: "name_desc",
  NEWEST: "newest",
  RATING: "rating",
  POPULAR: "popular",
};

// Pagination
export const ITEMS_PER_PAGE = 12;

// Firebase Collections
export const COLLECTIONS = {
  USERS: "users",
  PRODUCTS: "products",
  ORDERS: "orders",
  REVIEWS: "reviews",
  CATEGORIES: "categories",
};

// Toast Messages
export const TOAST_MESSAGES = {
  SUCCESS: {
    PRODUCT_ADDED: "Бүтээгдэхүүн сагсанд нэмэгдлээ",
    PRODUCT_REMOVED: "Бүтээгдэхүүн устгагдлаа",
    ORDER_PLACED: "Захиалга амжилттай үүслээ",
    LOGIN_SUCCESS: "Амжилттай нэвтэрлээ",
    REGISTER_SUCCESS: "Амжилттай бүртгэгдлээ",
    PROFILE_UPDATED: "Профайл шинэчлэгдлээ",
  },
  ERROR: {
    GENERIC: "Алдаа гарлаа, дахин оролдоно уу",
    LOGIN_FAILED: "Нэвтрэх нэр эсвэл нууц үг буруу байна",
    NETWORK_ERROR: "Интернэт холболтоо шалгана уу",
    OUT_OF_STOCK: "Бүтээгдэхүүн дууссан байна",
    INSUFFICIENT_STOCK: "Хангалттай нөөц байхгүй байна",
  },
};

// Regex Patterns
export const REGEX = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^[0-9]{8}$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
};
