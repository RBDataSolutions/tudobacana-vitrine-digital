import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LogOut, Plus, Edit, Trash2, Upload, Package, ShoppingBag, FileText, ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Product {
  id: string;
  nome: string;
  preco: number;
  categoria: string;
  imagem_url?: string;
  descricao?: string;
  ativo: boolean;
}

interface CustomOrder {
  id: string;
  nome: string;
  email: string;
  whatsapp?: string;
  descricao: string;
  status: string;
  created_at: string;
}

const Admin = () => {
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [customOrders, setCustomOrders] = useState<CustomOrder[]>([]);
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'products' | 'orders'>('products');
  
  // Form state
  const [productForm, setProductForm] = useState({
    nome: '',
    preco: '',
    categoria: '',
    categoriaCustom: '',
    descricao: '',
    imagem_url: ''
  });

  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkUser();
    fetchProducts();
    fetchCustomOrders();
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate('/auth');
      return;
    }

    setUser(session.user);

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!session) {
          navigate('/auth');
        } else {
          setUser(session.user);
        }
      }
    );

    return () => subscription.unsubscribe();
  };

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: "Erro ao carregar produtos",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setProducts(data || []);
    }
  };

  const fetchCustomOrders = async () => {
    const { data, error } = await supabase
      .from('custom_orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: "Erro ao carregar pedidos",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setCustomOrders(data || []);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const productData = {
        nome: productForm.nome,
        preco: parseFloat(productForm.preco),
        categoria: productForm.categoria === 'Outros' ? productForm.categoriaCustom : productForm.categoria,
        descricao: productForm.descricao,
        imagem_url: productForm.imagem_url
      };

      if (editingProduct) {
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', editingProduct.id);

        if (error) throw error;

        toast({
          title: "Produto atualizado!",
          description: "O produto foi atualizado com sucesso.",
        });
      } else {
        const { error } = await supabase
          .from('products')
          .insert([productData]);

        if (error) throw error;

        toast({
          title: "Produto adicionado!",
          description: "O produto foi adicionado ao catálogo.",
        });
      }

      setProductForm({ nome: '', preco: '', categoria: '', categoriaCustom: '', descricao: '', imagem_url: '' });
      setEditingProduct(null);
      setIsProductDialogOpen(false);
      fetchProducts();
    } catch (error: any) {
      toast({
        title: "Erro ao salvar produto",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductForm({
      nome: product.nome,
      preco: product.preco.toString(),
      categoria: ['Bowls', 'Vasos', 'Conjuntos', 'Canecas', 'Pratos'].includes(product.categoria) ? product.categoria : 'Outros',
      categoriaCustom: ['Bowls', 'Vasos', 'Conjuntos', 'Canecas', 'Pratos'].includes(product.categoria) ? '' : product.categoria,
      descricao: product.descricao || '',
      imagem_url: product.imagem_url || ''
    });
    setIsProductDialogOpen(true);
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este produto?')) return;

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: "Erro ao excluir produto",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Produto excluído!",
        description: "O produto foi removido do catálogo.",
      });
      fetchProducts();
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  if (!user) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar ao Site
            </Button>
            <div>
              <h1 className="brand-title text-2xl">Painel Admin</h1>
              <p className="text-muted-foreground">tudobacana cerâmicas</p>
            </div>
          </div>
          <Button variant="outline" onClick={handleSignOut} className="gap-2">
            <LogOut className="w-4 h-4" />
            Sair
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          <Button
            variant={activeTab === 'products' ? 'default' : 'outline'}
            onClick={() => setActiveTab('products')}
            className="gap-2"
          >
            <Package className="w-4 h-4" />
            Produtos ({products.length})
          </Button>
          <Button
            variant={activeTab === 'orders' ? 'default' : 'outline'}
            onClick={() => setActiveTab('orders')}
            className="gap-2"
          >
            <FileText className="w-4 h-4" />
            Pedidos Personalizados ({customOrders.length})
          </Button>
        </div>

        {/* Products Tab */}
        {activeTab === 'products' && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5" />
                  Catálogo de Produtos
                </CardTitle>
                <p className="text-muted-foreground">Gerencie os produtos do seu catálogo</p>
              </div>
              
              <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2" onClick={() => {
                    setEditingProduct(null);
                    setProductForm({ nome: '', preco: '', categoria: '', categoriaCustom: '', descricao: '', imagem_url: '' });
                  }}>
                    <Plus className="w-4 h-4" />
                    Novo Produto
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>
                      {editingProduct ? 'Editar Produto' : 'Novo Produto'}
                    </DialogTitle>
                  </DialogHeader>
                  
                  <form onSubmit={handleProductSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="nome">Nome do Produto</Label>
                      <Input
                        id="nome"
                        value={productForm.nome}
                        onChange={(e) => setProductForm({ ...productForm, nome: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="preco">Preço (R$)</Label>
                      <Input
                        id="preco"
                        type="number"
                        step="0.01"
                        min="0"
                        value={productForm.preco}
                        onChange={(e) => setProductForm({ ...productForm, preco: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="categoria">Categoria</Label>
                      <Select value={productForm.categoria} onValueChange={(value) => setProductForm({ ...productForm, categoria: value, categoriaCustom: '' })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma categoria" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Bowls">Bowls</SelectItem>
                          <SelectItem value="Vasos">Vasos</SelectItem>
                          <SelectItem value="Conjuntos">Conjuntos</SelectItem>
                          <SelectItem value="Canecas">Canecas</SelectItem>
                          <SelectItem value="Pratos">Pratos</SelectItem>
                          <SelectItem value="Outros">Outros</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {productForm.categoria === 'Outros' && (
                      <div className="space-y-2">
                        <Label htmlFor="categoriaCustom">Nome da Categoria</Label>
                        <Input
                          id="categoriaCustom"
                          placeholder="Digite o nome da categoria"
                          value={productForm.categoriaCustom}
                          onChange={(e) => setProductForm({ ...productForm, categoriaCustom: e.target.value })}
                          required
                        />
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="imagem_url">URL da Imagem</Label>
                      <Input
                        id="imagem_url"
                        type="url"
                        placeholder="https://exemplo.com/imagem.jpg"
                        value={productForm.imagem_url}
                        onChange={(e) => setProductForm({ ...productForm, imagem_url: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="descricao">Descrição (opcional)</Label>
                      <Textarea
                        id="descricao"
                        placeholder="Descrição do produto..."
                        value={productForm.descricao}
                        onChange={(e) => setProductForm({ ...productForm, descricao: e.target.value })}
                        rows={3}
                      />
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button type="submit" disabled={isLoading} className="flex-1">
                        {isLoading ? 'Salvando...' : 'Salvar'}
                      </Button>
                      <Button type="button" variant="outline" onClick={() => setIsProductDialogOpen(false)}>
                        Cancelar
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </CardHeader>

            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Produto</TableHead>
                      <TableHead>Categoria</TableHead>
                      <TableHead>Preço</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="flex items-center gap-3">
                          {product.imagem_url && (
                            <img 
                              src={product.imagem_url} 
                              alt={product.nome}
                              className="w-10 h-10 object-cover rounded"
                            />
                          )}
                          <div>
                            <div className="font-medium">{product.nome}</div>
                            {product.descricao && (
                              <div className="text-sm text-muted-foreground truncate max-w-xs">
                                {product.descricao}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{product.categoria}</TableCell>
                        <TableCell className="font-medium">
                          {formatPrice(product.preco)}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditProduct(product)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteProduct(product.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {products.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  Nenhum produto cadastrado ainda.
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Custom Orders Tab */}
        {activeTab === 'orders' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Pedidos Personalizados
              </CardTitle>
              <p className="text-muted-foreground">Gerencie as solicitações de produtos personalizados</p>
            </CardHeader>

            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Contato</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Data</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{order.nome}</div>
                            <div className="text-sm text-muted-foreground truncate max-w-xs">
                              {order.descricao}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{order.email}</div>
                            {order.whatsapp && <div>{order.whatsapp}</div>}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                            {order.status}
                          </span>
                        </TableCell>
                        <TableCell>
                          {new Date(order.created_at).toLocaleDateString('pt-BR')}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {customOrders.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  Nenhum pedido personalizado ainda.
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Admin;