const handleFormNavigation = (e: React.KeyboardEvent<HTMLFormElement>) => {
  if (e.key === 'Enter') {
    e.preventDefault();
  }
  const focusableElements = Array.from(
    e.currentTarget.querySelectorAll('input, textarea, select, button, svg[tabindex]'),
  ) as HTMLElement[];
  const currentIndex = focusableElements.indexOf(document.activeElement as HTMLElement);
  if (e.key === 'ArrowDown' && currentIndex < focusableElements.length - 1) {
    e.preventDefault();
    focusableElements[currentIndex + 1].focus();
  } else if (e.key === 'ArrowUp' && currentIndex > 0) {
    e.preventDefault();
    focusableElements[currentIndex - 1].focus();
  }
};
export { handleFormNavigation };
