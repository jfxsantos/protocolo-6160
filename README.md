# Protocolo 6160 — Guia de Deploy

## Stack
- **Frontend**: React + Vite
- **Banco de dados + Auth**: Supabase
- **Hospedagem**: Cloudflare Pages

---

## Passo 1 — Configurar o Supabase

1. Acesse [supabase.com](https://supabase.com) e entre na sua conta
2. Crie um novo projeto (ex: `protocolo-6160`)
3. Aguarde o projeto inicializar (~1 min)
4. Vá em **SQL Editor** no menu lateral
5. Cole todo o conteúdo do arquivo `supabase-schema.sql` e clique em **Run**
6. Vá em **Project Settings → API**
7. Copie:
   - `Project URL` (ex: `https://xxxxxxxxxxx.supabase.co`)
   - `anon public` key

---

## Passo 2 — Subir o código no GitHub

1. Acesse [github.com](https://github.com) e faça login
2. Clique em **New repository**
3. Nome: `protocolo-6160` → **Create repository**
4. No seu computador, abra o terminal na pasta do projeto e rode:

```bash
# Instalar dependências
npm install

# Iniciar git
git init
git add .
git commit -m "Protocolo 6160 — versão inicial"

# Conectar ao GitHub (substitua SEU_USUARIO pelo seu usuário do GitHub)
git remote add origin https://github.com/SEU_USUARIO/protocolo-6160.git
git branch -M main
git push -u origin main
```

---

## Passo 3 — Deploy no Cloudflare Pages

1. Acesse [dash.cloudflare.com](https://dash.cloudflare.com) e entre na sua conta
2. Vá em **Workers & Pages → Pages**
3. Clique em **Create a project → Connect to Git**
4. Conecte sua conta do GitHub e selecione o repositório `protocolo-6160`
5. Configure o build:
   - **Framework preset**: Vite
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
6. Adicione as variáveis de ambiente:
   - `VITE_SUPABASE_URL` = sua URL do Supabase
   - `VITE_SUPABASE_ANON_KEY` = sua chave anon do Supabase
7. Clique em **Save and Deploy**

Pronto! Em 1-2 minutos seu app estará online com uma URL do tipo `protocolo-6160.pages.dev`.

---

## Passo 4 — Configurar autenticação no Supabase

1. No Supabase, vá em **Authentication → URL Configuration**
2. Em **Site URL**, adicione a URL do seu Cloudflare Pages (ex: `https://protocolo-6160.pages.dev`)
3. Em **Redirect URLs**, adicione a mesma URL

---

## Estrutura do Projeto

```
protocolo-6160/
├── src/
│   ├── components/
│   │   ├── Logo.jsx          # Logo reutilizável
│   │   └── Radar.jsx         # Gráfico radar do diagnóstico
│   ├── hooks/
│   │   ├── useAuth.js        # Hook de autenticação
│   │   └── useProtocolo.js   # Hook de dados do usuário
│   ├── lib/
│   │   ├── supabase.js       # Cliente Supabase
│   │   └── habitos.js        # Dados das 6 áreas e hábitos
│   ├── pages/
│   │   ├── Auth.jsx          # Login e cadastro
│   │   ├── Onboarding.jsx    # Jornada do Dia 1 (6 passos)
│   │   ├── Home.jsx          # Dashboard principal
│   │   ├── Trilha.jsx        # Trilha dos 60 dias
│   │   ├── Checkin.jsx       # Check-in diário
│   │   └── Identidade.jsx    # Identidade + Descanso intencional
│   ├── styles/
│   │   └── global.css        # Estilos globais
│   ├── App.jsx               # Roteamento principal
│   └── main.jsx              # Entrada do React
├── supabase-schema.sql       # SQL para criar o banco
├── .env.example              # Exemplo das variáveis de ambiente
├── index.html
├── vite.config.js
└── package.json
```

---

## Desenvolvimento local

```bash
# Copiar variáveis de ambiente
cp .env.example .env
# Editar .env com suas chaves do Supabase

# Instalar dependências
npm install

# Rodar localmente
npm run dev
```

O app estará disponível em `http://localhost:5173`

---

## Módulos implementados

- ✅ **Autenticação** — email/senha via Supabase Auth
- ✅ **Onboarding** — 6 passos: nome → motivo → compromisso → diagnóstico → escolha de hábitos → ativação
- ✅ **Home** — dashboard com CTA de check-in, stats e módulos
- ✅ **Trilha dos 60 dias** — calendário por semanas com progresso visual
- ✅ **Check-in diário** — presença + hábitos escolhidos + reflexão
- ✅ **Descanso intencional** — revisão semanal do Dia 7
- ✅ **Identidade em Construção** — declaração "Eu sou alguém que..." com histórico

## Próximos módulos a desenvolver
- Dashboard de Evolução (comparação de diagnósticos)
- Notificações push
- Modo offline
