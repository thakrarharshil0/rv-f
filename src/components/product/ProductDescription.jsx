import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import ReviewProduct from "./ReviewProduct";
import api from "@/lib/api";

const CustomStar = ({ filled, className }) => <svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 20 20"
  fill="currentColor"
  className={`w-3 h-3 ${filled ? "text-foreground" : "text-muted-foreground/30"} ${className}`}
>
    <path
  fillRule="evenodd"
  d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z"
  clipRule="evenodd"
/>
  </svg>;

const ProductDescription = ({ product }) => {
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(true);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isCareOpen, setIsCareOpen] = useState(false);
  const [isReviewsOpen, setIsReviewsOpen] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);

  useEffect(() => {
    if (isReviewsOpen && product.id) {
      const fetchReviews = async () => {
        setIsLoadingReviews(true);
        try {
          const response = await api.products.getReviews(product.id);
          setReviews(response.items || []);
        } catch (error) {
          console.error("Failed to fetch reviews:", error);
        } finally {
          setIsLoadingReviews(false);
        }
      };
      fetchReviews();
    }
  }, [isReviewsOpen, product.id]);

  return <div className="space-y-0 mt-8 border-t border-border">
      {/* Description */}
      <div className="border-b border-border">
        <Button
    variant="ghost"
    onClick={() => setIsDescriptionOpen(!isDescriptionOpen)}
    className="w-full h-14 px-0 justify-between hover:bg-transparent font-medium rounded-none"
  >
          <span>Description</span>
          {isDescriptionOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
        {isDescriptionOpen && <div className="pb-6 space-y-4">
            <p className="text-sm font-light text-muted-foreground leading-relaxed whitespace-pre-line">
              {product.description || "No description available for this product."}
            </p>
          </div>}
      </div>

      {/* Product Details */}
      <div className="border-b border-border">
        <Button
    variant="ghost"
    onClick={() => setIsDetailsOpen(!isDetailsOpen)}
    className="w-full h-14 px-0 justify-between hover:bg-transparent font-medium rounded-none"
  >
          <span>Product Details</span>
          {isDetailsOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
        {isDetailsOpen && <div className="pb-6 space-y-3">
            <div className="flex justify-between">
              <span className="text-sm font-light text-muted-foreground">SKU</span>
              <span className="text-sm font-light text-foreground">{product.sku}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-light text-muted-foreground">Category</span>
              <span className="text-sm font-light text-foreground">{product.category}</span>
            </div>
            {product.material && (
              <div className="flex justify-between">
                <span className="text-sm font-light text-muted-foreground">Material</span>
                <span className="text-sm font-light text-foreground">{product.material}</span>
              </div>
            )}
            {product.fit && (
              <div className="flex justify-between">
                <span className="text-sm font-light text-muted-foreground">Fit</span>
                <span className="text-sm font-light text-foreground">{product.fit}</span>
              </div>
            )}
          </div>}
      </div>

      {/* Care Instructions */}
      <div className="border-b border-border">
        <Button
    variant="ghost"
    onClick={() => setIsCareOpen(!isCareOpen)}
    className="w-full h-14 px-0 justify-between hover:bg-transparent font-medium rounded-none"
  >
          <span>Care & Instructions</span>
          {isCareOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
        {isCareOpen && <div className="pb-6 space-y-4">
            <p className="text-sm font-light text-muted-foreground whitespace-pre-line">
              {product.care_instructions || "Standard care instructions apply."}
            </p>
          </div>}
      </div>

      {/* Customer Reviews */}
      <div className="border-b border-border lg:mb-16">
        <Button
    variant="ghost"
    onClick={() => setIsReviewsOpen(!isReviewsOpen)}
    className="w-full h-14 px-0 justify-between hover:bg-transparent font-medium rounded-none"
  >
          <div className="flex items-center gap-3">
            <span>Customer Reviews</span>
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => <CustomStar
    key={star}
    filled={star <= (product.rating_average || 0)}
  />)}
              <span className="text-sm font-light text-muted-foreground ml-1">
                {product.rating_average ? product.rating_average.toFixed(1) : "0.0"} ({product.reviews_count || 0})
              </span>
            </div>
          </div>
          {isReviewsOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
        {isReviewsOpen && <div className="pb-6 space-y-6">
            <ReviewProduct productId={product.id} />
            
            {isLoadingReviews ? (
              <div className="py-10 text-center border-t border-border mt-6 flex justify-center">
                <div className="w-6 h-6 border-2 border-denim border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : reviews.length > 0 ? (
              <div className="space-y-8 border-t border-border mt-6 pt-6">
                {reviews.map((review) => (
                  <div key={review.id} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <CustomStar key={star} filled={star <= review.rating} />
                        ))}
                      </div>
                      <span className="text-[10px] text-muted-foreground font-light">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <h4 className="text-sm font-medium text-foreground">{review.user.name}</h4>
                    {review.title && <p className="text-sm font-medium">{review.title}</p>}
                    <p className="text-sm font-light text-muted-foreground leading-relaxed">
                      {review.comment}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-10 text-center border-t border-border mt-6">
                <p className="text-sm text-muted-foreground font-light italic">Be the first to review this product!</p>
              </div>
            )}
          </div>}
      </div>
    </div>;
};

export default ProductDescription;
