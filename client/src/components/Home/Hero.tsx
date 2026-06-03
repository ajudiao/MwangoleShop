import { ArrowRightIcon, LeafIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { heroSectionData } from "../../assets/assets";

export function Hero() {
  return (
    <section className="relative overflow-hidden min-h-[600px] mb-12 rounded-3xl flex items-center">

      {/* Background image */}
      <img
        src={heroSectionData.hero_image}
        alt="Hero"
        className="absolute inset-0 h-full w-full object-cover scale-105"
      />

      {/* Overlay mais elegante */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />

      {/* Conteúdo */}
      <div className="relative max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 w-full">
        <div className="max-w-2xl">

          {/* Badge */}
          <span className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-green-200 bg-green-500/10 border border-green-400/20 rounded-full mb-6 backdrop-blur-md">
            <LeafIcon className="w-4 h-4 text-green-300" />
            Produtos frescos e orgânicos da fazenda
          </span>

          {/* Title */}
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-white leading-tight tracking-tight mb-5">
            Nutrimos sua casa com o{" "}
            <span className="text-orange-300 relative">
              melhor da Terra
              <span className="absolute left-0 -bottom-1 w-full h-[3px] bg-orange-400/60 rounded-full" />
            </span>
          </h1>

          {/* Description */}
          <p className="text-base sm:text-lg text-white/75 leading-relaxed mb-8 max-w-xl">
            {heroSectionData.description}
          </p>

          {/* Buttons */}
          <div className="flex flex-wrap gap-4">

            {/* Primary */}
            <Link
              to="/products"
              className="px-8 py-3.5 bg-orange-400 text-white font-semibold rounded-full
                         hover:bg-orange-500 transition-all active:scale-[0.98]
                         shadow-lg shadow-orange-500/20 flex items-center gap-2"
            >
              Compre agora
              <ArrowRightIcon className="w-4 h-4" />
            </Link>

            {/* Secondary */}
            <Link
              to="/products"
              className="px-8 py-3.5 text-white font-medium rounded-full
                         border border-white/25 hover:bg-white/10
                         transition-all backdrop-blur-md flex items-center gap-2"
            >
              Navegar categorias
              <ArrowRightIcon className="w-4 h-4 opacity-80" />
            </Link>

          </div>

        </div>
      </div>
    </section>
  );
}