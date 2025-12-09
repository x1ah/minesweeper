# 💣 Minesweeper Pro

**English** | [简体中文](README.md)

A beautifully designed, modern Minesweeper game built with **React**, **TypeScript**, and **Tailwind CSS**. 

Check out the live demo here: [GitHub Pages Link](https://<YOUR_USERNAME>.github.io/<REPO_NAME>/) *(Replace with your actual link after deployment)*

![Minesweeper Preview](screenshot.svg)

## ✨ Features

*   **Modern UI:** Sleek dark mode aesthetic with glassmorphism effects and fluid animations.
*   **Responsive Layout:**
    *   **Desktop:** Side-by-side layout with history panel and game board.
    *   **Mobile:** Optimized vertical layout with touch-friendly controls and flag mode toggle.
*   **Difficulty Levels:**
    *   Beginner (9x9, 10 mines)
    *   Intermediate (16x16, 40 mines)
    *   Expert (16x30, 99 mines)
*   **Game History:** Automatically saves your last 50 games locally with timestamps and duration.
*   **Smart Mechanics:** First click is always safe (guaranteed 0 or opening).

## 🛠️ Tech Stack

*   [React](https://react.dev/) - UI Library
*   [TypeScript](https://www.typescriptlang.org/) - Type Safety
*   [Vite](https://vitejs.dev/) - Build Tool
*   [Tailwind CSS](https://tailwindcss.com/) - Styling
*   [Lucide React](https://lucide.dev/) - Icons

## 🚀 Getting Started

### Prerequisites

*   Node.js (v18 or higher)
*   npm

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/yourusername/minesweeper-pro.git
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```

## 📦 Deployment

This project is configured for **GitHub Pages**.

1.  Push the code to your GitHub repository.
2.  Go to **Settings** -> **Pages**.
3.  Select **GitHub Actions** as the source.
4.  The included workflow (`.github/workflows/deploy.yml`) will automatically build and deploy the app.

## 📄 License

MIT
