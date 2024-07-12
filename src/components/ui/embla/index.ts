import EmblaCarousel, { type EmblaOptionsType } from 'embla-carousel';
import { addPrevNextBtnsClickHandlers } from './EmblaCarouselArrowButtons';
import { addDotBtnsAndClickHandlers } from './EmblaCarouselDotButton';
import { addProgressBarHandlers } from './EmblaCarouselProgressBar';
import Fade from 'embla-carousel-fade';
import { fetchAPI } from '@/lib/api';

const { page } = await fetchAPI({
  query: `
		query ABOUT {
			 page(id: "about", idType: URI) {
       about {
         breefHistory { sliderItems { year } }
          }
				}
		  }
	`,
});

const yearsArray = page.about.breefHistory.sliderItems.map((item) => item.year.toString());
const OPTIONS: EmblaOptionsType = {
  loop: false,
};

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

const plugins = hasFadeClass ? [Fade()] : [];

const emblaApi = EmblaCarousel(viewportNode, OPTIONS, plugins);

const removePrevNextBtnsClickHandlers = prevBtnNode && nextBtnNode ? addPrevNextBtnsClickHandlers(emblaApi, prevBtnNode, nextBtnNode) : () => {};
const removeDotBtnsAndClickHandlers = dotsNode ? addDotBtnsAndClickHandlers(emblaApi, dotsNode, yearsArray) : () => {};
const removeProgressBarHandlers = progressBarNode && progressContainerNode && dotsNode ? addProgressBarHandlers(emblaApi, progressBarNode, progressContainerNode, dotsNode) : () => {};

emblaApi.on('destroy', removePrevNextBtnsClickHandlers);
emblaApi.on('destroy', removeDotBtnsAndClickHandlers);
emblaApi.on('destroy', removeProgressBarHandlers);
