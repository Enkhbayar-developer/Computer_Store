import { Link } from "react-router-dom";
import { ShoppingCart, User, Heart, Search, Menu, LogOut } from "lucide-react";
import { Button } from "../ui/button";
import { useAuth } from "../../hooks/useAuth";
import { useCart } from "../../hooks/useCart";

function Header() {
  const { isAuthenticated, isAdmin, logout } = useAuth();
  const { count } = useCart();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        {/* Top Bar */}
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">
                C
              </span>
            </div>
            <span className="font-bold text-xl hidden sm:inline-block">
              Computer Store
            </span>
          </Link>

          {/* Search Bar (Desktop) */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Бүтээгдэхүүн хайх..."
                className="w-full h-10 pl-10 pr-4 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Wishlist */}
            {isAuthenticated && (
              <Link to="/wishlist">
                <Button variant="ghost" size="icon" className="relative">
                  <Heart className="h-5 w-5" />
                </Button>
              </Link>
            )}

            {/* Cart */}
            <Link to="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {count > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-medium">
                    {count > 9 ? "9+" : count}
                  </span>
                )}
              </Button>
            </Link>

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <Link to="/profile">
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={logout}
                  title="Гарах"
                >
                  <LogOut className="h-5 w-5" />
                </Button>
                {isAdmin && (
                  <Link to="/admin">
                    <Button variant="default" size="sm">
                      Admin
                    </Button>
                  </Link>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Нэвтрэх
                  </Button>
                </Link>
                <Link to="/register" className="hidden sm:block">
                  <Button size="sm">Бүртгүүлэх</Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu */}
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-6 py-3 border-t">
          <Link
            to="/products"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Бүх бүтээгдэхүүн
          </Link>
          <Link
            to="/products?category=laptop"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Зөөврийн компьютер
          </Link>
          <Link
            to="/products?category=desktop"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Суурин компьютер
          </Link>
          <Link
            to="/products?category=accessories"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Дагалдах хэрэгсэл
          </Link>
          <Link
            to="/deals"
            className="text-sm font-medium text-destructive hover:text-destructive/80 transition-colors"
          >
            Хямдрал
          </Link>
        </nav>

        {/* Mobile Search */}
        <div className="md:hidden py-3 border-t">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Хайх..."
              className="w-full h-10 pl-10 pr-4 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
