import { useState, useEffect } from 'react';
import { Heart, ShoppingBag } from 'lucide-react';
import { Button } from './ui/button';
import { supabase } from '@/integrations/supabase/client';
import produto1 from '../assets/produto-1.jpg';
import produto2 from '../assets/produto-2.jpg';
import produto3 from '../assets/produto-3.jpg';
import produto4 from '../assets/produto-4.jpg';

// Mock data para demonstração (fallback)
const mockProducts = [
  {
    id: "1",
    nome: "Bowl Artesanal Terra",
    preco: 89.90,
    imagem_url: produto1,
    categoria: "Bowls",
    ativo: true
  },
  {
    id: "2",
    nome: "Vaso Curves Naturais",
    preco: 125.50,
    imagem_url: produto2,
    categoria: "Vasos",
    ativo: true
  },
  {
    id: "3",
    nome: "Conjunto Pratos Rústicos",
    preco: 145.00,
    imagem_url: produto3,
    categoria: "Conjuntos",
    ativo: true
  },
  {
    id: "4",
    nome: "Caneca Cozy Morning",
    preco: 65.00,
    imagem_url: produto4,
    categoria: "Canecas",
    ativo: true
  }
];

interface Product {
  id: string;
  nome: string;
  preco: number;
  imagem_url?: string;
  categoria: string;
  ativo: boolean;
}

const ProductCatalog = () => {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('ativo', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao carregar produtos:', error);
        // Mantém os produtos mock em caso de erro
        return;
      }

      if (data && data.length > 0) {
        setProducts(data);
      }
    } catch (error) {
      console.error('Erro ao conectar com o banco:', error);
      // Mantém os produtos mock em caso de erro
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFavorite = (productId: string) => {
    setFavorites(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  return (
    <section className="py-16 md:py-24 bg-card">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="brand-title text-3xl md:text-4xl lg:text-5xl mb-4">
            Nossa Coleção
          </h2>
          <p className="brand-body text-lg md:text-xl max-w-2xl mx-auto">
            Peças únicas, feitas com carinho e atenção aos detalhes. 
            Cada item conta uma história especial.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {isLoading ? (
            // Loading skeleton
            Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="card-elegant animate-pulse">
                <div className="bg-muted rounded-lg mb-4 aspect-square"></div>
                <div className="space-y-3">
                  <div className="h-6 bg-muted rounded w-3/4"></div>
                  <div className="h-8 bg-muted rounded w-1/2"></div>
                </div>
              </div>
            ))
          ) : (
            products.map((product, index) => (
            <div 
              key={product.id} 
              className="card-elegant hover-lift group"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {/* Product Image */}
              <div className="relative overflow-hidden rounded-lg mb-4 aspect-square">
                <img 
                  src={product.imagem_url} 
                  alt={product.nome}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                
                {/* Favorite Button */}
                <button
                  onClick={() => toggleFavorite(product.id)}
                  className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-all duration-300"
                >
                  <Heart 
                    className={`w-4 h-4 transition-colors duration-300 ${
                      favorites.includes(product.id) 
                        ? 'fill-red-500 text-red-500' 
                        : 'text-gray-600 hover:text-red-500'
                    }`}
                  />
                </button>

                {/* Category Badge */}
                <div className="absolute top-3 left-3 px-3 py-1 bg-primary/90 backdrop-blur-sm text-primary-foreground text-xs font-medium rounded-full">
                  {product.categoria}
                </div>
              </div>

              {/* Product Info */}
              <div className="space-y-3">
                <h3 className="font-serif text-lg font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
                  {product.nome}
                </h3>
                
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-primary">
                    {formatPrice(product.preco)}
                  </span>
                  
                  <Button 
                    size="sm" 
                    className="btn-brand opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  >
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    Ver mais
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <p className="brand-body text-lg mb-6">
            Gostou do que viu? Entre em contato para conhecer toda nossa coleção!
          </p>
          <Button size="lg" className="btn-brand">
            <ShoppingBag className="w-5 h-5 mr-2" />
            Ver Catálogo Completo
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProductCatalog;