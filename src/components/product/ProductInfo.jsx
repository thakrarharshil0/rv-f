import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart, Star, ChevronRight, Ticket, Check, X, Copy } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import api from "@/lib/api";
import { toast } from "sonner";

const ProductInfo = ({ product }) => {
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedLength, setSelectedLength] = useState("");
  const [coupons, setCoupons] = useState([]);
  const [showCouponsModal, setShowCouponsModal] = useState(false);
  const [copiedCode, setCopiedCode] = useState(null);
  const { addToCart } = useCart();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  
  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const res = await api.discounts.getPublic();
        if (Array.isArray(res)) {
          setCoupons(res);
        }
      } catch (err) {
        console.warn("Failed to fetch public coupons:", err);
      }
    };
    fetchCoupons();
  }, []);

  const toggleFavorite = () => {
    if (isFavorite(product.id)) {
      removeFromFavorites(product.id);
    } else {
      addToFavorites(product);
    }
  };

  const [showSizeChart, setShowSizeChart] = useState(false);
  const [activeChartTab, setActiveChartTab] = useState("bottoms"); // 'bottoms' or 'tops'

  const sizes = ["28", "30", "32", "34", "36", "38", "40"];
  const lengths = ["30", "32", "34"];

  const discount = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
    : 0;

  // Dynamically calculate loyalty reward points (e.g., 1 point per ₹100 spent, minimum 10)
  const productPrice = parseFloat(product.price) || 0;
  const rewardPoints = Math.max(10, Math.round(productPrice * 0.02)); // 2% reward points value

  // Best offer: take the top active coupon from backend or fallback to general promo
  const bestOffer = coupons.length > 0 ? coupons[0] : {
    code: "ROYAL10",
    title: "Special Welcome Offer",
    description: "Get 10% instant discount on orders above ₹1,999",
  };

  const copyCoupon = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success(`Coupon code ${code} copied to clipboard!`);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const handleAddToCart = () => {
    if (!selectedSize) return;

    // Combine size and length (e.g., "38 / L32" or store length separately)
    const formattedSize = selectedLength ? `${selectedSize} / L${selectedLength}` : selectedSize;

    addToCart({
      ...product,
      quantity: 1,
      size: formattedSize,
      length: selectedLength || null,
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-xl md:text-2xl font-bold text-black uppercase tracking-tight leading-tight">
          {product.name}
        </h1>
        
        {/* Rating */}
        <div className="flex items-center gap-1 mt-2">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={14} className="text-gray-300 fill-gray-300" />
            ))}
          </div>
          <span className="text-xs text-gray-500 font-light">(0)</span>
        </div>
      </div>

      {/* Price */}
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          {product.originalPrice && (
            <span className="text-gray-500 line-through text-base">₹{parseFloat(product.originalPrice).toLocaleString("en-IN")}.00</span>
          )}
          <span className="text-xl font-bold text-black">₹{parseFloat(product.price).toLocaleString("en-IN")}.00</span>
          {discount > 0 && (
            <span className="text-[#C41230] font-bold text-base">{discount}% OFF</span>
          )}
        </div>
        <p className="text-[10px] text-gray-500 italic">Incl. of all taxes</p>
      </div>

      {/* Offers Section */}
      <div className="space-y-2 py-4">
        <div className="border border-gray-200 rounded-lg p-4 space-y-3 relative overflow-hidden bg-white">
          <div className="absolute top-0 left-0 w-1 h-full bg-[#C41230]" />
          
          {/* Best Coupon Offer */}
          <div 
            onClick={() => copyCoupon(bestOffer.code)} 
            className="flex items-center justify-between group cursor-pointer hover:bg-gray-50/70 p-1.5 -m-1.5 rounded-md transition-colors"
            title="Click to copy coupon code"
          >
            <div className="flex items-center gap-3">
              <div className="bg-[#C41230]/10 p-1.5 rounded">
                <span className="text-[10px] font-bold text-[#C41230] uppercase">BEST OFFER</span>
              </div>
              <div>
                <p className="text-sm font-bold text-black flex items-center gap-2">
                  {bestOffer.code}
                  {copiedCode === bestOffer.code ? (
                    <span className="text-[10px] text-green-600 font-normal flex items-center gap-0.5">
                      <Check size={11} /> Copied
                    </span>
                  ) : (
                    <span className="text-[10px] text-gray-400 font-normal">Tap to copy</span>
                  )}
                </p>
                <p className="text-xs text-gray-500">{bestOffer.description}</p>
              </div>
            </div>
            <Copy size={15} className="text-gray-400 group-hover:text-black transition-colors" />
          </div>

          <div className="h-[1px] bg-gray-100" />

          {/* Dynamic Loyalty Reward Points */}
          <div className="flex items-center justify-between group cursor-default p-1.5 -m-1.5">
            <div className="flex items-center gap-3">
              <div className="bg-red-50 p-1 rounded-full">
                <div className="w-5 h-5 bg-[#C41230] rounded-full flex items-center justify-center text-white text-[9px] font-black shadow-xs">
                  R
                </div>
              </div>
              <p className="text-sm text-gray-600">
                Earn <span className="font-bold text-black">{rewardPoints} <span className="text-[#C41230]">Royal</span>Points</span> on this purchase
              </p>
            </div>
            <span className="text-[10px] font-semibold text-gray-400">1 pt = ₹1</span>
          </div>

          <div className="h-[1px] bg-gray-100" />

          {/* View All Coupons Button */}
          <button 
            type="button"
            onClick={() => setShowCouponsModal(true)} 
            className="w-full text-left flex items-center justify-between group hover:text-[#C41230] transition-colors pt-0.5 cursor-pointer"
          >
            <span className="text-sm text-gray-700 font-semibold group-hover:text-[#C41230] transition-colors flex items-center gap-2">
              <Ticket size={15} className="text-[#C41230]" />
              View All Coupons {coupons.length > 0 && `(${coupons.length})`}
            </span>
            <ChevronRight size={16} className="text-gray-400 group-hover:text-[#C41230] transition-colors" />
          </button>
        </div>
      </div>

      {/* All Coupons Modal */}
      {showCouponsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl p-6 relative space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Ticket className="text-[#C41230]" size={20} />
                <h3 className="font-bold text-base text-gray-900">Available Coupons & Offers</h3>
              </div>
              <button 
                onClick={() => setShowCouponsModal(false)}
                className="p-1 rounded-full hover:bg-gray-100 text-gray-500 hover:text-black transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3">
              {coupons.length === 0 ? (
                <div className="p-4 border border-dashed rounded-xl text-center space-y-2">
                  <p className="text-sm font-semibold text-gray-800">{bestOffer.code}</p>
                  <p className="text-xs text-gray-500">{bestOffer.description}</p>
                  <Button 
                    onClick={() => copyCoupon(bestOffer.code)} 
                    variant="outline" 
                    size="sm" 
                    className="w-full text-xs font-bold"
                  >
                    {copiedCode === bestOffer.code ? 'COPIED!' : 'COPY CODE'}
                  </Button>
                </div>
              ) : (
                coupons.map((coupon) => (
                  <div key={coupon.id} className="p-3.5 border border-gray-200 rounded-xl space-y-2 hover:border-[#C41230] transition-colors">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="font-mono text-sm font-black text-black bg-gray-100 px-2 py-0.5 rounded border border-gray-300">
                          {coupon.code}
                        </span>
                        <p className="text-xs font-bold text-gray-900 mt-1">{coupon.title}</p>
                      </div>
                      <span className="text-[10px] font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded">
                        Active
                      </span>
                    </div>
                    <p className="text-xs text-gray-600">{coupon.description}</p>
                    <div className="pt-2 flex items-center justify-between">
                      <span className="text-[11px] text-gray-400">
                        {coupon.minimumOrderTotal > 0 ? `Min purchase ₹${coupon.minimumOrderTotal}` : 'No minimum order'}
                      </span>
                      <Button
                        onClick={() => copyCoupon(coupon.code)}
                        variant="secondary"
                        size="sm"
                        className="text-xs font-bold py-1 px-3"
                      >
                        {copiedCode === coupon.code ? 'COPIED' : 'APPLY CODE'}
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Size Chart Modal */}
      {showSizeChart && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl p-6 relative space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-black"><path d="M7 11v8a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1h3a4 4 0 0 0 4-4V4a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v3a4 4 0 0 0 4 4h3a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-8" /></svg>
                <h3 className="font-bold text-base text-gray-900 uppercase tracking-wide">Size & Measurement Guide</h3>
              </div>
              <button 
                onClick={() => setShowSizeChart(false)}
                className="p-1 rounded-full hover:bg-gray-100 text-gray-500 hover:text-black transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Tab switch */}
            <div className="flex border-b border-gray-200">
              <button
                type="button"
                onClick={() => setActiveChartTab("bottoms")}
                className={`py-2 px-4 text-xs font-bold border-b-2 transition-colors uppercase ${
                  activeChartTab === "bottoms" 
                    ? "border-black text-black" 
                    : "border-transparent text-gray-400 hover:text-gray-700"
                }`}
              >
                Bottoms / Jeans / Pants (inches)
              </button>
              <button
                type="button"
                onClick={() => setActiveChartTab("tops")}
                className={`py-2 px-4 text-xs font-bold border-b-2 transition-colors uppercase ${
                  activeChartTab === "tops" 
                    ? "border-black text-black" 
                    : "border-transparent text-gray-400 hover:text-gray-700"
                }`}
              >
                Tops / Shirts (inches)
              </button>
            </div>

            {/* Table Content */}
            {activeChartTab === "bottoms" ? (
              <div className="space-y-4">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse border border-gray-200">
                    <thead className="bg-gray-50 text-gray-700">
                      <tr>
                        <th className="border border-gray-200 p-2.5 font-bold">Waist Size</th>
                        <th className="border border-gray-200 p-2.5 font-bold">Waist (in)</th>
                        <th className="border border-gray-200 p-2.5 font-bold">Hip (in)</th>
                        <th className="border border-gray-200 p-2.5 font-bold">Thigh (in)</th>
                        <th className="border border-gray-200 p-2.5 font-bold">Length Options</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {[
                        { size: "28", waist: "28 - 29", hip: "35 - 36", thigh: "21", length: "30, 32" },
                        { size: "30", waist: "30 - 31", hip: "37 - 38", thigh: "22", length: "30, 32, 34" },
                        { size: "32", waist: "32 - 33", hip: "39 - 40", thigh: "23", length: "30, 32, 34" },
                        { size: "34", waist: "34 - 35", hip: "41 - 42", thigh: "24", length: "30, 32, 34" },
                        { size: "36", waist: "36 - 37", hip: "43 - 44", thigh: "25", length: "32, 34" },
                        { size: "38", waist: "38 - 39", hip: "45 - 46", thigh: "26", length: "32, 34" },
                        { size: "40", waist: "40 - 41", hip: "47 - 48", thigh: "27", length: "32, 34" },
                      ].map((row) => (
                        <tr 
                          key={row.size} 
                          className={`hover:bg-gray-50 ${selectedSize === row.size ? 'bg-amber-50/60 font-semibold' : ''}`}
                        >
                          <td className="border border-gray-200 p-2.5 font-bold">{row.size} {selectedSize === row.size && '✓'}</td>
                          <td className="border border-gray-200 p-2.5 text-gray-600">{row.waist}</td>
                          <td className="border border-gray-200 p-2.5 text-gray-600">{row.hip}</td>
                          <td className="border border-gray-200 p-2.5 text-gray-600">{row.thigh}</td>
                          <td className="border border-gray-200 p-2.5 text-gray-600">{row.length}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg text-[11px] text-gray-500 space-y-1">
                  <p className="font-semibold text-gray-700">How to Measure:</p>
                  <p>• <strong>Waist:</strong> Measure around natural waistline where your trousers normally sit.</p>
                  <p>• <strong>Inseam Length:</strong> Measure from the top of interior leg seam down to the ankle hem.</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse border border-gray-200">
                    <thead className="bg-gray-50 text-gray-700">
                      <tr>
                        <th className="border border-gray-200 p-2.5 font-bold">Size</th>
                        <th className="border border-gray-200 p-2.5 font-bold">Chest (in)</th>
                        <th className="border border-gray-200 p-2.5 font-bold">Shoulder (in)</th>
                        <th className="border border-gray-200 p-2.5 font-bold">Length (in)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {[
                        { size: "S", chest: "36 - 38", shoulder: "17.5", length: "27.5" },
                        { size: "M", chest: "38 - 40", shoulder: "18.2", length: "28.5" },
                        { size: "L", chest: "41 - 43", shoulder: "19.0", length: "29.5" },
                        { size: "XL", chest: "44 - 46", shoulder: "19.8", length: "30.5" },
                        { size: "XXL", chest: "47 - 49", shoulder: "20.5", length: "31.5" },
                      ].map((row) => (
                        <tr key={row.size} className="hover:bg-gray-50">
                          <td className="border border-gray-200 p-2.5 font-bold">{row.size}</td>
                          <td className="border border-gray-200 p-2.5 text-gray-600">{row.chest}</td>
                          <td className="border border-gray-200 p-2.5 text-gray-600">{row.shoulder}</td>
                          <td className="border border-gray-200 p-2.5 text-gray-600">{row.length}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <Button 
                onClick={() => setShowSizeChart(false)}
                className="bg-black text-white px-6 h-9 text-xs font-bold rounded-none uppercase"
              >
                Close Guide
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Size Selector */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-black uppercase">Size</h3>
            {selectedSize && (
              <span className="text-xs text-gray-500 font-medium">({selectedSize})</span>
            )}
          </div>
          <button 
            type="button"
            onClick={() => setShowSizeChart(true)}
            className="text-xs font-bold text-black underline flex items-center gap-1 hover:text-[#C41230] transition-colors cursor-pointer"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-0.5"><path d="M7 11v8a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1h3a4 4 0 0 0 4-4V4a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v3a4 4 0 0 0 4 4h3a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-8" /></svg>
            SIZE CHART
          </button>
        </div>
        <div className="grid grid-cols-7 gap-2">
          {sizes.map((size) => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              className={`h-10 border text-sm transition-all ${
                selectedSize === size 
                  ? "border-black bg-black text-white font-bold" 
                  : "border-gray-200 text-gray-600 hover:border-gray-400"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Length Selector */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-bold text-black uppercase">Length</h3>
          {selectedLength ? (
            <span className="text-xs text-gray-500 font-medium">({selectedLength})</span>
          ) : (
            <span className="text-xs text-gray-400 italic">(Optional)</span>
          )}
        </div>
        <div className="flex gap-2">
          {lengths.map((len) => (
            <button
              key={len}
              onClick={() => setSelectedLength(selectedLength === len ? "" : len)}
              className={`h-10 px-6 border text-sm transition-all ${
                selectedLength === len 
                  ? "border-black bg-black text-white font-bold" 
                  : "border-gray-200 text-gray-600 hover:border-gray-400"
              }`}
            >
              {len}
            </button>
          ))}
        </div>
      </div>

      {/* Add to Bag */}
      <div className="pt-6">
        <Button
          onClick={handleAddToCart}
          disabled={!selectedSize}
          className="w-full h-14 bg-black text-white hover:bg-black/90 font-bold text-base rounded-none tracking-widest disabled:opacity-50"
        >
          {selectedSize 
            ? `ADD TO BAG ${selectedLength ? `(SIZE ${selectedSize} • L${selectedLength})` : `(SIZE ${selectedSize})`}` 
            : "SELECT SIZE"}
        </Button>
      </div>
    </div>
  );
};

export default ProductInfo;
