import { MessageCircle } from 'lucide-react';

const WhatsAppFloat = () => {
  const handleWhatsAppClick = () => {
    // Substituir SEUNUMERO pelo número real da marca tudobacana
    const whatsappUrl = 'https://wa.me/SEUNUMERO?text=Olá! Vi suas cerâmicas no site e gostaria de saber mais 😊';
    window.open(whatsappUrl, '_blank');
  };

  return (
    <button
      onClick={handleWhatsAppClick}
      className="whatsapp-float group animate-float"
      aria-label="Conversar pelo WhatsApp"
    >
      <MessageCircle className="w-6 h-6 transition-transform duration-300 group-hover:scale-110" />
      
      {/* Tooltip */}
      <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-sm px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
        Fale conosco no WhatsApp
        <div className="absolute left-full top-1/2 -translate-y-1/2 border-l-4 border-l-gray-900 border-y-4 border-y-transparent"></div>
      </div>
    </button>
  );
};

export default WhatsAppFloat;