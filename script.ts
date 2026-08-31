// script.js

const newColorButton = document.getElementById("new-color-btn");
const targetColorBox = document.getElementById("target-color-box");
const targetColorLabel = document.getElementById("target-hex");

const rValueDisplay = document.getElementById("red-value");
const gValueDisplay = document.getElementById("green-value");
const bValueDisplay = document.getElementById("blue-value");

let targetColor: number[] = [0, 0, 0];

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
        const targetColorValue: number = (targetColor[0] << 16) | (targetColor[1] << 8) | targetColor[2];
        const hexString: string = targetColorValue.toString(16).padStart(6, '0').toUpperCase();
        targetColorLabel.textContent = `#${hexString}`;
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
}

newColorButton?.addEventListener("click", generateNewColor);
document.querySelectorAll('.rgb-slider').forEach(el => el?.addEventListener('input', handleSliderInput));

generateNewColor();