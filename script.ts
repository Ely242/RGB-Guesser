// script.ts

const newColorButton = document.getElementById("new-color-btn") as HTMLElement;
const targetColorBox = document.getElementById("target-color-box") as HTMLElement;
const targetColorLabel = document.getElementById("target-hex") as HTMLElement;

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

/**
 * The largest error reachable on a single channel for a given target value, i.e. the distance to
 * whichever end of the 0-255 range is further away. Never below 127.5, so it is safe to divide by.
 * @param target - The target value for one channel
 * @returns The maximum achievable absolute error on that channel
 */
function channelHeadroom(target: number): number {
    return Math.max(target, 255 - target);
}

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
    // Set the label to the generated color
    if (targetColorLabel) {
        targetColorLabel.textContent = getHexCode(targetColor);
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
 * Scores the user's current guess against the target color and calls {@link updateScore} to display it.
 *
 * Each channel's error is normalized by its own headroom (see {@link channelHeadroom}) before the three
 * are combined, so that 0% and 100% are both reachable no matter which target color was chosen.
 */
function handleCheckGuess() {
    let sumOfSquares = 0;
    for (let i = 0; i < 3; i++) {
        const normalizedError = Math.abs(guessColor[i] - targetColor[i]) / channelHeadroom(targetColor[i]);
        sumOfSquares += normalizedError ** 2;
    }

    const error = Math.sqrt(sumOfSquares / 3);
    const percentage = (1 - error) * 100.0;
    score = Math.max(0, Math.min(100.0, +percentage.toFixed(1)));

    updateScore();
}

newColorButton?.addEventListener("click", initGame);
checkGuessButton?.addEventListener('click', handleCheckGuess);
document.querySelectorAll('.rgb-slider').forEach(el => el?.addEventListener('input', handleSliderInput));

// initialize the game
initGame();