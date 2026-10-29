import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import PageHeader from "../../components/about/PageHeader";
import ContentSection from "../../components/about/ContentSection";
import ImageTextBlock from "../../components/about/ImageTextBlock";
import AboutSidebar from "../../components/about/AboutSidebar";
const OurStory = () => {
  return <div className="min-h-screen bg-background">
      <Header />

      <div className="flex">
        <div className="hidden lg:block">
          <AboutSidebar />
        </div>

        <main className="w-full lg:w-[70vw] lg:ml-auto px-6">
          <PageHeader
    title="Our Story"
    subtitle="A journey of style, craftsmanship, and modern elegance"
  />

          <ContentSection>
            <ImageTextBlock
    image="/founders.png"
    imageAlt="Company founders"
    title="Founded on Passion"
    content="Royal Virtus was born from a shared vision of creating contemporary clothing that transcends fleeting trends. Our founders, united by their passion for exceptional tailoring and sustainable fabrics, established the brand with a commitment to creating garments that tell a story - your story."
    imagePosition="left"
  />
          </ContentSection>

          <ContentSection title="Our Heritage">
            <div className="grid md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <h3 className="text-xl font-light text-foreground">Masterful Tailoring</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Every garment in our collection is meticulously crafted by skilled tailors who have honed their craft over generations. We honor traditional sewing techniques while embracing modern innovation, ensuring each piece meets our exacting standards for fit and durability.
                </p>
              </div>
              <div className="space-y-6">
                <h3 className="text-xl font-light text-foreground">Sustainable Fashion</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We believe style and sustainability can coexist beautifully. Our commitment to ethical sourcing, organic textiles, and responsible manufacturing practices ensures that every garment you wear contributes to a more sustainable future.
                </p>
              </div>
            </div>
          </ContentSection>

          <ContentSection title="Our Values">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="space-y-4">
                <h3 className="text-lg font-light text-foreground">Quality</h3>
                <p className="text-muted-foreground">
                  We pursue perfection in every stitch, from the initial pattern to the final press.
                </p>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-light text-foreground">Comfort</h3>
                <p className="text-muted-foreground">
                  Each garment is designed for movement and comfort, without compromising on style.
                </p>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-light text-foreground">Innovation</h3>
                <p className="text-muted-foreground">
                  We continuously evolve our designs and techniques while honoring timeless aesthetic principles.
                </p>
              </div>
            </div>
          </ContentSection>
        </main>
      </div>

      <Footer />
    </div>;
};
var stdin_default = OurStory;
export {
  stdin_default as default
};

