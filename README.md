# Minesweeper Game

A classic Minesweeper game built with HTML, CSS, and JavaScript.

## Features

- Three difficulty levels: Beginner, Medium, Expert
- Manual mine positioning mode
- Safe click feature
- Hint system
- Lives system
- High score tracking
- Responsive design

## How to Play

1. Choose your difficulty level
2. Click on cells to reveal them
3. Right-click to mark suspected mines
4. Use hints and safe clicks to help you
5. Avoid clicking on mines!

## Deployment to Render

### Prerequisites
- A GitHub account
- A Render account (free at render.com)

### Steps to Deploy

1. **Push your code to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git push -u origin main
   ```

2. **Deploy on Render:**
   - Go to [render.com](https://render.com)
   - Sign up/Login with your GitHub account
   - Click "New +" and select "Web Service"
   - Connect your GitHub repository
   - Use these settings:
     - **Name:** minesweeper-game
     - **Environment:** Node
     - **Build Command:** `npm install`
     - **Start Command:** `npm start`
     - **Plan:** Free
   - Click "Create Web Service"

3. **Your game will be live!**
   - Render will provide you with a URL like: `https://minesweeper-game.onrender.com`
   - The deployment will take a few minutes

### Local Development

To run the game locally:

```bash
npm install
npm start
```

Then open http://localhost:3000 in your browser.

## Project Structure

```
├── index.html          # Main HTML file
├── css/
│   └── style.css       # Game styles
├── js/
│   └── game.js         # Game logic
├── img/                # Game images
├── server.js           # Express server
├── package.json        # Node.js dependencies
└── render.yaml         # Render configuration
```

## Technologies Used

- HTML5
- CSS3
- JavaScript (ES6+)
- Express.js
- Node.js