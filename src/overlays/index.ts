// This file maps movie names to their overlay PNG image paths.
// Add new entries for each movie and corresponding PNG overlay.

import salaarOverlay from "../overlays/salaar.png";
import starWarsOverlay from "../overlays/starwars.png";
import theMatrixOverlay from "../overlays/thematrix.png";
// Add more imports below as needed
// Example:
// import inceptionOverlay from "../overlays/inception.png";

export const movieOverlays: Record<string, string> = {
	Salaar: salaarOverlay,
	StarWars: starWarsOverlay,
	TheMatrix: theMatrixOverlay,
	// Add more movies below
	// Example:
	// 'Inception': inceptionOverlay,
};
