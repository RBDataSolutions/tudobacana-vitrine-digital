import { useState } from 'react';
import { Send, Mail, User, MessageSquare } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { useToast } from '../hooks/use-toast';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    mensagem: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulação de envio - substituir pela integração com Supabase
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Mensagem enviada! 🎉",
        description: "Obrigada pelo contato! Responderemos em breve.",
      });

      // Reset form
      setFormData({
        nome: '',
        email: '',
        mensagem: ''
      });
    } catch (error) {
      toast({
        title: "Ops! Algo deu errado",
        description: "Tente novamente ou entre em contato pelo WhatsApp.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-16 md:py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="brand-title text-3xl md:text-4xl lg:text-5xl mb-4">
              Fale com a gente
            </h2>
            <p className="brand-body text-lg md:text-xl">
              Tem alguma dúvida ou quer fazer um pedido especial? 
              Adoramos conversar sobre nossas cerâmicas!
            </p>
          </div>

          {/* Contact Form */}
          <div className="card-elegant animate-scale-in">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Nome */}
              <div className="space-y-2">
                <label htmlFor="nome" className="text-sm font-medium text-foreground flex items-center">
                  <User className="w-4 h-4 mr-2 text-primary" />
                  Nome completo
                </label>
                <Input
                  id="nome"
                  name="nome"
                  type="text"
                  value={formData.nome}
                  onChange={handleInputChange}
                  placeholder="Como você gostaria de ser chamado(a)?"
                  required
                  className="h-12 border-border/50 focus:border-primary transition-colors duration-300"
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-foreground flex items-center">
                  <Mail className="w-4 h-4 mr-2 text-primary" />
                  E-mail
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="seuemail@exemplo.com"
                  required
                  className="h-12 border-border/50 focus:border-primary transition-colors duration-300"
                />
              </div>

              {/* Mensagem */}
              <div className="space-y-2">
                <label htmlFor="mensagem" className="text-sm font-medium text-foreground flex items-center">
                  <MessageSquare className="w-4 h-4 mr-2 text-primary" />
                  Mensagem
                </label>
                <Textarea
                  id="mensagem"
                  name="mensagem"
                  value={formData.mensagem}
                  onChange={handleInputChange}
                  placeholder="Conte-nos sobre o que você está procurando, suas ideias ou qualquer dúvida que tenha..."
                  required
                  rows={5}
                  className="resize-none border-border/50 focus:border-primary transition-colors duration-300"
                />
              </div>

              {/* Submit Button */}
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full btn-brand h-12 text-lg"
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Enviando...
                  </div>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Enviar mensagem
                  </>
                )}
              </Button>
            </form>

            {/* Alternative Contact */}
            <div className="mt-8 pt-6 border-t border-border/30 text-center">
              <p className="brand-body text-sm mb-4">
                Prefere conversar direto pelo WhatsApp?
              </p>
              <Button 
                variant="outline" 
                size="sm"
                className="btn-outline-brand"
                onClick={() => window.open('https://wa.me/SEUNUMERO', '_blank')}
              >
                Chamar no WhatsApp
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;