import EmblaCarousel, { type EmblaOptionsType } from 'embla-carousel';
import { addPrevNextBtnsClickHandlers } from './EmblaCarouselArrowButtons';
import { addDotBtnsAndClickHandlers } from './EmblaCarouselDotButton';
import { addProgressBarHandlers } from './EmblaCarouselProgressBar';
import AutoHeight from 'embla-carousel-auto-height';
import Fade from 'embla-carousel-fade';

const OPTIONS: EmblaOptionsType = {
  loop: false,
  align: 'start'
};

function setupStuff() {
  const emblaNode = document.querySelector('.embla') as HTMLElement | null;
  if (!emblaNode) {
    throw new Error('Embla node not found');
  }

  const viewportNode = emblaNode.querySelector('.embla__viewport') as HTMLElement | null;
  const prevBtnNode = emblaNode.querySelector('.embla__button--prev') as HTMLElement | null;
  const nextBtnNode = emblaNode.querySelector('.embla__button--next') as HTMLElement | null;
  const dotsNode = emblaNode.querySelector('.embla__dots') as HTMLElement | null;
  const progressBarNode = emblaNode.querySelector('.embla__progress-bar') as HTMLElement | null;
  const progressContainerNode = emblaNode.querySelector('.embla__progress') as HTMLElement | null;

  if (!viewportNode) {
    throw new Error('Viewport node not found');
  }

  const hasFadeClass = emblaNode.classList.contains('fade');

  const plugins = hasFadeClass ? [Fade(), AutoHeight()] : [];

  const emblaApi = EmblaCarousel(viewportNode, OPTIONS, plugins);

  const removePrevNextBtnsClickHandlers = prevBtnNode && nextBtnNode ? addPrevNextBtnsClickHandlers(emblaApi, prevBtnNode, nextBtnNode) : () => {};
  const removeDotBtnsAndClickHandlers = dotsNode ? addDotBtnsAndClickHandlers(emblaApi, dotsNode) : () => {};
  const removeProgressBarHandlers = progressBarNode && progressContainerNode && dotsNode ? addProgressBarHandlers(emblaApi, progressBarNode, progressContainerNode, dotsNode) : () => {};

  emblaApi.on('destroy', removePrevNextBtnsClickHandlers);
  emblaApi.on('destroy', removeDotBtnsAndClickHandlers);
  emblaApi.on('destroy', removeProgressBarHandlers);
}

document.addEventListener('astro:page-load', () => {
  setupStuff();
});
