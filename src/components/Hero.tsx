import { Link } from "react-router-dom";
import { Button } from "./ui/button";

const Hero = () => {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-background to-secondary/30">
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-3xl mx-auto animate-fade-in">
          <h2 className="brand-subtitle text-2xl md:text-3xl lg:text-4xl mb-8 leading-relaxed">
            "Cerâmicas feitas à mão com charme e delicadeza.<br />
            <span className="text-primary">Cada peça é única</span> — como você."
          </h2>
          
          <div className="w-24 h-1 bg-primary mx-auto rounded-full mb-8"></div>
          
          <p className="brand-body text-lg md:text-xl max-w-2xl mx-auto">
            Descubra nossa coleção exclusiva de peças em cerâmica fria, 
            criadas com amor e dedicação para transformar sua casa em um lar ainda mais especial.
          </p>

          <div className="mt-8">
            <Button asChild>
              <Link to="/personalizados">Peça um personalizado</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;