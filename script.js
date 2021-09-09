"use strict";

window.addEventListener("DOMContentLoaded", () => {
  console.log("DOMContentLoaded");
  document.querySelector("input").addEventListener("input", showColorInfo);
});

function showColorInfo() {
  // Get current hex-code
  let hex = document.querySelector("input").value.toUpperCase();
  let rgb = hexToRGB(hex);
  let hsl = rgbToHSL(rgb);

  // Show block with current color
  showColor(hex);

  // Show color codes
  showHex(hex);
  showRGB(rgb);
  showHSL(hsl);
}

function showColor(hex) {
  document.querySelector("#show-color").style.backgroundColor = hex;
}

function showHex(hex) {
  document.querySelector("#show-hex").textContent = `HEX: ${hex}`;
}

function showRGB(rgb) {
  document.querySelector("#show-rgb").textContent = `RGB: ${rgb.r}, ${rgb.g}, ${rgb.b}`;
}

function showHSL(hsl) {
  document.querySelector("#show-hsl").textContent = `HSL: ${hsl.h}, ${hsl.s}%, ${hsl.l}%`;
}

// Convert 6 digit hex-code (#45ff7a) to rgb using parseInt()
function hexToRGB(hex) {
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

// If hex.length = 1, add a zero (because hex must be 2 digits), otherwise just hex
// https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
function componentToHex(c) {
  let hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

// Convert rgb to hex
function rgbToHex(r, g, b) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

// Convert rgb to HSL
function rgbToHSL(rgb) {
  let r = rgb.r;
  let g = rgb.g;
  let b = rgb.b;

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

  // Return hsl values as objects
  return {
    h: Math.round(h),
    s: Math.round(s),
    l: Math.round(l),
  };
}

function bringIntoInterval(number, max) {
  while (number < 0) {
    number += max;
  }
  return number % max;
}
