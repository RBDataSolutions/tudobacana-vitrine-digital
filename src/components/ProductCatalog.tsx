import { useState, useEffect } from 'react';
import { Heart, ShoppingBag } from 'lucide-react';
import { Button } from './ui/button';
import { supabase } from '@/integrations/supabase/client';


interface Product {
  id: string;
  nome: string;
  preco: number;
  imagem_url?: string;
  categoria: string;
  ativo: boolean;
}

const ProductCatalog = () => {
  const [products, setProducts] = useState<Product[]>([]);
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
        setProducts([]);
        return;
      }

      setProducts(data || []);
    } catch (error) {
      console.error('Erro ao conectar com o banco:', error);
      setProducts([]);
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

        {isLoading ? (
          // Loading skeleton
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="card-elegant animate-pulse">
                <div className="bg-muted rounded-lg mb-4 aspect-square"></div>
                <div className="space-y-3">
                  <div className="h-6 bg-muted rounded w-3/4"></div>
                  <div className="h-8 bg-muted rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product, index) => (
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
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold mb-4">Em breve!</h3>
            <p className="text-muted-foreground">
              Estamos preparando produtos incríveis para você. Volte em breve para conferir nossa coleção.
            </p>
          </div>
        )}

        {/* Call to Action - Only show if there are products */}
        {products.length > 0 && (
          <div className="text-center mt-16">
            <p className="brand-body text-lg mb-6">
              Gostou do que viu? Entre em contato para conhecer toda nossa coleção!
            </p>
            <Button size="lg" className="btn-brand">
              <ShoppingBag className="w-5 h-5 mr-2" />
              Ver Catálogo Completo
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductCatalog;