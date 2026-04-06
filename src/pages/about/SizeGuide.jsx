import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import PageHeader from "../../components/about/PageHeader";
import ContentSection from "../../components/about/ContentSection";
import { Button } from "../../components/ui/button";
import AboutSidebar from "../../components/about/AboutSidebar";
const SizeGuide = () => {
  return <div className="min-h-screen bg-background">
      <Header />

      <div className="flex">
        <div className="hidden lg:block">
          <AboutSidebar />
        </div>

        <main className="w-full lg:w-[70vw] lg:ml-auto px-6">
          <PageHeader
    title="Size Guide"
    subtitle="Find your perfect fit with our comprehensive sizing guide"
  />

          <ContentSection title="Clothing Sizing">
            <div className="space-y-12">
              <div className="bg-muted/10 rounded-lg p-8">
                <h3 className="text-xl font-light text-foreground mb-6">How to Measure</h3>
                <div className="grid md:grid-cols-3 gap-8">
                  <div className="space-y-2">
                    <h4 className="font-medium text-foreground">Chest</h4>
                    <p className="text-sm text-muted-foreground">Measure around the fullest part of your chest, keeping the tape measure horizontal.</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium text-foreground">Waist</h4>
                    <p className="text-sm text-muted-foreground">Measure around your natural waistline, the narrowest part of your waist.</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium text-foreground">Hips</h4>
                    <p className="text-sm text-muted-foreground">Measure around the fullest part of your hips, standing with feet together.</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-xl font-light text-foreground">Tops & Jackets</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-border">
                    <thead>
                      <tr className="bg-muted/20">
                        <th className="border border-border p-3 text-left font-light">Size</th>
                        <th className="border border-border p-3 text-left font-light">US</th>
                        <th className="border border-border p-3 text-left font-light">Chest (in)</th>
                        <th className="border border-border p-3 text-left font-light">Waist (in)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
    { size: "XS", us: "0-2", chest: "31-32", waist: "24-25" },
    { size: "S", us: "4-6", chest: "33-34", waist: "26-27" },
    { size: "M", us: "8-10", chest: "35-36", waist: "28-29" },
    { size: "L", us: "12-14", chest: "37-39", waist: "30-32" },
    { size: "XL", us: "16", chest: "40-42", waist: "33-35" }
  ].map((row, index) => <tr key={index} className="hover:bg-muted/10">
                          <td className="border border-border p-3">{row.size}</td>
                          <td className="border border-border p-3">{row.us}</td>
                          <td className="border border-border p-3">{row.chest}</td>
                          <td className="border border-border p-3">{row.waist}</td>
                        </tr>)}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-xl font-light text-foreground">Bottoms (Pants, Jeans, Shorts)</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-border">
                    <thead>
                      <tr className="bg-muted/20">
                        <th className="border border-border p-3 text-left font-light">Size</th>
                        <th className="border border-border p-3 text-left font-light">US</th>
                        <th className="border border-border p-3 text-left font-light">Waist (in)</th>
                        <th className="border border-border p-3 text-left font-light">Hips (in)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
    { size: "XS", us: "0-2", waist: "24-25", hips: "34-35" },
    { size: "S", us: "4-6", waist: "26-27", hips: "36-37" },
    { size: "M", us: "8-10", waist: "28-29", hips: "38-39" },
    { size: "L", us: "12-14", waist: "30-32", hips: "40-42" },
    { size: "XL", us: "16", waist: "33-35", hips: "43-45" }
  ].map((row, index) => <tr key={index} className="hover:bg-muted/10">
                          <td className="border border-border p-3">{row.size}</td>
                          <td className="border border-border p-3">{row.us}</td>
                          <td className="border border-border p-3">{row.waist}</td>
                          <td className="border border-border p-3">{row.hips}</td>
                        </tr>)}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </ContentSection>

          <ContentSection title="Need Help?">
            <div className="space-y-6">
              <p className="text-muted-foreground">
                Still unsure about sizing? Our jewelry consultants are here to help you find the perfect fit.
                Download our printable size guide or schedule a virtual consultation.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="outline" className="rounded-none">
                  Download PDF Guide
                </Button>
                <Button className="rounded-none">
                  Schedule Consultation
                </Button>
              </div>
            </div>
          </ContentSection>
        </main>
      </div>

      <Footer />
    </div>;
};
var stdin_default = SizeGuide;
export {
  stdin_default as default
};
