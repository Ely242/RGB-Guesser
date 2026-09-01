// script.ts

const newColorButton = document.getElementById("new-color-btn") as HTMLElement;
const targetColorBox = document.getElementById("target-color-box") as HTMLElement;

const rSlider = document.getElementById("red-slider") as HTMLInputElement;
const gSlider = document.getElementById("green-slider") as HTMLInputElement;
const bSlider = document.getElementById("blue-slider") as HTMLInputElement;
const guessColorBox = document.getElementById("guess-color-box") as HTMLElement;
const guessColorLabel = document.getElementById("guess-hex") as HTMLElement;

const scoreLabel = document.getElementById("score-value") as HTMLElement;
const checkGuessButton = document.getElementById("check-guess-btn") as  HTMLElement;

let targetColor: number[] = [0, 0, 0];
let guessColor: number[] = [0, 0, 0];
let score = 0;
const MAX_DISTANCE = Math.sqrt((255 ** 2) * 3);

/**
 * Initializes the game by generating a new target color, updating the target color box and label,
 * resetting the guess box, and resetting the score.
 */
function initGame() {
    // Generate a new target color
    for (let i = 0; i < 3; i++) {
        targetColor[i] = Math.floor(Math.random() * 256);
    }
    // Set the color of the box
    if (targetColorBox) {
        targetColorBox.style.backgroundColor = `rgb(${targetColor[0]}, ${targetColor[1]}, ${targetColor[2]})`;
    }

    updateGuessBox();
    score = 0;
    updateScore();
}

/**
 * Changes the array representing a color to a string representing it's hexadecimal representation
 * @param values - An array of size 3, representing the color
 * @returns A string of length 7, representing the color's hex code in the format #FFFFFF
 */
function getHexCode(values: number[]): string {
    if (values.length !== 3 || Math.max(...values) > 255 || Math.min(...values) < 0) {
        return "#FFFFFF";
    }
    const val: number = (values[0] << 16) | (values[1] << 8) | values[2];
    return `#${val.toString(16).padStart(6, '0').toUpperCase()}`;
}

/**
 * Update's the background color of the box that shows the user's current guess based on the RGB slider values.
 */
function updateGuessBox() {
    const r = +rSlider.value;
    const g = +gSlider.value;
    const b = +bSlider.value;
  
    guessColor = [r, g, b];
    if (guessColorBox) {
        guessColorBox.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
    }
    if (guessColorLabel) {
        guessColorLabel.textContent = getHexCode(guessColor);
    }
}

/**
 * Changes the text content of the label that represents the R, G, B values respectively
 */
const handleSliderInput = (event: Event): void => {
    const slider = event.currentTarget as HTMLInputElement;

    const sliderParent = slider.parentElement;
    const valueDisplay = sliderParent?.querySelector('.value-display') as HTMLElement;

    if (valueDisplay) {
        valueDisplay.textContent = slider.value;
    }

    if (guessColorBox) {
        guessColorBox.style.boxShadow = `0 0 40px rgba(${rSlider.value}, ${gSlider.value}, ${bSlider.value}, 0.5)`;
    }

    updateGuessBox();
}

/**
 * Updates the label to display the current score
 */
function updateScore() {
    if (scoreLabel) {
        scoreLabel.textContent = `${score.toFixed(1)}%`;
    }
}

/**
 * Calculates the distance between the target color and the user's current guess, changes it
 * to a percentage, and calls {@link updateScore} to update with the current score.
 */
function handleCheckGuess() {
    // get color values
    const [r1, g1, b1] = guessColor;
    const [r2, g2, b2] = targetColor;

    // calculate euclidean distance
    const dist = Math.sqrt((r1 - r2) ** 2 + (g1 - g2) ** 2 + (b1 - b2) ** 2);
    const percentage = (1 - dist / MAX_DISTANCE) * 100.0;
    score = Math.max(0, Math.min(100.0, +percentage.toFixed(1)));

    updateScore();
}

newColorButton?.addEventListener("click", initGame);
checkGuessButton?.addEventListener('click', handleCheckGuess);
document.querySelectorAll('.rgb-slider').forEach(el => el?.addEventListener('input', handleSliderInput));

// initialize the game
initGame();