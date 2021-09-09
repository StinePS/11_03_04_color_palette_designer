"use strict";

if (typeof window !== "undefined") {
  window.addEventListener("DOMContentLoaded", () => {
    console.log("DOMContentLoaded");
    const allButtons = document.querySelectorAll("button");
    allButtons.forEach((button) => button.addEventListener("click", onClick));
    document.querySelector("input").addEventListener("input", updateColors);

    updateColors();
  });
}

// Delegator/"main" function
function updateColors() {
  const harmonyId = document.querySelector("#buttons .selected").getAttribute("data-id");
  console.log("setHarmony", harmonyId);

  // Get current color-codes
  let hex = document.querySelector("input").value.toUpperCase();
  let rgb = hexToRgb(hex);
  let hsl = rgbToHsl(rgb);

  // Update view
  console.log(hsl);
  const colors = showHarmony(hsl, harmonyId);
  showColors(colors);
}

// Use clone to render 5 color boxes
function showColors(colors) {
  console.log("showColors");
  const temp = document.querySelector("template");
  const container = document.querySelector("#show");
  container.innerHTML = "";
  colors.forEach((hsl) => {
    const rgb = hslToRgb(hsl);
    const hex = rgbToHex(rgb);
    let clone = temp.cloneNode(true).content;
    clone.querySelector(".show-color").style = `background:${hex};`;
    clone.querySelector(".show-hex").textContent = `HEX: ${hex}`;
    clone.querySelector(".show-rgb").textContent = `RGB: ${rgb.r}, ${rgb.g}, ${rgb.b}`;
    clone.querySelector(".show-hsl").textContent = `HSL: ${hsl.h}, ${hsl.s}%, ${hsl.l}%`;
    container.appendChild(clone);
  });
}

function onClick(event) {
  // Remove class "selected" from clicked button
  document.querySelector("#buttons .selected").classList.remove("selected");
  // Add class "selected" to clicked button
  event.target.classList.add("selected");
  // Call showHarmony with selected harmony
  updateColors();
}

function showHarmony(color, operation) {
  console.log(color, operation);
  switch (operation) {
    default:
    case "analog":
      return analogous(color);
    case "mono":
      return monochromatic(color);
    case "tri":
      return triad(color);
    case "compl":
      return complementary(color);
    case "compo":
      return compound(color);
    case "shady":
      return shades(color);
  }
}

// Rotate hue degrees without getting under 0 or above 360
// https://blog.logrocket.com/how-to-manipulate-css-colors-with-javascript-fb547113a1b8/
function rotateHue({ h, ...rest }, rotation) {
  const modulo = (x, n) => ((x % n) + n) % n;
  const newHue = modulo(h + rotation, 360);
  return { h: newHue, ...rest };
}

// Increase or decrease saturation by adjusting s/Saturation
function saturation({ s, ...rest }, saturation) {
  const newSat = Math.min(100, s + saturation);
  return { s: newSat, ...rest };
}

function desaturation({ s, ...rest }, saturation) {
  const newDesat = Math.max(0, s - saturation);
  return { s: newDesat, ...rest };
}

// Lighten or darken color by adjusting l/Lightness
function increaseLightness({ l, ...rest }, lightness) {
  const newLight = Math.min(100, l + lightness);
  return { l: newLight, ...rest };
}

function increaseDarkness({ l, ...rest }, lightness) {
  const newDark = Math.max(0, l - lightness);
  return { l: newDark, ...rest };
}

// Analogous - H is shifted some degrees for each color - you decide how many degrees, it isn't adjustable by the user. S and L are kept constant
function analogous(color) {
  const analogHue = [];
  analogHue.push(rotateHue(color, -60));
  analogHue.push(rotateHue(color, -30));
  analogHue.push({ ...color });
  analogHue.push(rotateHue(color, 30));
  analogHue.push(rotateHue(color, 60));
  return analogHue;
}

// Monochromatic - H is kept constant, each color has either more S, less S, more L or less L (only one change on each color)
function monochromatic(color) {
  const monoSat = [];
  monoSat.push(increaseDarkness(desaturation(color, 30), 20));
  monoSat.push(desaturation(color, 30));
  monoSat.push({ ...color });
  monoSat.push(saturation(color, 30));
  monoSat.push(increaseLightness(saturation(color, 30), 20));
  return monoSat;
}

// Triad - Two colors are shifted 60 or 120 degrees from the base. You decide what to do with the two remaining colors. Usually also shifting them, and adjusting the L is prefered
function triad(color) {
  const triHue = [];
  triHue.push(increaseDarkness(rotateHue(color, 70), 20));
  triHue.push(rotateHue(color, 60));
  triHue.push({ ...color });
  triHue.push(rotateHue(color, 120));
  triHue.push(increaseLightness(rotateHue(color, 130), 20));
  return triHue;
}
// Complementary - One color is at 180 degrees from the base. You decide how to handle the other three!
function complementary(color) {
  const complHue = [];
  complHue.push(increaseLightness(color, 20));
  complHue.push(rotateHue(color, -30));
  complHue.push({ ...color });
  complHue.push(rotateHue(color, 180));
  complHue.push(rotateHue(color, 150));
  return complHue;
}

// Compound - A combination of complementary and analogous - you decide how many colors are complementary, and how many are analogous
function compound(color) {
  const compoHue = [];
  compoHue.push(rotateHue(color, -210));
  compoHue.push(rotateHue(color, -30));
  compoHue.push({ ...color });
  compoHue.push(rotateHue(color, 30));
  compoHue.push(rotateHue(color, 210));
  return compoHue;
}

// Shades - H is kept constant, a so is S, but L varies for each color
function shades(color) {
  const shadyLight = [];
  shadyLight.push(increaseLightness(color, 20));
  shadyLight.push(increaseLightness(color, 10));
  shadyLight.push({ ...color });
  shadyLight.push(increaseDarkness(color, 10));
  shadyLight.push(increaseDarkness(color, 20));
  return shadyLight;
}

//FUNCTIONS FOR CONVERTING COLOR CODES
// Convert 6 digit hex-code (#45ff7a) to rgb using parseInt()
function hexToRgb(hex) {
  const r = parseInt(hex.substring(1, 3), 16);
  const g = parseInt(hex.substring(3, 5), 16);
  const b = parseInt(hex.substring(5), 16);
  // Return decimal rgb values as objects
  return {
    r: r,
    g: g,
    b: b,
  };
}

// Convert rgb to hex
// If hex.length = 1, add a zero (because hex must be 2 digits), otherwise just hex
// https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
function componentToHex(c) {
  let hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex({ r, g, b }) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

// Convert rgb to hsl
function rgbToHsl({ r, g, b }) {
  r /= 255;
  g /= 255;
  b /= 255;

  let h, s, l;

  const min = Math.min(r, g, b);
  const max = Math.max(r, g, b);

  if (max === min) {
    h = 0;
  } else if (max === r) {
    h = 60 * (0 + (g - b) / (max - min));
  } else if (max === g) {
    h = 60 * (2 + (b - r) / (max - min));
  } else if (max === b) {
    h = 60 * (4 + (r - g) / (max - min));
  }

  if (h < 0) {
    h = h + 360;
  }

  l = (min + max) / 2;

  if (max === 0 || min === 1) {
    s = 0;
  } else {
    s = (max - l) / Math.min(l, 1 - l);
  }
  // Multiply s and l by 100 to get the value in percent (rather than [0,1])
  s *= 100;
  l *= 100;

  // Return hsl values as object
  return {
    h: Math.round(h),
    s: Math.round(s),
    l: Math.round(l),
  };
}

// Convert hsl to rgb
function hslToRgb({ h, s, l }) {
  s = s / 100;
  l = l / 100;

  let c = (1 - Math.abs(2 * l - 1)) * s,
    x = c * (1 - Math.abs(((h / 60) % 2) - 1)),
    m = l - c / 2,
    r = 0,
    g = 0,
    b = 0;
  if (0 <= h && h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (60 <= h && h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (120 <= h && h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (180 <= h && h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (240 <= h && h < 300) {
    r = x;
    g = 0;
    b = c;
  } else if (300 <= h && h < 360) {
    r = c;
    g = 0;
    b = x;
  }
  // Return rgb values as object
  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
  };
}
