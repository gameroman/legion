import {Class, Stat} from "@legion/shared/enums";

import Toastify from 'toastify-js'

export function classEnumToString(characterClass: Class) {
    const classToName: { [key in Class]?: string } = {};
    classToName[Class.WARRIOR] = "Warrior";
    classToName[Class.WHITE_MAGE] = "White Mage";
    classToName[Class.BLACK_MAGE] = "Black Mage";
    classToName[Class.THIEF] = "Thief";
    return classToName[characterClass];
}

export const statStrings: string[] = Object.keys(Stat)
  .filter(key => isNaN(Number(key)))
  .filter(key => key !== 'NONE')
  .map(key => key.toLowerCase());

interface ExtraStyle {
  background?: string;
  backgroundSize?: string;
}

function showToast(text: string, duration: number = 3000, extraStyle?: ExtraStyle) {
  Toastify({
    text,
    duration,
    close: true,
    gravity: "bottom", // `top` or `bottom`
    position: "center", // `left`, `center` or `right`
    stopOnFocus: true, // Prevents dismissing of toast on hover
    className: "toast",
    style: {
      background: "#242b37",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "12px center",
      backgroundSize: "24px",
      paddingLeft: "44px", // 12px (left padding) + 24px (icon size) + 8px (space between icon and text)
      ...extraStyle
    }
    // onClick: function(){} // Callback after click
  }).showToast();
}

export function successToast(text: string, duration: number = 3000) {
  showToast(text, duration, {
    background: "#242b37 url('svg/success.svg') 12px center no-repeat",
    backgroundSize: "24px"
  });
}

export function errorToast(text: string, duration: number = 3000) {
  showToast(text, duration, {
    background: "#242b37 url('svg/error.svg') 12px center no-repeat",
    backgroundSize: "24px"
  });
}
 
export function mapFrameToCoordinates(frame: number) {
  const width = 10;
  return {
    x: (frame % width) * 32,
    y: Math.floor(frame / width) * 32
  }
}

export function playSoundEffect(src: string) {
  const audio = new Audio(src);
  audio.play().catch(error => console.error('Error playing sound:', error));
}