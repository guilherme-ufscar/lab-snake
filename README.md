<p align="center">
  <img src="https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white" alt="React 18" />
  <img src="https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind" />
  <img src="https://img.shields.io/badge/Capacitor-8-119EFF?logo=capacitor&logoColor=white" alt="Capacitor" />
  <img src="https://img.shields.io/badge/Canvas_API-HTML5-E34F26?logo=html5&logoColor=white" alt="Canvas" />
</p>

<h1 align="center">Lab Snake</h1>

<p align="center">
  Um jogo de puzzle onde você guia uma serpente através de labirintos cada vez mais complexos,<br/>
  planejando cada movimento com precisão — porque os passos são limitados.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Fases-30-green" alt="30 Fases" />
  <img src="https://img.shields.io/badge/Plataforma-Web%20%7C%20Android-blue" alt="Web + Android" />
</p>

---

## Sobre o Projeto

**Lab Snake** é um jogo de puzzle baseado em labirintos com mecânica de movimentos limitados. Diferente de um jogo de cobrinha convencional, aqui cada movimento conta — o jogador precisa planejar a rota ideal para alcançar a saída antes que os passos acabem.

O jogo conta com **30 fases** com dificuldade progressiva:

| Fases | Tamanho do Labirinto | Dificuldade |
|-------|---------------------|-------------|
| 1–5   | 5×5                  | Fácil — movimentos de sobra |
| 6–10  | 6×6                  | Moderada — margem confortável |
| 11–15 | 7×7                  | Difícil — margem apertada |
| 16–20 | 8×8                  | Expert — quase sem margem |
| 21–25 | 9×9                  | Mestre — precisão total |
| 26–30 | 10×10                | Grandmaster — caminho perfeito obrigatório |

Nas fases finais, a quantidade de movimentos permitidos é **exatamente** igual ao caminho mais curto (calculado por BFS), exigindo a solução ótima.

---

## Funcionalidades

- **30 labirintos únicos** gerados por algoritmo de recursive backtracking com sementes determinísticas
- **Dificuldade matemática progressiva** — surplus de movimentos diminui gradualmente até zero
- **Renderização em Canvas 2D** — serpente orgânica com cabeça direcional, olhos, língua bifurcada e corpo com textura
- **Labirintos estilizados** — paredes com gradientes, bordas arredondadas e efeitos 3D sutis
- **Interface Glassmorphism** — blur, transparências e gradientes suaves com Tailwind CSS
- **Animações fluidas** — transições de tela, contadores animados e modais com spring physics (Framer Motion)
- **Controles múltiplos** — teclado (setas/WASD), botões D-pad na tela e detecção de swipe para touchscreen
- **Progresso salvo** — fases desbloqueadas persistidas via localStorage
- **Responsivo** — funciona em desktop e celular
- **Compatível com Android** — projeto Capacitor incluso para gerar APK

---

## Tecnologias

| Tecnologia | Uso |
|---|---|
| **React 18** | Gerenciamento de estado e componentes |
| **Vite 6** | Build tool e dev server |
| **Tailwind CSS 3** | Estilização, glassmorphism e responsividade |
| **Framer Motion** | Animações e transições entre telas |
| **Canvas API (HTML5)** | Renderização do labirinto e da serpente |
| **Lucide React** | Ícones vetoriais (cadeados, setas, troféu, etc.) |
| **Capacitor 8** | Empacotamento como app Android (APK) |
| **localStorage** | Persistência de progresso do jogador |

---

## Como Jogar

### Windows (mais fácil)

> **Pré-requisito:** [Node.js](https://nodejs.org) instalado (baixe a versão LTS).

1. Baixe ou clone este repositório
2. Dê **duplo clique** em `Iniciar Jogo.bat`
3. Na primeira vez, ele instala as dependências automaticamente
4. O navegador abre sozinho — é só jogar!

### Linha de comando (qualquer OS)

```bash
# Clone o repositório
git clone https://github.com/guilherme-ufscar/lab-snake.git
cd lab-snake

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

Acesse `http://localhost:5173` no navegador.

### Jogar no celular (mesma rede Wi-Fi)

1. Inicie o jogo no computador (usando o .bat ou `npm run dev`)
2. No terminal, veja o endereço **Network** (ex.: `http://192.168.x.x:5173`)
3. Abra esse endereço no navegador do celular

---

## Controles

| Entrada | Ação |
|---|---|
| `↑ ↓ ← →` ou `W A S D` | Mover a serpente |
| `R` | Reiniciar a fase |
| Swipe na tela | Mover (touchscreen) |
| Botões D-pad | Mover (na tela) |

---

## Gerar APK (Android)

> **Pré-requisito:** [Android Studio](https://developer.android.com/studio) instalado.

```bash
# Build do projeto web
npm run build

# Sincronizar com o projeto Android
npx cap sync android

# Abrir no Android Studio
npx cap open android
```

No Android Studio: **Build → Build Bundle(s) / APK(s) → Build APK**

O APK gerado estará em:
```
android/app/build/outputs/apk/debug/app-debug.apk
```

---

## Estrutura do Projeto

```
lab-snake/
├── src/
│   ├── components/
│   │   ├── MainMenu.jsx        # Tela inicial com animações
│   │   ├── LevelSelect.jsx     # Grade 5×6 de seleção de fases
│   │   ├── Game.jsx            # Lógica principal de gameplay
│   │   ├── GameCanvas.jsx      # Renderização Canvas 2D
│   │   ├── HUD.jsx             # Interface durante o jogo
│   │   └── Modal.jsx           # Modais de vitória/derrota
│   ├── data/
│   │   └── levels.js           # Gerador de 30 labirintos + BFS
│   ├── hooks/
│   │   └── useNativeBack.js    # Hook para botão voltar (Android)
│   ├── utils/
│   │   ├── storage.js          # Persistência via localStorage
│   │   └── native.js           # Inicialização Capacitor
│   ├── App.jsx                 # Roteamento entre telas
│   ├── main.jsx                # Entry point
│   └── index.css               # Estilos globais + Tailwind
├── android/                    # Projeto Android (Capacitor)
├── capacitor.config.json       # Configuração do Capacitor
├── tailwind.config.js          # Configuração do Tailwind CSS
├── vite.config.js              # Configuração do Vite
├── Iniciar Jogo.bat            # Launcher para Windows
└── package.json
```

---

## Algoritmos

- **Geração de labirintos:** Recursive Backtracking com PRNG determinístico (Mulberry32) — garante que cada fase seja sempre idêntica
- **Caminho mais curto:** BFS (Breadth-First Search) calcula a distância mínima start→end para definir o budget de movimentos
- **Progressão:** O surplus de movimentos diminui de 60% (fase 1) até 0% (fases finais), forçando o caminho ótimo

---

## Scripts Disponíveis

| Comando | Descrição |
|---|---|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção (pasta `dist/`) |
| `npm run preview` | Preview do build local |
| `npm run cap:sync` | Build + sync para Android |
| `npm run cap:open` | Abrir projeto no Android Studio |

---

## Licença

Este projeto é de uso livre para fins educacionais e pessoais.
