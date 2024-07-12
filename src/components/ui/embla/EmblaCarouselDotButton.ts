import { type EmblaCarouselType } from 'embla-carousel';

export const addDotBtnsAndClickHandlers = (emblaApi: EmblaCarouselType, dotsNode: HTMLElement, labels: string[]): (() => void) => {
  let dotNodes: HTMLElement[] = [];

  const addDotBtnsWithClickHandlers = (): void => {
    if (!dotsNode) return;
    dotsNode.innerHTML = emblaApi
      .scrollSnapList()
      .map((_, index) => `<button class="embla__dot" type="button"><span class="switch-title">${labels[index]}</span></button>`)
      .join('');

    const scrollTo = (index: number): void => {
      emblaApi.scrollTo(index);
    };

    dotNodes = Array.from(dotsNode.querySelectorAll('.embla__dot'));
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

  emblaApi
    .on('init', addDotBtnsWithClickHandlers)
    .on('reInit', addDotBtnsWithClickHandlers)
    .on('init', toggleDotBtnsActive)
    .on('reInit', toggleDotBtnsActive)
    .on('select', toggleDotBtnsActive);

  return (): void => {
    dotsNode.innerHTML = '';
  };
};
