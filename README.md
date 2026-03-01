# Vinit's Hacker-Themed Portfolio

This is a hacker-themed portfolio website with an interactive terminal interface, built specifically for Vinit Vibhandik. Visitors can explore different sections of the portfolio (e.g., projects, contact information) using terminal commands. The application is built using **Angular** and stylized with highly customized animations for a unique, cinematic hacker experience.

## ✨ New Features & Customizations

- **Cinematic Boot Sequence**: The site launches with an animated "All Systems Online" sequence that establishes a dynamically generated IP address before revealing the portfolio.
- **Neon Command Overlay**: A dynamically glowing, multi-colored (green, red, blue, pink) neon cheat sheet that slowly flickers on the screen so users instantly know how to use the terminal.
- **Enhanced Matrix Rain Effect**: The classic green raining code background has been upgraded to include randomized red and blue letters raining down alongside the green.
- **Multi-Role Typewriter**: Automatically cycles through roles like "a backend developer", "a frontend developer", "practicing competitive coding", and "learning Cloud and DevOps".
- **Vercel Ready**: Out-of-the-box support for root domain hosting via Vercel using the configured `vercel.json`.

## 💻 Interactive Terminal

The site features a draggable, fully functional command-line interface built with `xterm.js`. 

### Available Commands:
- `help`: View available commands.
- `ls`: List contents of the current directory.
- `cd <directory>`: Navigate to a specific directory (e.g., `projects`, `contact`).
  - `cd contact` automatically opens your native email client to email Vinit.
  - `cd projects` automatically opens Vinit's GitHub page.
- `clear`: Clear the terminal screen.
- `exit`: Close the terminal.

## 🛠️ Tech Stack

- **Frontend**: Angular
- **Styling**: Pure CSS (Custom Keyframes & Animations)
- **Terminal Engine**: xterm.js
- **Hosting**: Vercel (Configured via `vercel.json`)

## 🚀 Installation & Local Server

1. Clone the repository:
   ```bash
   git clone https://github.com/Vinit-vibhandik22/Vinit_Portfolio.git
   cd Vinit_Portfolio
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the application locally:
   ```bash
   npm run start
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:4200
   ```

## 🌍 Deployment (Vercel)

This project has been specifically optimized for deployment on Vercel. 

1. Ensure your code is pushed to your GitHub repository.
2. Go to your [Vercel Dashboard](https://vercel.com/) and click **Add New Project**.
3. Import the `Vinit_Portfolio` repository.
4. Vercel will auto-detect the Angular framework. Leave the default build commands (`npm run build`) and output directory (`dist/personalpage`).
5. Click **Deploy**.

The `baseHref` in `angular.json` is set to `/` and the `vercel.json` file handles all SPA routing automatically, preventing any `404 Not Found` errors on refresh.
