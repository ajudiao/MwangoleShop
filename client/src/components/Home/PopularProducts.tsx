import { useEffect, useState } from "react";
// import { dummyProducts } from "../../assets/assets";
import { Link } from "react-router-dom";
import { ArrowRightIcon } from "lucide-react";
import type { Product } from "../../types";
import { ProductCard } from "../ProductCard";
import api from "../../config/api";
import toast from "react-hot-toast";
import axios from "axios";

export function PopularProducts() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log("Buscando produtos...");
        const { data } = await api.get("/products?sort=rating");
        const list = Array.isArray(data?.products) ? data.products : [];
        setProducts(list);
      } catch (error) {
        console.error(error);

        setProducts([]);

        if (axios.isAxiosError(error)) {
          toast.error(
            (error.response && (error.response as any).data && (error.response as any).data.message) ||
              error.message ||
              "Erro ao carregar produtos."
          );
        } else {
          toast.error("Erro inesperado.");
        }
      }
    };

    fetchProducts();
  }, []);
  return (
    <section className="pb-16">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-semibold">Produtos Popular</h2>
            <p className="text-sm text-app-text-light mt-1">
              Produtos mais bem avaliados desta temporada
            </p>
          </div>

          <Link
            to="/products"
            className="text-sm font-semibold text-app-orange hover:text-app-orange-dark flex items-center gap-1 transition-colors"
          >
            Ver todos <ArrowRightIcon className="size-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 xl:gap-8">
          {Array.isArray(products) && products.slice(0,10).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
