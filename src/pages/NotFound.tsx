import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center card-elegant max-w-md mx-4">
        <h1 className="brand-title text-6xl mb-4">404</h1>
        <p className="brand-body text-xl mb-6">Ops! Página não encontrada</p>
        <p className="brand-body mb-8">
          Parece que você se perdeu. Que tal voltar para nossa página principal 
          e conhecer nossas cerâmicas?
        </p>
        <a 
          href="/" 
          className="btn-brand inline-flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-all duration-300 hover:shadow-lg hover:scale-105"
        >
          Voltar ao início
        </a>
      </div>
    </div>
  );
};

export default NotFound;
