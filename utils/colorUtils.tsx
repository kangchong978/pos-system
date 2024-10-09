export const getColor = (colorVar: string) => {
  if (typeof window === 'undefined') return ''; // For SSR compatibility
  const root = document.documentElement;
  const colorValue = getComputedStyle(root).getPropertyValue(`--color-${colorVar}`).trim();
  return `rgb(${colorValue})`;
};

export const getColorWithOpacity = (colorVar: string, opacity: number) => {
  if (typeof window === 'undefined') return; // For SSR compatibility
  const root = document.documentElement;
  const colorValue = getComputedStyle(root).getPropertyValue(`--color-${colorVar}`).trim();
  return `rgba(${colorValue}, ${opacity})`;
};

