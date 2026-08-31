// script.js

const newColorButton = document.getElementById("new-color-btn");
const targetColorBox = document.getElementById("target-color-box");
const targetColorLabel = document.getElementById("target-hex");

let colorToGuess: number[] = [0, 0, 0];

/**
 * Generates a new color by assigning each of the R, G, B values to a random number between 0 and 255 inclusive.
 * Changes the background color of the target-color-box to the generated color.
 */
function generateNewColor() {
    for (let i = 0; i < 3; i++) {
        colorToGuess[i] = Math.floor(Math.random() * 256);
    }
    
    // Set the color of the box
    if (targetColorBox) {
        targetColorBox.style.backgroundColor = `rgb(${colorToGuess[0]}, ${colorToGuess[1]}, ${colorToGuess[2]})`;
    }
    else {
        console.error("Could not find target-color box in the DOM");
    }
    
    // Set the label to the generated color
    if (targetColorLabel) {
        const targetColorValue: number = (colorToGuess[0] << 16) | (colorToGuess[1] << 8) | colorToGuess[2];
        const hexString: string = targetColorValue.toString(16).padStart(6, '0').toUpperCase();
        targetColorLabel.textContent = `#${hexString}`;
    }
    else {
        console.error("Could not find target color label in DOM");
    }
}

if (newColorButton){
    newColorButton.addEventListener("click", generateNewColor);
}
else {
    console.error("Could not find the new color button in the DOM");
}

generateNewColor();