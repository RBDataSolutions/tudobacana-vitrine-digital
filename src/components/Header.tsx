import { useState } from 'react';
import { LogIn, User } from 'lucide-react';
import { Button } from './ui/button';

const Header = () => {
  const [isAdmin, setIsAdmin] = useState(false);

  return (
    <header className="bg-background border-b border-border/50 sticky top-0 z-40 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          {/* Logo/Brand */}
          <div className="text-center flex-1">
            <h1 className="brand-title text-4xl md:text-5xl lg:text-6xl">
              tudobacana
            </h1>
            <p className="brand-subtitle text-sm md:text-base mt-1 tracking-wide">
              cerâmicas artesanais
            </p>
          </div>
          
          {/* Admin Button */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            {!isAdmin ? (
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                <LogIn className="w-4 h-4 mr-2" />
                Admin
              </Button>
            ) : (
              <Button variant="ghost" size="sm" className="text-primary">
                <User className="w-4 h-4 mr-2" />
                Painel
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;