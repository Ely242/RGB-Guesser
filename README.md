# Color Guesser

A browser-based RGB color matching game where players try to recreate a randomly generated target color using red, green, and blue sliders. As the sliders move, the guessed color updates live, and the app scores how close the guess is to the target once the player submits it.

## Features

- Random target color generation
- Live color preview while adjusting RGB values
- Hex code and RGB value readouts
- Score calculation after each guess
- Modal feedback with the target color and result summary
- Simple static web app setup with no dependencies

## How to Play

1. Open the app in a browser.
2. Adjust the Red, Green, and Blue sliders to match the target color.
3. Click "Check Guess" to see your score.
4. Use "New Color" to generate a fresh challenge.

## Local Setup

Because this is a static front-end project, you can run it in any of the following ways:

- Open `index.html` directly in your browser
- Or run a local static server:

  python -m http.server 8000

Then visit http://localhost:8000 in your browser.

## Project Structure

- `index.html` — page structure and game UI
- `styles.css` — visual styling and layout
- `script.js` — random color generation, slider logic, and scoring
- `assets/` — project assets such as the favicon

## Repo Description

A small interactive color guessing game built with HTML, CSS, and JavaScript to test color perception and RGB matching skills.

