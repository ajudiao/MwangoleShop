import { useNavigate } from "react-router-dom";
import type { Product } from "../types";
import { Plus, Star } from "lucide-react";
import { useCart } from "../contexts/CartContext";

interface Props {
  product: Product;
}

export function ProductCard({ product }: Props) {
  const currency = import.meta.env.VITE_CURRENCY_SYMBOL || "AOA";

  const { addToCart } = useCart()

  const navigate = useNavigate();

  return (
    <div
      className="bg-white rounded-2xl overflow-hidden shadow hover:shadow-md transition-all duration-300 group cursor-pointer"
      onClick={() => navigate(`/products/${product.id}`)}
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover p-4 group-hover:p-2 transition-all duration-300"
        />

        {/* Discount Badge */}
        {product.discount > 0 && (
          <div className="absolute top-3 left-3">
            <span className="px-2 py-0.5 text-[10px] font-semibold uppercase bg-app-orange text-white rounded-full">
              {product.discount}% OFF
            </span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-3.5 text-zinc-700">
        <h3 className="text-sm font-medium leading-snug mb-2 line-clamp-2 min-h-[40px]">
          {product.name}
        </h3>

        {/* Rating */}
        {product.rating > 0 && (
          <div className="flex items-center gap-1 mb-3">
            <Star className="size-3 fill-app-warning text-app-warning" />
            <span className="text-xs font-medium">
              {product.rating}
            </span>
            <span className="text-xs text-app-text-light">
              ({product.reviewCount})
            </span>
          </div>
        )}

        {/* Price + Cart */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1 text-sm">
            <span className="font-semibold">
              {currency} {product.price.toFixed(2)}
            </span>

            {product.unit && (
              <span className="text-xs text-app-text-light">
                /{product.unit}
              </span>
            )}

            {product.originalPrice > product.price && (
              <span className="text-xs text-app-text-light line-through ml-1">
                {currency} {product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              addToCart (product);
            }}
            className="size-8 rounded-full bg-app-orange text-white flex items-center justify-center shrink-0 hover:bg-app-orange-dark transition-colors active:scale-95"
          >
            <Plus className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}