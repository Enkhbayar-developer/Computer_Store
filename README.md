# 🖥️ Computer Store - E-commerce Platform

Компьютер болон дагалдах хэрэгслийн онлайн худалдааны платформ

## ✨ Онцлог

### 🛍️ Хэрэглэгчийн онцлог

- ✅ Бүтээгдэхүүний жагсаалт (filter, search, sort, pagination)
- ✅ Бүтээгдэхүүний дэлгэрэнгүй хуудас
- ✅ Сагс удирдлага (Redux Persist)
- ✅ Wishlist систем
- ✅ Захиалга хийх (checkout flow)
- ✅ Онлайн төлбөр
- ✅ Захиалгын түүх & tracking
- ✅ Профайл удирдлага
- ✅ Үнэлгээ & сэтгэгдэл

### 🔐 Админы онцлог

- ✅ Dashboard with statistics
- ✅ Бүтээгдэхүүн CRUD
- ✅ Захиалга удирдах (status update)
- ✅ Хэрэглэгч удирдах (role management)
- ✅ Analytics & Reports

## 🚀 Technology Stack

### Frontend

- **React.js** - UI framework
- **Redux Toolkit** - State management
- **RTK Query** - Data fetching & caching
- **Redux Persist** - Cart & user session persistence
- **React Router v6** - Routing
- **Tailwind CSS** - Styling
- **ShadCN UI** - UI components
- **Vite** - Build tool

### Backend

- **Firebase Authentication** - User authentication
- **Firebase Firestore** - NoSQL database
- **Firebase Storage** - File storage (optional)
- **Firebase Hosting** - Hosting

## 📦 Installation

### 1. Clone Repository

```bash
git clone <repository-url>
cd computer-store
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Firebase Setup

1. Firebase Console-д орж project үүсгэнэ үү: https://console.firebase.google.com
2. Authentication идэвхжүүлнэ (Email/Password)
3. Firestore Database үүсгэнэ
4. Firebase configuration авна

### 4. Environment Variables

`.env` файл үүсгэж Firebase config оруулна:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 5. Firebase Security Rules Deploy

```bash
# Firestore Rules
firebase deploy --only firestore:rules

# Storage Rules (хэрэв ашиглавал)
firebase deploy --only storage
```

### 6. Start Development Server

```bash
npm run dev
```

## 🗂️ Project Structure

```
src/
├── features/           # Feature-based architecture
│   ├── auth/          # Authentication
│   ├── products/      # Products management
│   ├── cart/          # Shopping cart
│   ├── checkout/      # Checkout flow
│   ├── orders/        # Orders management
│   ├── user/          # User profile & wishlist
│   └── admin/         # Admin panel
├── components/        # Shared components
│   ├── ui/           # ShadCN UI components
│   ├── layout/       # Layout components
│   └── shared/       # Shared utilities
├── store/            # Redux store
├── services/         # Firebase services
├── hooks/            # Custom hooks
├── utils/            # Utilities & constants
└── routes/           # Routing configuration
```

## 🔒 Firebase Security Rules

### Firestore Rules

- Users: Read (all authenticated), Write (owner or admin)
- Products: Read (public), Write (admin only)
- Orders: Read (owner or admin), Create (authenticated), Update (admin)

### Storage Rules

- Product images: Read (public), Write (admin only)
- User avatars: Read (public), Write (owner only)

## 👤 Admin Account

Эхний admin бүртгэл үүсгэх:

1. Ердийн хэрэглэгчээр бүртгүүлнэ
2. Firestore Console-д орж `users` collection дотор `role` талбарыг `admin` болгоно

## 🚢 Deployment

### Build

```bash
npm run build
```

### Deploy to Firebase Hosting

```bash
firebase deploy --only hosting
```

## 📝 Available Scripts

- `npm run dev` - Development server эхлүүлэх
- `npm run build` - Production build хийх
- `npm run preview` - Build-ийг preview хийх
- `npm run lint` - ESLint шалгах
- `npm run firebase:deploy` - Firebase deploy

## 🎨 Key Features Implementation

### Cart System (Redux Persist)

- Нэвтрэхгүйгээр сагсанд нэмж болно
- Refresh хийсний дараа ч хадгалагдана
- Нэвтэрсний дараа merge хийхгүй
- Real-time stock validation

### Authentication Flow

- Email/Password authentication
- Auto-redirect after login
- Protected routes for user pages
- Admin-only routes

### Order Tracking

- 4-step tracking timeline
- Real-time status updates
- Order history
- Order details

## 🛠️ Development Tips

### Add New Product

1. Admin panel (`/admin/products`) руу орох
2. "Шинэ бүтээгдэхүүн" дарах
3. Мэдээлэл оруулж хадгалах

### Testing Payment

Төлбөрийн систем test mode-д ажиллаж байгаа тул ямар ч дугаар оруулж болно.

### Common Issues

- **Firebase Auth Error**: `.env` файлд зөв config байгаа эсэхийг шалгана
- **Firestore Permission Denied**: Security rules-ийг deploy хийсэн эсэхийг шалгана
- **Redux Persist Error**: localStorage-ийг цэвэрлэнэ

## 📚 Documentation

- [React Documentation](https://react.dev)
- [Redux Toolkit](https://redux-toolkit.js.org)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [ShadCN UI](https://ui.shadcn.com)

## 📄 License

MIT License

## 👨‍💻 Author

Computer Store Team

---

**Happy Coding! 🚀**
