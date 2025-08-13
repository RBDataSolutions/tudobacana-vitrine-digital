-- Create a table for products
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  preco DECIMAL(10,2) NOT NULL,
  categoria TEXT NOT NULL,
  imagem_url TEXT,
  descricao TEXT,
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create a table for custom orders
CREATE TABLE public.custom_orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  whatsapp TEXT,
  descricao TEXT NOT NULL,
  preferencias TEXT,
  imagem_referencia_url TEXT,
  status TEXT NOT NULL DEFAULT 'pendente',
  orcamento DECIMAL(10,2),
  observacoes_admin TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_orders ENABLE ROW LEVEL SECURITY;

-- Create policies for products (readable by everyone, manageable by authenticated users)
CREATE POLICY "Products are viewable by everyone" 
ON public.products 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can manage products" 
ON public.products 
FOR ALL 
TO authenticated
USING (true)
WITH CHECK (true);

-- Create policies for custom orders (manageable by authenticated users)
CREATE POLICY "Authenticated users can manage custom orders" 
ON public.custom_orders 
FOR ALL 
TO authenticated
USING (true)
WITH CHECK (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_custom_orders_updated_at
  BEFORE UPDATE ON public.custom_orders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for product images
INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true);

-- Create storage policies for product images
CREATE POLICY "Product images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'product-images');

CREATE POLICY "Authenticated users can upload product images" 
ON storage.objects 
FOR INSERT 
TO authenticated
WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "Authenticated users can update product images" 
ON storage.objects 
FOR UPDATE 
TO authenticated
USING (bucket_id = 'product-images');

CREATE POLICY "Authenticated users can delete product images" 
ON storage.objects 
FOR DELETE 
TO authenticated
USING (bucket_id = 'product-images');