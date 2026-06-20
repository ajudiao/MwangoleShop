# 📄 Página: Login.tsx

## O que é?
É a página de autenticação (login e registro). Permite usuário fazer login ou criar uma nova conta.

## Estados

```tsx
const [isLoginState, setIsLoginState] = useState(true);
```
- **Controla o modo**: true = tela de login, false = tela de registro
- Permite alternar entre as duas com um botão

```tsx
const [name, setName] = useState("");
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
```
- Guardam valores dos campos do formulário
- Atualizam em tempo real conforme usuário digita

```tsx
const [loading, setLoading] = useState(false);
```
- Indica se formulário está sendo enviado
- Mostra spinner no botão para usuário não clicar 2x

## Função handleSubmit

```tsx
const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();           // Impede recarregamento da página
    setLoading(true);             // Mostra loading
    setTimeout(() => {            // Simula requisição ao servidor
        window.location.href = "/";  // Redireciona para home
    }, 1000);
};
```

**O que faz:**
1. `e.preventDefault()` - Impede comportamento padrão de form (recarregar página)
2. `setLoading(true)` - Desabilita botão, mostra loading
3. `setTimeout` - Simula demora de requisição ao servidor
4. `window.location.href = "/"` - Redireciona para home (força recarregamento)

**⚠️ IMPORTANTE**: Este é código de exemplo! Em um app real você:
```tsx
// ❌ FAKE - Não faz requisição real
const handleSubmit = async (e) => {
    setLoading(true);
    setTimeout(() => window.location.href = "/", 1000);
}

// ✅ REAL - Requisição ao backend
const handleSubmit = async (e) => {
    setLoading(true);
    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
        const data = await response.json();
        localStorage.setItem('token', data.token);
        navigate('/');
    } catch (error) {
        setError(error.message);
    } finally {
        setLoading(false);
    }
};
```

## Estrutura da Página

```
┌─────────────────────────────────┐
│  LADO ESQUERDO (desktop)        │  LADO DIREITO
│  - Imagem + logo                │  - Título (Login/Registro)
│  - Mensagem boas-vindas         │  - Toggle Login/Registro
│                                  │  - Formulário
│  (Escondido em mobile)          │  - Botão Submit
└─────────────────────────────────┘
```

## Condicional - Mostrar Campo Nome

```tsx
{!isLoginState && (
    <label className="text-sm flex flex-col gap-1">
        Name
        <div className="relative">
            <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4" />
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Seu nome"
            />
        </div>
    </label>
)}
```

**O que significa:**
- `{!isLoginState &&}` = Se NÃO está em modo login (ou seja, está em registro), mostra isso
- `!true` = false (não mostra)
- `!false` = true (mostra)

## Campos do Formulário

### Email
```tsx
<input
    type="email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    required
    placeholder="exemple@email.com"
/>
```

**Atributos:**
- `type="email"` - Valida se é email (navegador faz isso automaticamente)
- `value={email}` - Campo controlado pelo React
- `onChange` - Atualiza estado conforme digita
- `required` - Campo obrigatório (forma valida antes de enviar)

### Password
```tsx
<input
    type="password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    required
    placeholder="Sua senha"
/>
```

- `type="password"` - Mascara a senha (mostra • em vez de caracteres)

## Botão de Toggle

```tsx
<button
    onClick={() => setIsLoginState(!isLoginState)}
    className="text-orange-500 ml-1 font-semibold"
>
    {isLoginState ? "Criar uma" : "Entrar"}
</button>
```

**O que faz:**
- Alterna entre login e registro
- Muda texto do botão conforme estado

**Fluxo:**
```
Usuário clica "Criar uma"
    ↓
onClick executa: setIsLoginState(!true) = setIsLoginState(false)
    ↓
isLoginState = false
    ↓
Mostra campo de nome
    ↓
Botão muda texto para "Entrar"
```

## Ícones dos Campos

```tsx
<div className="relative">
    <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4" />
    <input ... />
</div>
```

**Como funciona:**
- `relative` no container - permite posicionamento absoluto de ícone
- `absolute` no ícone - posiciona por cima do input
- `left-3.5 top-1/2 -translate-y-1/2` - centraliza verticalmente
- Ícone fica dentro do input, lado esquerdo

## Lado Esquerdo (Desktop)

```tsx
<div className="hidden lg:flex lg:w-1/2 bg-app-green">
    <img src={heroSectionData.hero_image} className="absolute inset-0 opacity-10" />
    <div className="relative text-center px-12">
        <h2 className="text-4xl font-semibold text-white mb-4">
            Bem-vindo a MwangléShop
        </h2>
```

**Classes importantes:**
- `hidden lg:flex` - Escondido em mobile, visível em desktop
- `lg:w-1/2` - Ocupa metade da largura
- `absolute inset-0` - Imagem cobre todo o container
- `opacity-10` - Imagem muito transparente (fundo)
- `relative` - Texto fica por cima da imagem

## Fluxo Completo de Login

```
1. User abre /login
   ↓
2. Vê formulário de login (padrão)
   ↓
3. Digita email
   ↓
4. onChange atualiza setEmail
   ↓
5. email = "usuario@email.com"
   ↓
6. Digita senha
   ↓
7. password = "123456"
   ↓
8. Clica "Entrar"
   ↓
9. handleSubmit executa
   ↓
10. setLoading(true) (desabilita botão)
   ↓
11. setTimeout simula requisição (1 segundo)
   ↓
12. Redireciona para home
```

## Fluxo Completo de Registro

```
1. User clica "Criar uma"
   ↓
2. setIsLoginState(false)
   ↓
3. Formulário mostra campo de nome
   ↓
4. Digita: nome, email, senha
   ↓
5. Clica "Registrar"
   ↓
6. handleSubmit executa (mesmo handleSubmit)
   ↓
7. Redireciona para home
```

## Dicas Importantes

1. **`type="email"` valida automaticamente** - navegador rejeita se não for válido
2. **`required` impede submit** se campo vazio
3. **`hidden lg:flex`** - responsivo: esconde mobile, mostra desktop
4. **`!isLoginState` = "não está em login"** = "está em registro"
5. **Este é código de exemplo** - app real precisa fazer requisição real ao servidor
