// script.ts

const targetColorBox = document.getElementById("target-color-box") as HTMLElement;
const guessColorBox = document.getElementById("guess-color-box") as HTMLElement;
const guessColorLabel = document.getElementById("guess-hex") as HTMLElement;

const rSlider = document.getElementById("red-slider") as HTMLInputElement;
const gSlider = document.getElementById("green-slider") as HTMLInputElement;
const bSlider = document.getElementById("blue-slider") as HTMLInputElement;


const checkGuessButton = document.getElementById("check-guess-btn") as  HTMLElement;
const newColorButton = document.getElementById("new-color-btn") as HTMLElement;
const scoreLabel = document.getElementById("score-value") as HTMLElement;

const scoreMessage = document.getElementById("score-message") as HTMLElement;
const modalScoreDisplay = document.getElementById("modal-score-value") as HTMLElement;
const scoreModal = document.getElementById("scoreModal") as HTMLElement;
const closeModalButton = document.getElementById("close-modal-btn") as HTMLElement;
const modalTargetHex = document.getElementById("modal-target-hex") as HTMLElement;
const modalTargetR = document.getElementById("modal-target-r") as HTMLElement;
const modalTargetG = document.getElementById("modal-target-g") as HTMLElement;
const modalTargetB = document.getElementById("modal-target-b") as HTMLElement;
const modalTargetColorBox = document.getElementById("modal-target-color-box") as HTMLElement;

let targetColor: number[] = [0, 0, 0];
let guessColor: number[] = [0, 0, 0];
let score = 0;

const messageTiers = [
  { threshold: 100, phrases: ["Flawless!", "Pure Perfection!"] },
  { threshold: 90,  phrases: ["Amazing!", "Elite Vision!"] },
  { threshold: 70,  phrases: ["Great Job!", "Solid Match!"] },
  { threshold: 40,  phrases: ["Not Bad", "Close Enough"] },
  { threshold: 1,   phrases: ["Unlucky!", "Try Harder"] },
  { threshold: 0,   phrases: ["Total Miss!", "Way Off!"] }
];

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

    // reset the score to zero and guess color to black
    score = 0;
    guessColor = [0, 0, 0]

    // resets the color of the guess box and the label to black
    if (guessColorBox) {
        guessColorBox.style.backgroundColor = `rgb(${0}, ${0}, ${0})`;
    }
    if (guessColorLabel) {
        guessColorLabel.textContent = "#000000";
    }

    // hides the score modal
    if (scoreModal) {
        scoreModal.style.display = "none";
    }

    // reset the sliders and their display values
    rSlider.value = "0";
    gSlider.value = "0";
    bSlider.value = "0";

    document.querySelectorAll('.rgb-slider').forEach(el => {
        const slider = el as HTMLInputElement;
        const sliderParent = slider.parentElement;
        const valueDisplay = sliderParent?.querySelector('.value-display') as HTMLElement;

        if (valueDisplay) {
            valueDisplay.textContent = "0";
        }
    });

    // reset the box shadow
    if (guessColorBox) {
        guessColorBox.style.boxShadow = "0 0 40px rgba(0, 0, 0, 0.1)";
    }

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
 * Generates a unique message based on the user's score when making a guess
 * @param score The user's current score
 * @returns A unique string to display to users, based on their score
 */
function getScoreMessage(score: number): string {
    const tier = messageTiers.find(t => score >= t.threshold);

    if (tier) {
        const index = Math.floor(Math.random() * tier.phrases.length);
        return tier.phrases[index];
    }

    return "Done!";
}

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
 * Scores the user's current guess against the target color and returns a percentage score between 0 and 100, where 100 is a perfect match.
 *
 * Each channel's error is normalized by its own headroom (see {@link channelHeadroom}) before the three
 * are combined, so that 0% and 100% are both reachable no matter which target color was chosen.
 */
function calculateScore(): number {
    let sumOfSquares = 0;
    for (let i = 0; i < 3; i++) {
        const normalizedError = Math.abs(guessColor[i] - targetColor[i]) / channelHeadroom(targetColor[i]);
        sumOfSquares += normalizedError ** 2;
    }
    const error = Math.sqrt(sumOfSquares / 3);
    const percentage = (1 - error) * 100.0;
    return Math.max(0, Math.min(100.0, +percentage.toFixed(1)));
}

/**
 * Handles the event when the user checks their guess.
 * It calculates the score, updates the score message, and displays the score in a modal.
 */
function handleCheckGuess() {

    score = calculateScore();

    if (scoreMessage) {
        scoreMessage.textContent = getScoreMessage(score);
    }

    if (modalScoreDisplay) {
        modalScoreDisplay.textContent = `${score.toFixed(1)}%`;
    }

    // Update target color info
    if (modalTargetHex) {
        modalTargetHex.textContent = getHexCode(targetColor);
    }
    if (modalTargetR) {
        modalTargetR.textContent = targetColor[0].toString();
    }
    if (modalTargetG) {
        modalTargetG.textContent = targetColor[1].toString();
    }
    if (modalTargetB) {
        modalTargetB.textContent = targetColor[2].toString();
    }
    if (modalTargetColorBox) {
        modalTargetColorBox.style.backgroundColor = `rgb(${targetColor[0]}, ${targetColor[1]}, ${targetColor[2]})`;
    }

    if (scoreModal) {
        scoreModal.style.display = "flex";
    }
}

newColorButton?.addEventListener("click", initGame);
checkGuessButton?.addEventListener('click', handleCheckGuess);
document.querySelectorAll('.rgb-slider').forEach(el => el?.addEventListener('input', handleSliderInput));

// Close modal functions
function closeModal() {
    if (scoreModal) {
        scoreModal.style.display = "none";
    }
}

closeModalButton?.addEventListener("click", closeModal);

// Close modal when clicking on the overlay background
scoreModal?.addEventListener("click", (event: Event) => {
    if (event.target === scoreModal) {
        closeModal();
    }
});

// initialize the game
initGame();