import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import PageHeader from "../../components/about/PageHeader";
import ContentSection from "../../components/about/ContentSection";
import StoreMap from "../../components/about/StoreMap";
import { Button } from "../../components/ui/button";
import AboutSidebar from "../../components/about/AboutSidebar";
const StoreLocator = () => {
  const stores = [
    {
      name: "FITFLOOR Mumbai",
      address: "Phoenix Palladium, Senapati Bapat Marg, Lower Parel, Mumbai, Maharashtra 400013",
      phone: "+91 22 5555 0123",
      hours: "Mon-Sat: 11AM-9PM, Sun: 11AM-9PM",
      services: ["Personal Styling", "Alterations", "Custom Design", "Valet Parking"]
    },
    {
      name: "FITFLOOR Delhi",
      address: "DLF Emporio, Vasant Kunj, New Delhi, Delhi 110070",
      phone: "+91 11 5555 0456",
      hours: "Mon-Sat: 11AM-9PM, Sun: 11AM-9PM",
      services: ["Personal Styling", "Made to Measure", "VIP Suites", "Home Delivery"]
    },
    {
      name: "FITFLOOR Bangalore",
      address: "UB City, Vittal Mallya Road, Bengaluru, Karnataka 560001",
      phone: "+91 80 5555 0789",
      hours: "Mon-Sat: 10:30AM-9PM, Sun: 11AM-8PM",
      services: ["Browse & Buy", "Alterations", "Gift Concierge"]
    }
  ];
  return <div className="min-h-screen bg-background">
      <Header />

      <div className="flex">
        <div className="hidden lg:block">
          <AboutSidebar />
        </div>

        <main className="w-full lg:w-[70vw] lg:ml-auto px-6">
          <PageHeader
    title="Store Locator"
    subtitle="Visit us in person for a personalized shopping experience"
  />

          <ContentSection title="Interactive Store Map">
            <StoreMap />
          </ContentSection>

          <ContentSection title="Our Locations">
            <div className="grid gap-8">
              {stores.map((store, index) => <div key={index} className="bg-background rounded-lg p-8 border border-border">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <h3 className="text-xl font-light text-foreground">{store.name}</h3>
                      <div className="space-y-2 text-muted-foreground">
                        <p>{store.address}</p>
                        <p>{store.phone}</p>
                        <p>{store.hours}</p>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3 pt-4">
                        <Button variant="outline" className="rounded-none">
                          Get Directions
                        </Button>
                        <Button className="rounded-none">
                          Book Appointment
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-lg font-light text-foreground">Available Services</h4>
                      <ul className="grid grid-cols-2 gap-2">
                        {store.services.map((service, serviceIndex) => <li key={serviceIndex} className="text-sm text-muted-foreground flex items-center">
                            <span className="w-2 h-2 bg-primary rounded-full mr-3 flex-shrink-0" />
                            {service}
                          </li>)}
                      </ul>
                    </div>
                  </div>
                </div>)}
            </div>
          </ContentSection>

          <ContentSection title="Private Appointments">
            <div className="space-y-6">
              <p className="text-lg text-muted-foreground leading-relaxed">
                Experience personalized service with a private appointment. Our style consultants will guide you through our collections, help with fittings, and provide expert advice in a comfortable, private setting.
              </p>

              <div className="grid md:grid-cols-3 gap-8 mt-12">
                <div className="space-y-3">
                  <h4 className="text-lg font-light text-foreground">Personal Styling</h4>
                  <p className="text-muted-foreground text-sm">
                    One-on-one guidance to build your perfect wardrobe
                  </p>
                </div>
                <div className="space-y-3">
                  <h4 className="text-lg font-light text-foreground">Made to Measure</h4>
                  <p className="text-muted-foreground text-sm">
                    Custom fitting services for the perfect fit
                  </p>
                </div>
                <div className="space-y-3">
                  <h4 className="text-lg font-light text-foreground">Garment Care</h4>
                  <p className="text-muted-foreground text-sm">
                    Professional cleaning, alterations, and repair services
                  </p>
                </div>
              </div>

              <div className="pt-8">
                <Button size="lg" className="rounded-none">
                  Schedule Your Appointment
                </Button>
              </div>
            </div>
          </ContentSection>

          <ContentSection title="Virtual Consultations">
            <div className="bg-muted/10 rounded-lg p-8">
              <h3 className="text-xl font-light text-foreground mb-4">Can't visit in person?</h3>
              <p className="text-muted-foreground mb-6">
                Book a virtual consultation with one of our style experts. We'll showcase pieces via video call,
                answer your questions, and help you make the perfect selection from the comfort of your home.
              </p>
              <Button variant="outline" className="rounded-none">
                Book Virtual Consultation
              </Button>
            </div>
          </ContentSection>
        </main>
      </div>

      <Footer />
    </div>;
};
var stdin_default = StoreLocator;
export {
  stdin_default as default
};
