# Servus — Front-end

![Banner Servus](./src/assets/banner%20servus.png)

O Servus é uma aplicação web privada desenvolvida para o gerenciamento interno de escalas de serviço em um ministério de igreja. Permite que administradores criem e gerenciem setores, organizem escalas de voluntários e enviem avisos aos membros. Membros comuns podem visualizar suas escalas, selecionar os setores em que desejam servir e receber notificações push.

Este projeto não é de uso comercial. Todos os direitos são reservados ao seu criador original.

---

## Tecnologias Utilizadas

- React 19
- Vite 8
- React Router DOM 6
- Axios
- Lucide React (ícones)
- CSS Modules
- PWA com Notificações Push

---

## Requisitos

- Node.js 18 ou superior
- npm 9 ou superior
- Uma instância em execução da Servus API (back-end)

---

## Como Executar

1. Clone o repositório.

2. Acesse o diretório do projeto:

   ```
   cd servus
   ```

3. Instale as dependências:

   ```
   npm install
   ```

4. Copie o arquivo de exemplo de variáveis de ambiente e preencha os valores:

   ```
   cp .env.example .env
   ```

5. Inicie o servidor de desenvolvimento:

   ```
   npm run dev
   ```

6. Para gerar o build de produção:

   ```
   npm run build
   ```

---

## Instalação do Aplicativo (PWA)

O Servus é um **Progressive Web App (PWA)**, o que significa que ele foi projetado para ser instalado no seu celular ou computador, funcionando como um aplicativo nativo.

**Para a melhor experiência e para receber notificações Push**, é obrigatório instalar o aplicativo:

### No Celular (Android/iOS)
1. Acesse a URL da aplicação no navegador (ex: Chrome no Android, Safari no iPhone).
2. O navegador mostrará uma opção "Adicionar à Tela Inicial" ou "Instalar Aplicativo".
3. Confirme a instalação. O Servus agora aparecerá junto com seus outros aplicativos.

### No Computador (Chrome/Edge)
1. Acesse a URL da aplicação.
2. Na barra de endereços (lado direito), clique no ícone de "Instalar Servus".
3. O aplicativo será instalado e poderá ser aberto como um programa independente do navegador.

---

## Variáveis de Ambiente

| Variável       | Descrição                                        |
|----------------|--------------------------------------------------|
| VITE_API_URL   | URL base da Servus API (back-end)                |

---

## Estrutura do Projeto

```
servus/
├── public/
│   ├── favicon.png              # Favicon da aplicação
│   ├── icon-192.png             # Ícone PWA (192x192)
│   ├── icon-512.png             # Ícone PWA (512x512)
│   ├── manifest.json            # Manifesto do Web App para instalação como PWA
│   └── sw.js                    # Service Worker para notificações push
├── src/
│   ├── assets/
│   │   ├── servusLogo.png       # Logotipo principal da aplicação
│   │   └── servus icon.png      # Fonte do ícone da aplicação
│   ├── components/
│   │   ├── AxiosInterceptor/    # Interceptor HTTP global para injeção de token e tratamento de erros
│   │   ├── BottomNav/           # Barra de navegação inferior para dispositivos móveis
│   │   ├── Button/              # Componente de botão reutilizável com suporte a estado de carregamento
│   │   ├── Input/               # Componente de campo de entrada reutilizável
│   │   ├── Layout/              # Wrapper de layout autenticado (Sidebar + BottomNav + Outlet)
│   │   ├── Loading/             # Componente de spinner de carregamento em tela cheia ou inline
│   │   ├── Modal/               # Componente genérico de modal sobreposto
│   │   ├── MultiSelect/         # Dropdown para seleção múltipla de itens (usuários, setores)
│   │   ├── NoticeCard/          # Cartão para exibição de um único aviso
│   │   ├── Pagination/          # Componente de controle de paginação
│   │   ├── ScaleCard/           # Cartão para exibição de uma única entrada de escala
│   │   └── Sidebar/             # Navegação lateral para desktop com logo e links
│   ├── contexts/
│   │   ├── AuthContext.jsx      # Estado de autenticação, sessão do usuário, login e logout
│   │   ├── LoadingContext.jsx   # Estado de carregamento global para transições de tela cheia
│   │   ├── NoticeContext.jsx    # Estado e operações para avisos e anúncios
│   │   └── ScaleContext.jsx     # Estado central para escalas, setores e usuários; todas as operações CRUD
│   ├── data/
│   │   └── mock.js              # Dados estáticos de exemplo utilizados durante o desenvolvimento
│   ├── hooks/
│   │   └── usePushNotifications.js  # Hook para inscrição e gerenciamento de Notificações Push
│   ├── pages/
│   │   ├── Admin/               # Painel do administrador: gerenciar usuários, setores, escalas e avisos
│   │   ├── Home/                # Dashboard inicial: próximas escalas e avisos
│   │   ├── Login/               # Página de login com formulário de e-mail e senha
│   │   ├── Profile/             # Página de perfil do usuário: visualizar e editar dados pessoais
│   │   ├── Register/            # Página de cadastro de novo usuário
│   │   ├── Scales/              # Listagem de escalas com visualizações de próximas e histórico
│   │   └── SelectSectors/       # Página de seleção de setores exibida após o primeiro cadastro
│   ├── routes/
│   │   └── ProtectedRoute.jsx   # Guardas de rota para usuários autenticados e rotas exclusivas de admin
│   ├── services/
│   │   ├── api.js               # Configuração da instância Axios com URL base
│   │   ├── authService.js       # Chamadas HTTP para autenticação (cadastro, login)
│   │   ├── noticeService.js     # Chamadas HTTP para avisos e anúncios
│   │   ├── scaleService.js      # Chamadas HTTP para escalas
│   │   ├── sectorService.js     # Chamadas HTTP para setores
│   │   └── userService.js       # Chamadas HTTP para usuários
│   ├── styles/
│   │   └── global.css           # Reset global de CSS e tokens de design (cores, espaçamentos, tipografia)
│   ├── App.jsx                  # Componente raiz: definição de rotas e árvore de providers
│   └── main.jsx                 # Ponto de entrada da aplicação; renderização do React DOM
├── .env                         # Variáveis de ambiente locais (não versionadas)
├── .env.example                 # Modelo de variáveis de ambiente
├── index.html                   # Ponto de entrada HTML
├── package.json                 # Dependências e scripts do projeto
└── vite.config.js               # Configuração de build do Vite
```

---

## Licença e Uso

Este projeto é um software privado. Foi desenvolvido exclusivamente para uso interno em um contexto de ministério de igreja e não pode ser reproduzido, distribuído, modificado ou utilizado comercialmente, no todo ou em parte, sem permissão escrita explícita do autor.
