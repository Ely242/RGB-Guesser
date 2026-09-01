// script.js

const newColorButton = document.getElementById("new-color-btn") as HTMLElement;
const targetColorBox = document.getElementById("target-color-box") as HTMLElement;
const targetColorLabel = document.getElementById("target-hex") as HTMLElement;

const rSlider = document.getElementById("red-slider") as HTMLInputElement;
const gSlider = document.getElementById("green-slider") as HTMLInputElement;
const bSlider = document.getElementById("blue-slider") as HTMLInputElement;
const guessColorBox = document.getElementById("guess-color-box") as HTMLElement;
const guessColorLabel = document.getElementById("guess-hex") as HTMLElement;

let targetColor: number[] = [0, 0, 0];
let guessColor: number[] = [0, 0, 0];

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
 * Generates a new color by assigning each of the R, G, B values to a random number between 0 and 255 inclusive.
 * Changes the background color of the target-color-box to the generated color.
 */
function generateNewColor() {
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

    console.log(guessColor);
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

newColorButton?.addEventListener("click", generateNewColor);
document.querySelectorAll('.rgb-slider').forEach(el => el?.addEventListener('input', handleSliderInput));

updateGuessBox();
generateNewColor();