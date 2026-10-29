import { Mail, Instagram, Twitter, Facebook, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="w-full bg-white text-black pt-20 pb-8 px-6 border-t border-[#e5e5e5] mt-40">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Section */}
          <div className="space-y-6">
            <Link to="/" className="inline-block">
              <img src="/logo.png" alt="Logo" className="h-16 w-auto object-contain" />
            </Link>
            <p className="text-black/60 text-sm leading-relaxed max-w-xs">
              Elevating everyday essentials with a commitment to quality, style, and sustainable craftsmanship.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="p-2 border border-black/10 rounded-full hover:bg-black/5 transition-colors group">
                <Instagram size={18} className="text-black/40 group-hover:text-black transition-colors" />
              </a>
              <a href="#" className="p-2 border border-black/10 rounded-full hover:bg-black/5 transition-colors group">
                <Twitter size={18} className="text-black/40 group-hover:text-black transition-colors" />
              </a>
              <a href="#" className="p-2 border border-black/10 rounded-full hover:bg-black/5 transition-colors group">
                <Facebook size={18} className="text-black/40 group-hover:text-black transition-colors" />
              </a>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] mb-6 text-black/90">Shop</h4>
            <ul className="space-y-4">
              <li><Link to="/category/jeans" className="text-sm text-black/60 hover:text-black transition-colors">Jeans</Link></li>
              <li><Link to="/category/trousers" className="text-sm text-black/60 hover:text-black transition-colors">Trousers</Link></li>
              <li><Link to="/category/shorts" className="text-sm text-black/60 hover:text-black transition-colors">Shorts</Link></li>
              <li><Link to="/category/new-in" className="text-sm text-black/60 hover:text-black transition-colors">New Arrivals</Link></li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] mb-6 text-black/90">Customer Care</h4>
            <ul className="space-y-4">
              <li><Link to="/about/size-guide" className="text-sm text-black/60 hover:text-black transition-colors">Size Guide</Link></li>
              <li><Link to="/about/customer-care" className="text-sm text-black/60 hover:text-black transition-colors">Shipping & Returns</Link></li>
              <li><Link to="/about/customer-care" className="text-sm text-black/60 hover:text-black transition-colors">Contact Us</Link></li>
              <li><Link to="/about/our-story" className="text-sm text-black/60 hover:text-black transition-colors">Our Story</Link></li>
            </ul>
          </div>

          {/* Newsletter Section */}
          <div className="bg-secondary/50 p-8 rounded-2xl border border-black/5">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] mb-4 text-black/90">Newsletter</h4>
            <p className="text-xs text-black/50 mb-6 leading-relaxed">
              Join our mailing list for exclusive offers and news from the atelier.
            </p>
            <form className="relative group">
              <input 
                type="email" 
                placeholder="Email Address" 
                className="w-full bg-white border border-black/10 rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-black/5 transition-all placeholder:text-black/30"
              />
              <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-black text-white rounded-lg hover:scale-105 transition-transform active:scale-95">
                <ArrowRight size={18} />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-black/5">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="flex flex-col md:flex-row items-center md:space-x-8 space-y-2 md:space-y-0">
              <p className="text-[10px] uppercase tracking-[0.2em] text-black/40 font-medium">
                © 2026 ROYAL VIRTUS. All Rights Reserved.
              </p>
              <div className="flex space-x-6">
                <Link to="/privacy-policy" className="text-[10px] uppercase tracking-[0.2em] text-black/40 hover:text-black transition-colors">Privacy</Link>
                <Link to="/terms-of-service" className="text-[10px] uppercase tracking-[0.2em] text-black/40 hover:text-black transition-colors">Terms</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
