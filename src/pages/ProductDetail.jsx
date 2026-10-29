import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import ProductImageGallery from "../components/product/ProductImageGallery";
import ProductInfo from "../components/product/ProductInfo";
import ProductDescription from "../components/product/ProductDescription";
import ProductCarousel from "../components/content/ProductCarousel";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import api, { getImageUrl } from "@/lib/api";
import { Loader2, ArrowLeft } from "lucide-react";

const ProductDetail = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/category/all");
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        console.log("Fetching product with ID:", productId);
        const response = await api.products.getById(productId);
        console.log("API Response:", response);
        
        if (response && response.item) {
          const prod = response.item;
          prod.image = getImageUrl(prod.image);
          if (prod.gallery) {
            prod.gallery = prod.gallery.map(img => getImageUrl(img));
          }
          setProduct(prod);
        } else {
          console.warn("Product item not found in response");
          setProduct(null);
        }
      } catch (error) {
        console.error("Failed to fetch product:", error);
        setProduct(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
    window.scrollTo(0, 0);
  }, [productId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-denim mb-4" />
        <p className="text-muted-foreground">Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-2xl font-light mb-4">Product Not Found</h2>
        <p className="text-muted-foreground mb-8">Sorry, we couldn't find the product you're looking for.</p>
        <Link to="/category/all" className="px-8 py-3 bg-foreground text-background">Back to Shop</Link>
      </div>
    );
  }

  return <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-4">
        <section className="w-full px-6">
          {/* Breadcrumbs & Back Button at top */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 pb-3">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={handleBack}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-black hover:text-white transition-all duration-200 cursor-pointer shadow-2xs"
                title="Go back to previous page"
              >
                <ArrowLeft size={14} />
                <span>Back</span>
              </button>

              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link to="/" className="text-xs text-gray-500 hover:text-black">Home</Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link to={`/category/${product.category.toLowerCase()}`} className="text-xs text-gray-500 hover:text-black">{product.category}</Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage className="text-xs font-bold text-black">{product.name}</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>

            <Link
              to="/category/all"
              className="text-xs text-gray-500 hover:text-black hover:underline hidden sm:inline-block"
            >
              Continue Shopping →
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            <div className="lg:col-span-7">
              <ProductImageGallery product={product} />
            </div>

            <div className="lg:col-span-5 lg:sticky lg:top-6 lg:h-fit">
              <ProductInfo product={product} />
              <div className="mt-8">
                <ProductDescription product={product} />
              </div>
            </div>
          </div>
        </section>

        <section className="w-full mt-16 lg:mt-24">
          <div className="mb-4 px-6">
            <h2 className="text-sm font-light text-foreground">You might also like</h2>
          </div>
          <ProductCarousel category={product.category} excludeId={product.id} />
        </section>
      </main>

      <Footer />
    </div>;
};

export default ProductDetail;
