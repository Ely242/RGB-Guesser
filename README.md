# RGB Color Guesser — Refined Plan

## Core Gameplay
1. On load (or "New Color"), generate a random target RGB color.
2. Display the target color in one box (`#target-color-box`) alongside its hex code.
3. The player adjusts three sliders (R, G, B), each ranging 0–255.
4. A second box (`#guess-color-box`) updates live to show the color the sliders currently represent, along with its hex code.
5. When the player clicks "Check Guess", compare their RGB values to the target RGB values and display a score.

## Scoring
* Use Euclidean distance in 3D RGB space: $\sqrt{(R_1-R_2)^2 + (G_1-G_2)^2 + (B_1-B_2)^2}$.
* Convert distance into a 0–100% accuracy score (max distance is $\sqrt{255^2 \times 3} \approx 441.7$).
* Display the resulting score in the results section.

## UI Elements (already scaffolded in `index.html`)
* Two color boxes side by side: target color and current guess.
* Hex labels under each box.
* Three range sliders (R, G, B) with numeric value readouts.
* "Check Guess" button to score the current guess.
* "New Color" button to reset with a fresh random target.
* Results section showing the score.

## Not Yet Implemented
* JavaScript logic (random color generation, live guess-box updates, scoring, button handlers).
* Visual color styling (currently only sizing/padding/placement styles exist — colors will be added once JS is in place).

## Stretch Ideas (future)
* Difficulty modes (e.g., hide target color after a few seconds).
* "Hot or cold" visual feedback as sliders get closer to the target.
* Leaderboard / persistent high scores.

