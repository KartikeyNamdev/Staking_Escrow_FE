# SOLVAULT Frontend 🎨

A modern, high-performance dashboard for interacting with the SOLVAULT developer toolbox.

## ✨ Highlights

- **Modern UI**: Clean Glassmorphism aesthetic with a dark-mode first approach.
- **Micro-interactions**: Smooth transitions and animations powered by Framer Motion.
- **Responsive**: Fully functional on desktop and mobile browsers.
- **Real-time Feedback**: Instant notifications for blockchain transactions.

## 🛠 Tech Stack

- **Framework**: Next.js (App Router)
- **Styling**: Vanilla CSS with CSS Modules + PostCSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Integration**: Fetch API for backend communication

## 📂 Structure

- `src/app/page.tsx`: Main dashboard entry point.
- `src/app/globals.css`: Design system and glassmorphism definitions.
- `src/app/page.module.css`: Layout-specific styles.

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

The frontend expects the backend to be running on `http://localhost:3001`.

## 📝 TODO

- [ ] **Wallet Integration**: Replace manual public key input with `@solana/wallet-adapter`.
- [ ] **Transaction Explorer**: Inline view of transaction signatures on Solscan.
- [ ] **Token Management**: UI for minting tokens to specific addresses.
- [ ] **Advanced Features**:
  - Escrow UI implementation.
  - Staking dashboard.
  - Vault management interface.
- [ ] **Theme Support**: Light mode support for the editorial aesthetic.
