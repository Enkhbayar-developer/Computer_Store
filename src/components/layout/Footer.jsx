import { Link } from "react-router-dom";
import {
  Facebook,
  Twitter,
  Instagram,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

function Footer() {
  return (
    <footer className="border-t bg-muted/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">
                  C
                </span>
              </div>
              <span className="font-bold text-lg">Computer Store</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Компьютер болон дагалдах хэрэгслийн шилдэг сонголт
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold">Холбоосууд</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/about"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Бидний тухай
                </Link>
              </li>
              <li>
                <Link
                  to="/products"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Бүтээгдэхүүн
                </Link>
              </li>
              <li>
                <Link
                  to="/deals"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Хямдрал
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Холбоо барих
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h3 className="font-semibold">Үйлчилгээ</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/shipping"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Хүргэлтийн мэдээлэл
                </Link>
              </li>
              <li>
                <Link
                  to="/returns"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Буцаалт
                </Link>
              </li>
              <li>
                <Link
                  to="/faq"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Түгээмэл асуулт
                </Link>
              </li>
              <li>
                <Link
                  to="/support"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Тусламж
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-semibold">Холбоо барих</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                <span className="text-sm text-muted-foreground">
                  Улаанбаатар, Монгол Улс
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  +976 7000-0000
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  info@computerstore.mn
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-muted-foreground">
              © 2025 Computer Store. Бүх эрх хуулиар хамгаалагдсан.
            </p>
            <div className="flex space-x-6">
              <Link
                to="/privacy"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Нууцлалын бодлого
              </Link>
              <Link
                to="/terms"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Үйлчилгээний нөхцөл
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
