import { Link } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";
import { Button } from "../components/ui/button";

function NotFoundPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center space-y-6 max-w-md mx-auto px-4">
        {/* 404 Number */}
        <div className="relative">
          <h1 className="text-9xl font-bold text-primary/10">404</h1>
          <p className="absolute inset-0 flex items-center justify-center text-2xl font-semibold">
            Хуудас олдсонгүй
          </p>
        </div>

        {/* Message */}
        <p className="text-muted-foreground">
          Уучлаарай, таны хайж буй хуудас олдсонгүй байна. Хаяг буруу байж
          болзошгүй эсвэл хуудас устгагдсан байж магадгүй.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild>
            <Link to="/">
              <Home className="mr-2 h-4 w-4" />
              Нүүр хуудас
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            onClick={() => window.history.back()}
          >
            <button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Буцах
            </button>
          </Button>
        </div>

        {/* Help Links */}
        <div className="pt-8 border-t">
          <p className="text-sm text-muted-foreground mb-4">
            Эсвэл эдгээр холбоосыг үзнэ үү:
          </p>
          <div className="flex flex-wrap gap-4 justify-center text-sm">
            <Link to="/products" className="text-primary hover:underline">
              Бүтээгдэхүүн
            </Link>
            <Link to="/deals" className="text-primary hover:underline">
              Хямдрал
            </Link>
            <Link to="/contact" className="text-primary hover:underline">
              Холбоо барих
            </Link>
            <Link to="/support" className="text-primary hover:underline">
              Тусламж
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotFoundPage;
