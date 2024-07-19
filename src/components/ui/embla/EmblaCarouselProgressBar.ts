import { type EmblaCarouselType } from 'embla-carousel';

export const addProgressBarHandlers = (emblaApi: EmblaCarouselType, progressBarNode: HTMLElement | null, progressContainerNode: HTMLElement | null, dotsNode: HTMLElement | null): (() => void) => {
  const updateProgressBar = (): void => {
    if (!progressBarNode) return;
    const progress = Math.max(0, Math.min(1, emblaApi.scrollProgress()));
    progressBarNode.style.width = `${progress * 98 + 2}%`;
  };

  const setProgressContainerWidth = (): void => {
    if (!progressContainerNode || !dotsNode) return;
    const dotsWidth = dotsNode.scrollWidth;
    progressContainerNode.style.width = `${dotsWidth - 20}px`;
  };

  emblaApi
    .on('scroll', () => {
      requestAnimationFrame(updateProgressBar);
    })
    .on('init', () => {
      updateProgressBar();
      setProgressContainerWidth();
    })
    .on('reInit', () => {
      updateProgressBar();
      setProgressContainerWidth();
    });

  window.addEventListener('resize', setProgressContainerWidth);

  setProgressContainerWidth();

  return (): void => {
    if (progressBarNode) {
      progressBarNode.style.width = '0%';
    }
    window.removeEventListener('resize', setProgressContainerWidth);
  };
};
