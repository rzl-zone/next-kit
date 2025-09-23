import type { ColorBase, ColorHex } from "../types/types";
import { validateHTMLColor } from "validate-color";
import { NProgressEasing } from "./progress";

export const cssNpProgress = ({
  color,
  height,
  // spinnerPosition,
  spinnerEase,
  colorSpinner,
  zIndex,
  spinnerSize,
  spinnerSpeed,
  showAtBottom
}: {
  color?: string;
  height?: string;
  // spinnerPosition?: SpinnerPosition;
  spinnerEase?: NProgressEasing;
  colorSpinner: ColorBase | ColorHex | undefined;
  zIndex: number;
  spinnerSpeed: number;
  spinnerSize: string;
  showAtBottom: boolean;
}) => {
  const positionStyle = showAtBottom ? "bottom: 0;" : "top: 0;";
  const spinnerPositionStyle = showAtBottom ? "bottom: 15px;" : "top: 15px;";

  const validEaseSpinner = () => {
    const validEase = ["linear", "ease", "ease-in", "ease-out", "ease-in-out"] as const;
    if (spinnerEase && validEase.includes(spinnerEase)) return spinnerEase;

    return "linear";
  };

  const colorSpinnerValidator = (): string => {
    const colorBase = (colorSpinner as ColorBase)?.ValueBase;
    const colorHex = (colorSpinner as ColorHex)?.ValueHex;

    if ((colorBase && colorHex) || (!colorBase && !colorHex)) {
      return "#29f";
    } else {
      if (colorBase) return colorBase;
      if (colorHex && validateHTMLColor(colorHex)) return colorHex;
      return "#29f";
    }
  };

  return `
  #nprogress {
    pointer-events: none;
    position: fixed;
    z-index: ${zIndex};
    top: 0;
    left: 0;
    width: 100%;height: ${height};
  }

  #nprogress .bar {
    background: ${color};
    position: fixed;
    z-index: ${zIndex};
    ${positionStyle}
    left: 0;

    width: 100%;
    height: ${height};
  }
  
  #nprogress .peg {
    display: block;
    position: absolute;
    right: 0px;
    width: 100px;
    height: 100%;
    box-shadow: 0 0 10px ${color}, 0 0 5px ${color};
    opacity: 1.0;

    -webkit-transform: rotate(3deg) translate(0px, -4px);
        -ms-transform: rotate(3deg) translate(0px, -4px);
            transform: rotate(3deg) translate(0px, -4px);
  }
  
  #nprogress .spinner {
    display: block;
    position: fixed;
    z-index: ${zIndex};
    ${spinnerPositionStyle}
    right:15px;
  }

  #nprogress .spinner-icon {
    width: 18px;
    height: 18px;
    box-sizing: border-box;
    border: solid ${spinnerSize} transparent;
    border-top-color: ${colorSpinnerValidator()};
    border-left-color: ${colorSpinnerValidator()};
    border-radius: 50%;
    -webkit-animation: nprogresss-spinner ${spinnerSpeed}ms ${validEaseSpinner()} infinite;
            animation: nprogress-spinner ${spinnerSpeed}ms ${validEaseSpinner()} infinite;
  }

  .nprogress-custom-parent {
    overflow: hidden;
    position: relative;
  }

  .nprogress-custom-parent #nprogress .spinner,
  .nprogress-custom-parent #nprogress .bar {
    position: absolute;
  }

  @-webkit-keyframes nprogress-spinner {
    0%   { -webkit-transform: rotate(0deg); }
    100% { -webkit-transform: rotate(360deg); }
  }
  @keyframes nprogress-spinner {
    0%   { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }`
    .replace(/\s\s+/g, "")
    .trim();
};
