import { useEffect } from "react";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";

const TermsOfService = () => {
  useEffect(() => {
    document.title = "Terms of Service - Royal Virtus";
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-6 py-20">
          <header className="mb-16 text-center">
            <h1 className="text-5xl font-display mb-6 tracking-tight">Terms of Service</h1>
            <p className="text-muted-foreground font-light italic">Last updated: April 26, 2026</p>
          </header>

          <div className="prose prose-neutral max-w-none space-y-12 text-foreground/80 font-light leading-relaxed">
            <section>
              <h2 className="text-2xl font-medium text-foreground mb-6 uppercase tracking-wider">1. Acceptance of Terms</h2>
              <p>
                By accessing and using the Royal Virtus website, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you must not use our website or services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-medium text-foreground mb-6 uppercase tracking-wider">2. Use of the Site</h2>
              <p>
                You may use our Site only for lawful purposes. You are prohibited from violating or attempting to violate the security of the Site, including, without limitation, accessing data not intended for you or logging onto a server or an account which you are not authorized to access.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-medium text-foreground mb-6 uppercase tracking-wider">3. Products & Pricing</h2>
              <p>
                All products listed on the Site, their descriptions, and their prices are subject to change at any time. Royal Virtus reserves the right, at any time, to modify, suspend, or discontinue the sale of any product with or without notice.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-medium text-foreground mb-6 uppercase tracking-wider">4. Orders & Payment</h2>
              <p>
                By placing an order, you are offering to purchase a product. All orders are subject to availability and confirmation of the order price. We reserve the right to refuse any order you place with us. In the event that we make a change to or cancel an order, we may attempt to notify you by contacting the e-mail and/or billing address/phone number provided at the time the order was made.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-medium text-foreground mb-6 uppercase tracking-wider">5. Shipping & Delivery</h2>
              <p>
                Delivery times may vary according to availability and any guarantees or representations made as to delivery times are subject to any delays resulting from postal delays or force majeure for which we will not be responsible.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-medium text-foreground mb-6 uppercase tracking-wider">6. Intellectual Property</h2>
              <p>
                The intellectual property rights in all software and content made available to you on or through this Website remain the property of Royal Virtus and are protected by copyright laws and treaties around the world. All such rights are reserved by Royal Virtus.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-medium text-foreground mb-6 uppercase tracking-wider">7. Limitation of Liability</h2>
              <p>
                Royal Virtus will not be liable for any damages of any kind arising from the use of this site, including, but not limited to direct, indirect, incidental, punitive, and consequential damages.
              </p>
            </section>

            <section className="bg-secondary/30 p-10 rounded-2xl border border-border">
              <h2 className="text-2xl font-medium text-foreground mb-6 uppercase tracking-wider">Contact Information</h2>
              <p className="mb-6 text-sm">
                Questions about the Terms of Service should be sent to us at:
              </p>
              <div className="space-y-2 text-foreground font-medium">
                <p>Email: legal@royalvirtus.com</p>
                <p>Address: 123 Madison Avenue, New York, NY 10016</p>
              </div>
            </section>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default TermsOfService;
