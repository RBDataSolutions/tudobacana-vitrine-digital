import { useEffect, useMemo, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/components/ui/use-toast";

const schema = z.object({
  nome: z.string().min(2, "Informe seu nome"),
  email: z.string().email("E-mail inválido"),
  whatsapp: z
    .string()
    .min(8, "Informe um telefone válido")
    .optional()
    .or(z.literal("")),
  descricao: z.string().min(10, "Descreva seu pedido com pelo menos 10 caracteres"),
  preferencias: z.string().optional().or(z.literal("")),
  referencia: z.any().optional(),
});

type FormValues = z.infer<typeof schema>;

const CustomOrder = () => {
  const [preview, setPreview] = useState<string | null>(null);

  // Basic SEO for SPA
  useEffect(() => {
    const title = "Pedidos Personalizados | tudobacana";
    document.title = title;

    const desc = "Solicite pedidos personalizados de cerâmica – tudobacana. Descreva sua ideia e receba avaliação e orçamento.";
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", desc);

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", window.location.href);
  }, []);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      nome: "",
      email: "",
      whatsapp: "",
      descricao: "",
      preferencias: "",
      referencia: undefined,
    },
  });

  const handleImageChange = (file?: File) => {
    if (!file) {
      setPreview(null);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const onSubmit = (values: FormValues) => {
    // Aqui integraremos com Supabase (mensagens/solicitações + Storage). Por enquanto, apenas feedback.
    // eslint-disable-next-line no-console
    console.log("Solicitação de personalizado:", values);
    toast({
      title: "Solicitação enviada",
      description: "Vamos avaliar sua ideia e retornaremos com um orçamento em breve.",
    });
    form.reset();
    setPreview(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <header className="text-center mb-8 md:mb-12">
              <h1 className="brand-title text-3xl md:text-4xl">Pedidos Personalizados</h1>
              <p className="brand-body text-muted-foreground mt-3 max-w-2xl mx-auto">
                Conte pra gente a sua ideia. Nosso time avalia a viabilidade e envia um orçamento.
              </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <article className="lg:col-span-2 p-6 md:p-8 rounded-lg border border-border/60 bg-card shadow-sm">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="nome"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nome</FormLabel>
                            <FormControl>
                              <Input placeholder="Seu nome completo" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>E-mail</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="seuemail@exemplo.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="whatsapp"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>WhatsApp (opcional)</FormLabel>
                            <FormControl>
                              <Input placeholder="(11) 99999-9999" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="preferencias"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Preferências (cores, acabamento, medidas) – opcional</FormLabel>
                            <FormControl>
                              <Input placeholder="Ex.: vermelho queimado, 20cm x 10cm" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="descricao"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Descreva seu pedido</FormLabel>
                          <FormControl>
                            <Textarea rows={5} placeholder="Conte os detalhes do que você imagina (formato, uso, inspiração, etc.)" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="referencia"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Imagem de referência (opcional)</FormLabel>
                          <FormControl>
                            <Input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                field.onChange(file);
                                handleImageChange(file);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {preview && (
                      <div className="rounded-md border border-border/60 p-3 bg-muted/30">
                        <img src={preview} alt="pré-visualização da referência" className="max-h-64 rounded-md mx-auto" loading="lazy" />
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">
                        Após o envio, retornaremos por e-mail ou WhatsApp.
                      </p>
                      <Button type="submit">Enviar solicitação</Button>
                    </div>
                  </form>
                </Form>
              </article>

              <aside className="p-6 md:p-8 rounded-lg border border-border/60 bg-secondary/20">
                <h2 className="font-serif text-xl mb-3">Como funciona</h2>
                <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                  <li>Você envia a ideia com o máximo de detalhes possível.</li>
                  <li>Avaliamos a viabilidade técnica e o prazo.</li>
                  <li>Enviamos o orçamento e combinamos a produção.</li>
                </ol>
                <div className="mt-6 text-sm text-muted-foreground">
                  Observação: imagens enviadas serão salvas quando a integração com o Supabase Storage estiver ativa.
                </div>
              </aside>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
};

export default CustomOrder;
