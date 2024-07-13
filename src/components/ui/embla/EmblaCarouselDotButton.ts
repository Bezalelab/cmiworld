import { type EmblaCarouselType } from 'embla-carousel';

export const addDotBtnsAndClickHandlers = (emblaApi: EmblaCarouselType, dotsNode: HTMLElement): (() => void) => {
  let dotNodes: HTMLElement[] = [];

  const attachClickHandlersToDots = (): void => {
    if (!dotsNode) return;
    dotNodes = Array.from(dotsNode.querySelectorAll('button'));
    
    const scrollTo = (index: number): void => {
      emblaApi.scrollTo(index);
    };

    dotNodes.forEach((dotNode, index) => {
      dotNode.addEventListener('click', () => scrollTo(index), false);
    });
  };

  const toggleDotBtnsActive = (): void => {
    const selected = emblaApi.selectedScrollSnap();
    dotNodes.forEach((dotNode, index) => {
      if (index <= selected) {
        dotNode.classList.add('embla__dot--selected');
      } else {
        dotNode.classList.remove('embla__dot--selected');
      }
    });
  };

  emblaApi.on('init', attachClickHandlersToDots).on('reInit', attachClickHandlersToDots).on('init', toggleDotBtnsActive).on('reInit', toggleDotBtnsActive).on('select', toggleDotBtnsActive);

  return (): void => {
    dotNodes.forEach(dotNode => {
      dotNode.removeEventListener('click', () => {});
    });
  };
};
