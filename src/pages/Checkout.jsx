import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Minus, Plus, CreditCard, Check, Wallet, Banknote } from "lucide-react";
import Header from "../components/header/Header";
import { useCart } from "@/contexts/CartContext";
import Footer from "../components/footer/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/api";

const Checkout = () => {
  const [showDiscountInput, setShowDiscountInput] = useState(false);
  const [discountCode, setDiscountCode] = useState("");
  const [customerDetails, setCustomerDetails] = useState({
    email: "",
    firstName: "",
    lastName: "",
    phone: ""
  });
  const [shippingAddress, setShippingAddress] = useState({
    address: "",
    city: "",
    postalCode: "",
    country: ""
  });
  const [hasSeparateBilling, setHasSeparateBilling] = useState(false);
  const [billingDetails, setBillingDetails] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    country: ""
  });
  const [shippingOption, setShippingOption] = useState("standard");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [orderError, setOrderError] = useState("");
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: ""
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [appliedDiscount, setAppliedDiscount] = useState(null);
  const [discountError, setDiscountError] = useState("");
  const { user } = useAuth();
  const { cartItems, cartTotal, updateQuantity, clearCart } = useCart();

  useEffect(() => {
    if (user) {
      const nameParts = (user.name || "").split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";
      
      setCustomerDetails(prev => ({
        ...prev,
        email: user.email || prev.email,
        firstName: firstName || prev.firstName,
        lastName: lastName || prev.lastName
      }));
    }
  }, [user]);

  const subtotal = cartTotal;
  const getShippingCost = () => {
    switch (shippingOption) {
      case "express":
        return 15;
      case "overnight":
        return 35;
      default:
        return 0;
    }
  };
  const shipping = getShippingCost();
  
  const discountAmount = appliedDiscount 
    ? (appliedDiscount.type === 'percent' 
        ? (subtotal * (appliedDiscount.value / 100)) 
        : appliedDiscount.value)
    : 0;

  const total = subtotal + shipping - discountAmount;

  const handleDiscountSubmit = async () => {
    setDiscountError("");
    try {
      const response = await api.discounts.validate({ 
        code: discountCode,
        subtotal: subtotal 
      });
      if (response.discount) {
        setAppliedDiscount(response.discount);
        setShowDiscountInput(false);
      } else {
        setDiscountError("Invalid discount code");
      }
    } catch (error) {
      setDiscountError(error.message || "Failed to validate discount code");
    }
  };

  const handleCustomerDetailsChange = (field, value) => {
    setCustomerDetails((prev) => ({ ...prev, [field]: value }));
  };

  const handleShippingAddressChange = (field, value) => {
    setShippingAddress((prev) => ({ ...prev, [field]: value }));
  };

  const handleBillingDetailsChange = (field, value) => {
    setBillingDetails((prev) => ({ ...prev, [field]: value }));
  };

  const handlePaymentDetailsChange = (field, value) => {
    setPaymentDetails((prev) => ({ ...prev, [field]: value }));
  };

  const handleCompleteOrder = async () => {
    setOrderError("");
    if (!user) {
      setOrderError("Please log in before placing an order.");
      return;
    }

    setIsProcessing(true);
    try {
      await api.orders.create({
        customerDetails,
        shippingAddress,
        billingDetails: hasSeparateBilling ? billingDetails : null,
        shippingOption,
        paymentMethod,
        items: cartItems, // Important: send items too
        total: total
      });
      clearCart();
      setPaymentComplete(true);
    } catch (error) {
      setOrderError(error.message || "Failed to place order. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-6 pb-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Order Summary */}
            <div className="lg:col-span-1 lg:order-2">
              <div className="bg-muted/20 p-8 rounded-none sticky top-6">
                <h2 className="text-lg font-light text-foreground mb-6">Order Summary</h2>
                <div className="space-y-6">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="w-20 h-20 bg-muted rounded-none overflow-hidden">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-light text-foreground">{item.name}</h3>
                        {item.size && <p className="text-sm text-muted-foreground">Size: {item.size}</p>}
                        <div className="flex items-center gap-2 mt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="h-8 w-8 p-0 rounded-none border-muted-foreground/20"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="text-sm font-medium text-foreground min-w-[2ch] text-center">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="h-8 w-8 p-0 rounded-none border-muted-foreground/20"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <div className="text-foreground font-medium">
                        ₹{parseFloat(item.price).toLocaleString("en-IN")}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 pt-6 border-t-2 border-black">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold uppercase tracking-widest">Promotions</h3>
                    {!showDiscountInput && !appliedDiscount && (
                      <button 
                        onClick={() => setShowDiscountInput(true)} 
                        className="text-[10px] font-bold text-[#C41230] uppercase tracking-widest hover:underline"
                      >
                        Add Code +
                      </button>
                    )}
                  </div>

                  {showDiscountInput && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-3"
                    >
                      <div className="flex gap-2">
                        <Input
                          type="text"
                          value={discountCode}
                          onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                          placeholder="ENTER CODE"
                          className="rounded-none border-2 border-black h-12 uppercase font-bold tracking-widest"
                        />
                        <button 
                          onClick={handleDiscountSubmit} 
                          className="px-6 bg-black text-white font-bold uppercase tracking-widest text-xs hover:bg-gray-800 transition-colors"
                        >
                          Apply
                        </button>
                      </div>
                      {discountError && <p className="text-[10px] text-red-600 font-bold uppercase tracking-widest">{discountError}</p>}
                    </motion.div>
                  )}

                  {appliedDiscount && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-gray-50 border-2 border-dashed border-black p-4 relative"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Applied Discount</p>
                          <h4 className="text-sm font-bold uppercase tracking-tight">{appliedDiscount.code}</h4>
                          <p className="text-[10px] text-green-600 font-bold uppercase mt-1">
                            {appliedDiscount.type === 'percent' ? `${appliedDiscount.value}% OFF` : `₹${appliedDiscount.value} OFF`}
                          </p>
                        </div>
                        <button 
                          onClick={() => setAppliedDiscount(null)} 
                          className="text-gray-400 hover:text-black transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  )}

                  <div className="mt-6 space-y-2">
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest leading-relaxed">
                      * Only one discount code can be applied per order. Flash deals and bundle pricing are already reflected in the item prices.
                    </p>
                  </div>
                </div>

                <div className="border-t border-muted-foreground/20 mt-4 pt-6 space-y-2">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? "Free" : `₹${shipping}`}</span>
                  </div>
                  {appliedDiscount && (
                    <div className="flex justify-between text-sm text-green-600 font-medium">
                      <span>Discount ({appliedDiscount.code})</span>
                      <span>-₹{discountAmount.toLocaleString("en-IN")}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-xl font-bold border-t-2 border-black pt-4 text-black uppercase tracking-tighter">
                    <span>Total</span>
                    <span>₹{total.toLocaleString("en-IN")}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Checkout Forms */}
            <div className="lg:col-span-2 lg:order-1 space-y-8">
              <div className="bg-muted/20 p-8 rounded-none">
                <h2 className="text-lg font-light text-foreground mb-6">Customer Details</h2>
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input id="email" type="email" value={customerDetails.email} onChange={(e) => handleCustomerDetailsChange("email", e.target.value)} className="mt-2 rounded-none" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input id="firstName" value={customerDetails.firstName} onChange={(e) => handleCustomerDetailsChange("firstName", e.target.value)} className="mt-2 rounded-none" />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input id="lastName" value={customerDetails.lastName} onChange={(e) => handleCustomerDetailsChange("lastName", e.target.value)} className="mt-2 rounded-none" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" value={customerDetails.phone} onChange={(e) => handleCustomerDetailsChange("phone", e.target.value)} className="mt-2 rounded-none" />
                  </div>

                  <div className="border-t border-muted-foreground/20 pt-6 mt-8">
                    <h3 className="text-base font-light text-foreground mb-4">Shipping Address</h3>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="address">Address *</Label>
                        <Input id="address" value={shippingAddress.address} onChange={(e) => handleShippingAddressChange("address", e.target.value)} className="mt-2 rounded-none" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <Input placeholder="City *" value={shippingAddress.city} onChange={(e) => handleShippingAddressChange("city", e.target.value)} className="rounded-none" />
                        <Input placeholder="Postal Code *" value={shippingAddress.postalCode} onChange={(e) => handleShippingAddressChange("postalCode", e.target.value)} className="rounded-none" />
                      </div>
                      <Input placeholder="Country *" value={shippingAddress.country} onChange={(e) => handleShippingAddressChange("country", e.target.value)} className="rounded-none" />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 pt-4">
                    <Checkbox id="separateBilling" checked={hasSeparateBilling} onCheckedChange={(checked) => setHasSeparateBilling(checked === true)} />
                    <Label htmlFor="separateBilling" className="text-sm font-light cursor-pointer">Other billing address</Label>
                  </div>

                  {hasSeparateBilling && (
                    <div className="space-y-4 pt-4 border-t border-muted-foreground/20">
                      <h3 className="text-base font-light">Billing Details</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <Input placeholder="First Name *" value={billingDetails.firstName} onChange={(e) => handleBillingDetailsChange("firstName", e.target.value)} className="rounded-none" />
                        <Input placeholder="Last Name *" value={billingDetails.lastName} onChange={(e) => handleBillingDetailsChange("lastName", e.target.value)} className="rounded-none" />
                      </div>
                      <Input placeholder="Address *" value={billingDetails.address} onChange={(e) => handleBillingDetailsChange("address", e.target.value)} className="rounded-none" />
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-muted/20 p-8 rounded-none">
                <h2 className="text-lg font-light text-foreground mb-6">Shipping Options</h2>
                <RadioGroup value={shippingOption} onValueChange={setShippingOption} className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-muted-foreground/20 rounded-none">
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="standard" id="standard" />
                      <Label htmlFor="standard">Standard Shipping (Free)</Label>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 border border-muted-foreground/20 rounded-none">
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="express" id="express" />
                      <Label htmlFor="express">Express Shipping (₹15)</Label>
                    </div>
                  </div>
                </RadioGroup>
              </div>

              <div className="bg-muted/20 p-8 rounded-none">
                <h2 className="text-lg font-light text-foreground mb-6">Payment Method</h2>
                {!paymentComplete ? (
                  <div className="space-y-6">
                    <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="grid grid-cols-3 gap-4">
                      <div>
                        <RadioGroupItem value="card" id="card" className="sr-only peer" />
                        <Label htmlFor="card" className="flex flex-col items-center p-4 border-2 rounded-md cursor-pointer peer-data-[state=checked]:border-primary">
                          <CreditCard className="mb-2 h-6 w-6" /> Card
                        </Label>
                      </div>
                      <div>
                        <RadioGroupItem value="upi" id="upi" className="sr-only peer" />
                        <Label htmlFor="upi" className="flex flex-col items-center p-4 border-2 rounded-md cursor-pointer peer-data-[state=checked]:border-primary">
                          <Wallet className="mb-2 h-6 w-6" /> UPI
                        </Label>
                      </div>
                      <div>
                        <RadioGroupItem value="cod" id="cod" className="sr-only peer" />
                        <Label htmlFor="cod" className="flex flex-col items-center p-4 border-2 rounded-md cursor-pointer peer-data-[state=checked]:border-primary">
                          <Banknote className="mb-2 h-6 w-6" /> COD
                        </Label>
                      </div>
                    </RadioGroup>

                    {paymentMethod === "card" && (
                      <div className="space-y-4 animate-in fade-in slide-in-from-top-4">
                        <Input placeholder="Cardholder Name *" value={paymentDetails.cardholderName} onChange={(e) => handlePaymentDetailsChange("cardholderName", e.target.value)} className="rounded-none" />
                        <Input placeholder="Card Number *" value={paymentDetails.cardNumber} onChange={(e) => handlePaymentDetailsChange("cardNumber", e.target.value)} className="rounded-none" />
                        <div className="grid grid-cols-2 gap-4">
                          <Input placeholder="MM/YY *" value={paymentDetails.expiryDate} onChange={(e) => handlePaymentDetailsChange("expiryDate", e.target.value)} className="rounded-none" />
                          <Input placeholder="CVV *" value={paymentDetails.cvv} onChange={(e) => handlePaymentDetailsChange("cvv", e.target.value)} className="rounded-none" />
                        </div>
                      </div>
                    )}

                    <Button onClick={handleCompleteOrder} disabled={isProcessing} className="w-full rounded-none h-12 text-base">
                      {isProcessing ? "Processing..." : `Complete Order \u2022 \u20B9${total.toLocaleString("en-IN")}`}
                    </Button>
                    {orderError && <p className="text-sm text-red-500 mt-2">{orderError}</p>}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                      <Check className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-light text-foreground mb-2">Order Complete!</h3>
                    <p className="text-muted-foreground">Confirmation sent to your email.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Checkout;
