# 📄 Página: Home.tsx

## O que é?
A página inicial (home) é a primeira página que o usuário vê quando entra no site. É uma página simples que monta várias seções reutilizáveis de componentes para exibir informações sobre a loja.

## Estrutura da Página

```tsx
export function Home() {
    return (
        <div className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <Hero />
            <Features />
            <HomeCategories />
            <PopularProducts />
            <AppPromoBanner />
            <Newsletter />
        </div>
    )
}
```

## O que cada coisa faz?

### 📦 Componentes Importados

1. **`Hero`** - Banner principal com imagem/mensagem de boas-vindas
2. **`Features`** - Seção mostrando características da loja (frete grátis, atendimento, etc)
3. **`HomeCategories`** - Grid de categorias para navegar para os produtos
4. **`PopularProducts`** - Lista dos produtos mais populares
5. **`AppPromoBanner`** - Banner promocional para incentivar compras
6. **`Newsletter`** - Seção para se inscrever na newsletter

### 🎨 Classes CSS Explicadas

```tsx
<div className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
```

- `min-h-screen` → Altura mínima de uma tela inteira
- `max-w-7xl` → Largura máxima de 80 caracteres (mantém conteúdo centralizado)
- `mx-auto` → Margem automática nas laterais (centra o conteúdo)
- `px-4 sm:px-6 lg:px-8` → Padding responsivo (espaçamento nas laterais muda conforme a tela)
- `py-12` → Padding vertical

## Como Funciona?

1. **É só um container** - Home.tsx é basicamente um container que ordena componentes
2. **Reutiliza componentes** - Cada seção é um componente separado importado
3. **Responsivo** - Classes Tailwind fazem ajustar automaticamente em telas diferentes
4. **Sem estado** - Não usa `useState` ou `useEffect` (é um componente "burro")

## Fluxo

```
Usuário abre site
    ↓
Home.tsx renderiza
    ↓
Mostra Hero (banner principal)
    ↓
Mostra Features (características)
    ↓
Mostra Categorias
    ↓
Mostra Produtos Populares
    ↓
Mostra Banner Promocional
    ↓
Mostra Newsletter
```

## Exemplo Prático

Se você quisesse adicionar uma nova seção (tipo "Depoimentos"), você:

1. Criaria um novo componente `Testimonials.tsx` em `src/components/Home/`
2. Importaria em `Home.tsx`: `import { Testimonials } from "../components/Home/Testimonials"`
3. Adicionaria na ordem desejada: `<Testimonials />`

É simples assim! Home.tsx é só um "orquestrador" de componentes.

## Por que é assim?

Essa estrutura é chamada **"composição"** - quebrar a página em componentes pequenos:
- ✅ Mais fácil de entender
- ✅ Cada componente faz uma coisa
- ✅ Reutilizável (pode usar `Hero` em outro lugar)
- ✅ Fácil de manutenção (mudar algo em Features não afeta Hero)
