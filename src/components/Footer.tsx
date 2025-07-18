import { Heart, Instagram, Mail } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-primary-foreground py-12">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-6">
          {/* Brand */}
          <div>
            <h3 className="font-serif text-3xl font-bold mb-2">tudobacana</h3>
            <p className="font-serif text-lg opacity-90">cerâmicas artesanais</p>
          </div>

          {/* Divider */}
          <div className="w-24 h-px bg-primary-foreground/30 mx-auto"></div>

          {/* Description */}
          <p className="max-w-md mx-auto text-primary-foreground/80 leading-relaxed">
            Cada peça é criada com amor e dedicação, trazendo charme e 
            delicadeza para sua casa. Porque cada pessoa é única.
          </p>

          {/* Social Links */}
          <div className="flex justify-center space-x-6">
            <a 
              href="https://instagram.com/tudobacanasp" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center space-x-2 hover:opacity-80 transition-opacity duration-300"
            >
              <Instagram className="w-5 h-5" />
              <span>@tudobacanasp</span>
            </a>
            
            <a 
              href="mailto:contato@tudobacana.com" 
              className="flex items-center space-x-2 hover:opacity-80 transition-opacity duration-300"
            >
              <Mail className="w-5 h-5" />
              <span>contato@tudobacana.com</span>
            </a>
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-primary-foreground/20"></div>

          {/* Copyright */}
          <div className="text-sm text-primary-foreground/60 space-y-2">
            <p className="flex items-center justify-center">
              © {currentYear} tudobacana. Feito com 
              <Heart className="w-4 h-4 mx-1 fill-current" /> 
              em São Paulo
            </p>
            <p>
              Todas as peças são únicas e podem apresentar pequenas variações, 
              que fazem parte do charme artesanal.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;