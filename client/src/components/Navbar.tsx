import {
  ArrowRightIcon,
  BikeIcon,
  ChevronDownIcon,
  LogOutIcon,
  MapPinIcon,
  MenuIcon,
  PackageIcon,
  SearchIcon,
  ShieldIcon,
  ShoppingCartIcon,
  UserIcon,
  XIcon,
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export function NavBar() {
  const user: object = {
    name: "Andre Gideao",
    email: "andre@gmail.com",
    isAdmin: false,
  };
  // const user: any = null;

  const { cartCount, setIsCartOpen } = {
    cartCount: 5,
    setIsCartOpen: (_data: any) => {},
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="bg-white sticky top-0 z-50 border-b border-app-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16 gap-4">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 text-[22px] font-medium shrink-0"
        >
          <BikeIcon size={24} /> MwangoléShop
        </Link>

        <div className="w-full flex items-center justify-end gap-4 lg:gap-10">
          {/* Nav Links - Desktop */}
          <div className="hidden md:flex items-center gap-6 text-sm text-zinc-600">
            <Link to="/">Início</Link>
            <Link to="/products">Produtos</Link>
            <Link to="/deals" className="text-app-orange">
              Ofertas
            </Link>
          </div>

          {/* Search */}
          <form className="hidden sm:flex flex-1 max-w-sm text-xs ms:text-sm">
            <div className="relative w-full">
              <SearchIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-zinc-500" />

              <input
                type="text"
                placeholder="Pesquisar por produtos"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 p-2 bg-orange-50 rounded-full ring ring-app-orange/15 focus:ring-app-orange/30"
              />
            </div>
          </form>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Cart */}
            <button
              className="relative p-2 rounded-xl"
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingCartIcon className="size-5 text-zinc-900" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 size-4 bg-app-orange text-white text-[10px] rounded-full flex-center">
                  {cartCount}
                </span>
              )}
            </button>

            {/* User */}
            <div className="relative">
              {user ? (
                <button
                  className="flex items-center gap-2 p-2"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                >
                  <div className="size-7 rounded-full bg-green-950 text-white flex-center">
                    {user.name.charAt(0).toUpperCase()}
                  </div>

                  <ChevronDownIcon className="size-3 text-zinc-500" />
                </button>
              ) : (
                <div className="flex-center gap-2">
                  <Link
                    to="/login"
                    className="hidden md:flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-950 rounded-full hover:bg-app-green-light transition-colors"
                  >
                    <UserIcon size={16} /> Entrar
                  </Link>

                  {userMenuOpen ? (
                    <XIcon
                      className="md:hidden"
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                    />
                  ) : (
                    <MenuIcon
                      className="md:hidden"
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                    />
                  )}
                </div>
              )}

              {userMenuOpen && (
                <>
                  <div
                    className="fixed ins et-0 z-40"
                    onClick={() => setIsCartOpen(false)}
                  />
                  <div className="absolute right-0 mt-2.5 w-56 border-white rounded-xl py-2 z-50 animate-fade-in">
                    {user && (
                      <div className="px-4 py-2 border-b border-app-border">
                        <p className="text-sm font-medium text-zinc-900">
                       «
                          {user?.name}
                        </p>
                        <p className="text-xs text-zinc-500">{user?.email}</p>
                      </div>
                    )}

                    <div onClick={() => setUserMenuOpen(false)}>
                      {!user && (
                        <Link to="/login" className="dropdown-link">
                          <UserIcon size={16} /> Entrar
                        </Link>
                      )}

                      {user && (
                        <Link to="/orders" className="dropdown-link">

                          <PackageIcon size={16} /> Meus pedidos
                        </Link>
                      )}

                      {user && (
                        <Link to="/addresses" className="dropdown-link">

                          <MapPinIcon size={16} /> Endereços{" "}
                        </Link>
                      )}

                      <Link to="/products" className="dropdown-link md:hidden">
                        {" "}
                        <ArrowRightIcon size={16} /> Produtos{" "}
                      </Link>

                      <Link to="/deals" className="dropdown-link md:hidden">
                        <ArrowRightIcon size={16} /> Ofertas{" "}
                      </Link>

                      {user?.isAdmin && (
                        <Link
                          to="/admin/products"
                          className="dropdown-link md:hidden"
                        >

                          <ShieldIcon
                            size={16}
                            className="text-app-orange-dark"
                          />
                          <span className="text-app-orange-dark">
                            Painel Admin
                          </span>
                        </Link>
                      )}

                      {user && (
                        <div className="border-t border-app-border pt-1">
                          <button className="flex items-center gap-3 px-4 py-2.5 text-sm text-app-error hover:bg-red-50 w-full transition-colors">
                            <LogOutIcon size={16} />
                            Sair
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
