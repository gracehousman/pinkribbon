import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User, Menu, X } from 'lucide-react';
import { Button } from '../ui/Button';

export function Navbar() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Simulate', path: '/profile' },
    { name: 'Find Centers', path: '/find-centers' },
    { name: 'About', path: '/about' },
    { name: 'Methodology', path: '/methodology' },
    { name: 'Data Sources', path: '/data-sources' },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container flex h-16 items-center px-4 mx-auto justify-between">
        <Link to="/" className="mr-6 flex items-center space-x-2">
          {/* Pink Ribbon Logo */}
          <svg width="32" height="32" viewBox="-1.37 1.172 406.495 406.495" xmlns="http://www.w3.org/2000/svg">
            <g fill="#E91E63" stroke="#ffffff" strokeWidth="2">
              <path d="M151.036 14.728c25.248-10.863 49.059-12.879 83.902-2.032 4.07 4.166-3.577 48.009-3.577 48.009-30.696-14.182-48.263-17.126-78.959 3.312.001 0-12.595-39.276-1.366-49.289z"/>
              <path d="M148.884 15.616c15.829-18.318 83.555-16.483 100.39-3.109s27.662 100.138-4.28 73.443c-31.942-26.695-57.746-26.199-94.475 5.068 0 0-17.464-57.083-1.635-75.402z"/>
              <path d="M253.848 21.385s-4.317-35.721 22.636 63.323c26.955 99.044-137.336 313.352-154.053 313.352l-81.177-33.15C222.173 204.117 258.487 48.529 253.848 21.385z"/>
              <path d="M144.968 29.993s4.907-35.721-25.729 63.323C88.604 192.36 275.333 406.667 294.333 406.667l68.308-56.148C200.202 251.725 139.696 57.137 144.968 29.993z"/>
            </g>
          </svg>
          <span className="font-bold text-xl tracking-tight">
            <span className="text-[#E91E63]">Pink</span>
            <span className="text-[#00BFB3]">Ribbon</span>
          </span>
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-1">
          {navLinks.map((link) => (
            <Button 
              key={link.path} 
              variant={location.pathname === link.path ? "secondary" : "ghost"} 
              size="sm" 
              asChild
              className={location.pathname === link.path ? "text-[#E91E63] bg-pink-50 hover:bg-pink-100" : ""}
            >
              <Link to={link.path}>{link.name}</Link>
            </Button>
          ))}
        </div>

        <div className="flex items-center space-x-2">
          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>

          <div className="hidden sm:flex items-center">
             <Button variant="ghost" size="sm" asChild>
                <Link to="/profile" className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                    <User className="h-4 w-4 text-slate-600" />
                  </div>
                </Link>
             </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t p-4 bg-white space-y-2 shadow-lg absolute w-full left-0">
          {navLinks.map((link) => (
            <Button 
              key={link.path} 
              variant="ghost" 
              className="w-full justify-start" 
              asChild
              onClick={() => setMobileMenuOpen(false)}
            >
              <Link to={link.path}>{link.name}</Link>
            </Button>
          ))}
        </div>
      )}
    </nav>
  );
}
