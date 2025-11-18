import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import RegisterForm from "../components/RegisterForm";
import { useAuth } from "../../../hooks/useAuth";

function RegisterPage() {
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
        <RegisterForm />
      </div>
    </div>
  );
}

export default RegisterPage;
