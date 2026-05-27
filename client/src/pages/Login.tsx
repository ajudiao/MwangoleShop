import { useState } from "react";
import loginHero from "../assets/loginHero.jpg";
import { Link } from "react-router-dom";
import {
  BikeIcon,
  Loader2Icon,
  LockIcon,
  MailIcon,
  UserIcon,
} from "lucide-react";

export function Login() {
  const [isLoginState, setIsLoginState] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => (window.location.href = "/"), 1000);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side */}
      <div className="hidden lg:flex lg:w-1/2 bg-app-green relative items-center justify-center   ">
        <img
          src={loginHero}
          alt=""
          className="absolute inset-0 object-cover h-full bg-center opacity-10"
        />
        <div className="relative text-center px-12">
          <h2 className="text-4xl font-semibold text-white mb-4">
            Bem-vindo a MwangléShop
          </h2>
          <p className="text-white/60 font-serif text-xl max-w-sm mx-auto">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maxime
          </p>
        </div>
      </div>

      {/* Rigth Side */}

      <div className="flex-1 flex-center px-4 py-12 bg-app-cream">
        <div className="w-full max-w-md">
          {/* From header message */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-6">
              <BikeIcon className="size-8 text-app-green" />
              <span className="text-2xl font-semibold text-app-green">
                MwangléShop
              </span>
            </Link>
            <h1 className="text-2xl font-semibold text-app-green mb-2">
              {isLoginState ? "Entrar" : "Criar conta"}
            </h1>
            <p className="text-sm text-app-text-light">
              {isLoginState
                ? "Já tem uma conta?"
                : "Já tenho uma conta na MangoléShop"}{" "}
              <button
                onClick={() => setIsLoginState(!isLoginState)}
                className="text-orange-500 ml-1 font-semibold hover:text-orange-600 transition-colors"
              >
                {isLoginState ? "Criar uma" : "Entrar"}
              </button>
            </p>
          </div>

          {/* Login / Register Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLoginState && (
              <label className="text-sm flex flex-col gap-1">
                Name
                <div className="relative">
                  <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-app-text-light" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Seu nome"
                    className="w-full pl-11 pr-4 py-3 text-sm bg-white border not-focus:border-app-border transition-all"
                  />
                </div>
              </label>
            )}
            
            <label className="text-sm flex flex-col gap-1">
              E-mail
              <div className="relative">
                <MailIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-app-text-light" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="exemple@email.com"
                  className="w-full pl-11 pr-4 py-3 text-sm bg-white border not-focus:border-app-border transition-all"
                />
              </div>
            </label>
            <label className="text-sm flex flex-col gap-1">
              Senha
              <div className="relative">
                <LockIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-app-text-light" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="****"
                  className="w-full pl-11 pr-4 py-3 text-sm bg-white border not-focus:border-app-border transition-all"
                />
              </div>
            </label>
            <button
              type="submit"
              disabled={loading}
              className="flex-center w-full py-3 bg-green-950 text-white font-semibold rounded-xl hover:bg-green-900 transition-colors disabled:opacity-50"
            >
              {loading ? (
                <Loader2Icon className="animate-spin" />
              ) : isLoginState ? (
                "Entrar"
              ) : (
                "Criar conta"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
