/**
 * Shopify Product Card Component
 * 
 * Displays a Shopify product with AVERRA's luxury aesthetic
 */

import { motion } from 'motion/react';
import { ShoppingCart } from 'lucide-react';
import { ShopifyProduct } from '@/app/hooks/useShopifyProducts';
import { useShopifyCart } from '@/app/context/ShopifyCartContext';
import { Button } from '@/app/components/ui/button';

interface ShopifyProductCardProps {
  product: ShopifyProduct;
  onProductClick?: (product: ShopifyProduct) => void;
}

export function ShopifyProductCard({ product, onProductClick }: ShopifyProductCardProps) {
  const { addItem } = useShopifyCart();

  const primaryVariant = product.variants[0];
  const primaryImage = product.images[0];
  const hasDiscount = primaryVariant.compareAtPrice && 
    parseFloat(primaryVariant.compareAtPrice) > parseFloat(primaryVariant.price);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!primaryVariant.available) return;

    addItem({
      id: `shopify-${product.id}-${primaryVariant.id}`,
      variantId: primaryVariant.id,
      name: product.title,
      price: parseFloat(primaryVariant.price),
      originalPrice: primaryVariant.compareAtPrice 
        ? parseFloat(primaryVariant.compareAtPrice) 
        : undefined,
      type: 'shopify-product',
      description: product.description,
      image: primaryImage?.src,
      quantity: 1,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="group cursor-pointer"
      onClick={() => onProductClick?.(product)}
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-[#2d1810] mb-4">
        {primaryImage ? (
          <img
            src={primaryImage.src}
            alt={primaryImage.altText || product.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#BFBBA7]">
            No image
          </div>
        )}

        {/* Discount Badge */}
        {hasDiscount && (
          <div className="absolute top-4 right-4 bg-[#301710] text-[#DCDACC] px-3 py-1 text-xs uppercase tracking-wider">
            Sale
          </div>
        )}

        {/* Out of Stock Badge */}
        {!primaryVariant.available && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-white text-lg uppercase tracking-wider">
              Out of Stock
            </span>
          </div>
        )}

        {/* Quick Add Button */}
        {primaryVariant.available && (
          <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button
              onClick={handleAddToCart}
              className="w-full bg-[#DCDACC] text-[#301710] hover:bg-[#BFBBA7] transition-colors"
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.875rem',
                fontWeight: 600,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
              }}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Add to Cart
            </Button>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="space-y-2">
        <h3 
          className="text-[#DCDACC] text-lg"
          style={{ fontFamily: 'Cormorant, serif', fontWeight: 400 }}
        >
          {product.title}
        </h3>

        {product.vendor && (
          <p className="text-[#BFBBA7] text-sm uppercase tracking-wider">
            {product.vendor}
          </p>
        )}

        <div className="flex items-center gap-2">
          <span 
            className="text-[#DCDACC] text-xl"
            style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}
          >
            ${primaryVariant.price}
          </span>
          {hasDiscount && (
            <span 
              className="text-[#BFBBA7] text-sm line-through"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              ${primaryVariant.compareAtPrice}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
