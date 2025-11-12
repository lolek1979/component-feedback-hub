/**
 * Calculates the width of a given text string in pixels using a specified font.
 *
 * Uses a canvas element for accurate measurement. Falls back to a rough estimate if canvas is unavailable.
 *
 * @param text - The text string to measure.
 * @param font - The CSS font property (e.g., '16px Arial').
 * @returns The width of the text in pixels.
 *
 * @example
 * const width = getTextWidth('Hello world', '16px Arial');
 */
export const getTextWidth = (text: string, font: string): number => {
  // Re-use a canvas object for better performance
  const canvas =
    (getTextWidth as any).canvas ||
    ((getTextWidth as any).canvas = document.createElement('canvas'));
  const context = canvas.getContext('2d');

  if (context) {
    context.font = font;
    const metrics = context.measureText(text);

    return metrics.width + 20;
  }

  // Fallback for server-side rendering or environments without Canvas
  return text.length * 8; // Rough estimate
};
