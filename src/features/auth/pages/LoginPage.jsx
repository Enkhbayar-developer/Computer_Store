import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "../components/LoginForm";
import { useAuth } from "../../../hooks/useAuth";

function LoginPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Хэрэв аль хэдийн нэвтэрсэн бол нүүр хуудас руу шилжүүлэх
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12">
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  );
}

export default LoginPage;
