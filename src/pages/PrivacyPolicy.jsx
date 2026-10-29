import { useEffect } from "react";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";

const PrivacyPolicy = () => {
  useEffect(() => {
    document.title = "Privacy Policy - Royal Virtus";
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-6 py-20">
          <header className="mb-16 text-center">
            <h1 className="text-5xl font-display mb-6 tracking-tight">Privacy Policy</h1>
            <p className="text-muted-foreground font-light italic">Last updated: April 26, 2026</p>
          </header>

          <div className="prose prose-neutral max-w-none space-y-12 text-foreground/80 font-light leading-relaxed">
            <section>
              <h2 className="text-2xl font-medium text-foreground mb-6 uppercase tracking-wider">1. Commitment to Privacy</h2>
              <p>
                At <strong>Royal Virtus</strong>, we are committed to maintaining the trust and confidence of our visitors to our web site. In particular, we want you to know that Royal Virtus is not in the business of selling, renting or trading email lists with other companies and businesses for marketing purposes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-medium text-foreground mb-6 uppercase tracking-wider">2. Information We Collect</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-3">Directly Provided Data</h3>
                  <p>
                    When you make a purchase or attempt to make a purchase through Royal Virtus, we collect certain information from you, including your name, billing address, shipping address, payment information (including credit card numbers), email address, and phone number.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-3">Device & Browsing Data</h3>
                  <p>
                    When you visit the Site, we automatically collect certain information about your device, including information about your web browser, IP address, time zone, and some of the cookies that are installed on your device.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-medium text-foreground mb-6 uppercase tracking-wider">3. How We Use Your Information</h2>
              <p className="mb-4">We use the Order Information that we collect generally to fulfill any orders placed through the Site. Additionally, we use this Order Information to:</p>
              <ul className="list-disc pl-6 space-y-3">
                <li>Communicate with you regarding your orders and inquiries.</li>
                <li>Screen our orders for potential risk or fraud.</li>
                <li>Provide you with information or advertising relating to our products or services when in line with the preferences you have shared with us.</li>
                <li>Optimize and improve our Site (for example, by generating analytics about how our customers browse and interact with the Site).</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-medium text-foreground mb-6 uppercase tracking-wider">4. Sharing Your Personal Information</h2>
              <p>
                We share your Personal Information with third parties to help us use your Personal Information, as described above. For example, we use Google Analytics to help us understand how our customers use the Site. We also use secure payment gateways to process your financial transactions safely.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-medium text-foreground mb-6 uppercase tracking-wider">5. Data Retention</h2>
              <p>
                When you place an order through the Site, we will maintain your Order Information for our records unless and until you ask us to delete this information.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-medium text-foreground mb-6 uppercase tracking-wider">6. Your Rights</h2>
              <p>
                If you are a resident of certain territories (such as the EU), you have the right to access personal information we hold about you and to ask that your personal information be corrected, updated, or deleted. If you would like to exercise this right, please contact us through the contact information below.
              </p>
            </section>

            <section className="bg-secondary/30 p-10 rounded-2xl border border-border">
              <h2 className="text-2xl font-medium text-foreground mb-6 uppercase tracking-wider">Contact Us</h2>
              <p className="mb-6 text-sm">
                For more information about our privacy practices, if you have questions, or if you would like to make a complaint, please contact us by e-mail at:
              </p>
              <div className="space-y-2 text-foreground font-medium">
                <p>Email: hello@royalvirtus.com</p>
                <p>Corporate Office: 123 Madison Avenue, New York, NY 10016</p>
              </div>
            </section>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
