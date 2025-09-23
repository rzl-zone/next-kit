"use client";

import { validateHTMLColor } from "validate-color";

import type { ColorBase, ColorHex, RzlNextTopLoaderProps } from "../types/types";
import { NProgressEasing } from "../utils/progress";
import * as React from "react";

type UseCssTopLoader = {
  //
  color: string;
  height: string;
  zIndex: number;
  spinnerSize: string;
  spinnerSpeed: number;
  showAtBottom: boolean;
  spinnerEase: NProgressEasing;
  colorSpinner: ColorBase | ColorHex | undefined;
} & Pick<RzlNextTopLoaderProps, "id" | "name" | "nonce" | "style">;

export const useCssTopLoader = ({
  id,
  name,
  nonce,
  style,
  color,
  height,
  spinnerEase,
  colorSpinner,
  zIndex,
  spinnerSize,
  spinnerSpeed,
  showAtBottom
}: UseCssTopLoader) => {
  const positionStyle = showAtBottom ? "bottom: 0;" : "top: 0;";
  const spinnerPositionStyle = showAtBottom ? "bottom: 15px;" : "top: 15px;";

  const validationEaseSpinner = React.useCallback(() => {
    const validEase = ["linear", "ease", "ease-in", "ease-out", "ease-in-out"] as const;

    if (spinnerEase && validEase.includes(spinnerEase)) return spinnerEase;

    return "linear";
  }, [spinnerEase]);

  const validationOfColorSpinner = React.useCallback(() => {
    const colorBase = (colorSpinner as ColorBase)?.ValueBase;
    const colorHex = (colorSpinner as ColorHex)?.ValueHex;

    if (colorBase && colorHex) {
      return "#29f";
    } else {
      if (colorBase) return colorBase;
      if (colorHex && validateHTMLColor(colorHex)) return colorHex;
      return "#29f";
    }
  }, [
    (colorSpinner as ColorBase)?.ValueBase, // Use individual properties
    (colorSpinner as ColorHex)?.ValueHex // Use individual properties
  ]);

  const styles = React.useMemo(() => {
    return (
      typeof style === "string" && style.trim().length
        ? style.replace(/\s\s+/g, "").trim()
        : `
        #nprogress {
          pointer-events: none;
          position: fixed;
          z-index: ${zIndex};
          top: 0;
          left: 0;
          width: 100%;height: ${height};
        }

        #nprogress .bar {
          position: fixed;
          width: 100%;
          left: 0;
          ${positionStyle}
          height: ${height};
          z-index: ${zIndex};
          background: ${color};
        }
        
        #nprogress .peg {
          display: block;
          position: absolute;
          right: 0px;
          width: 100px;
          height: 100%;
          opacity: 1.0;
          box-shadow: 0 0 10px ${color}, 0 0 5px ${color};

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
          border-top-color: ${validationOfColorSpinner()};
          border-left-color: ${validationOfColorSpinner()};
          border-radius: 50%;
          -webkit-animation: nprogress-spinner ${spinnerSpeed}ms ${validationEaseSpinner()} infinite;
                  animation: nprogress-spinner ${spinnerSpeed}ms ${validationEaseSpinner()} infinite;
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
        }
      `
    )
      .replace(/\s\s+/g, "")
      .trim();
  }, [
    style,
    color,
    zIndex,
    height,
    positionStyle,
    spinnerPositionStyle,
    spinnerSize,
    spinnerSpeed,
    validationEaseSpinner,
    validationOfColorSpinner
  ]);

  React.useEffect(() => {
    // Create a new <style> element
    const styleElement = document.createElement("style");

    styleElement.setAttribute("type", "text/css");
    styleElement.setAttribute("data-styles", "rzl-app-loader_bar");

    // Set the 'id' only if it's provided, otherwise it will be undefined
    if (id) {
      styleElement.id = id; // Only set if 'id' is provided
    }

    // Conditionally set the 'name' attributes if they are defined
    if (name) {
      styleElement.setAttribute("name", name);
    }

    // Conditionally set the 'nonce' attributes if they are defined
    if (nonce) {
      styleElement.setAttribute("nonce", nonce);
    }

    // Set the CSS content inside the <style> element
    styleElement.innerHTML = styles;

    // Append the style element to the head
    document.head.appendChild(styleElement);

    // Cleanup when the component is unmounted
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);
};
