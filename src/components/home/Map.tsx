import { useState, useEffect, useRef } from 'react';
import { countries, TestCountries } from '@/utils/countries';
import MapTooltips from '../ui/map-tooltips';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import jsonData from '@/data/countries.json';
gsap.registerPlugin(ScrollTrigger);

const items = [
  { count: 10, title: 'countries', progress: 0 },
  { count: 200, title: 'churches', progress: 50 },
  { count: 25, title: 'years', progress: 100 },
];

export function Map({ countriesData }) {
  const [currentState, setCurrentState] = useState('countries');
  const sectionRef = useRef(null);
  const progressBarRef = useRef(null);
  const maxBarHeight = 375;

  useEffect(() => {
    const section = sectionRef.current;
    const progressBar = progressBarRef.current;

    if (section && window.innerWidth > 768) {
      const updateProgress = (progress) => {
        const height = progress * maxBarHeight;
        gsap.to(progressBar, {
          height: `${height}px`,
        });
      };

      const updateState = (self) => {
        const progress = self.progress;
        if (progress >= 0.5 && progress < 1) {
          setCurrentState('churches');
        } else if (progress >= 1) {
          setCurrentState('years');
        } else {
          setCurrentState('countries');
        }
      };

      ScrollTrigger.create({
        trigger: section,
        pin: true,
        start: 'center 25%',
        end: '+=300%',
        scrub: true,
        onUpdate: (self) => {
          updateState(self);
          updateProgress(self.progress);
        },
      });
    }
  }, []);

  const handleToggle = (state) => {
    setCurrentState(state);
    const item = items.find((i) => i.title === state);
    if (item && window.innerWidth > 768) {
      let progress;
      switch (state) {
        case 'countries':
          progress = 0;
          break;
        case 'churches':
          progress = 0.5;
          break;
        case 'years':
          progress = 1;
          break;
        default:
          progress = 0;
      }

      gsap.to(progressBarRef.current, {
        height: `${progress * maxBarHeight}px`,
        width: '2px',
      });
    } else if (item) {
      gsap.to(progressBarRef.current, {
        width: `${(item.progress / 100) * (window.innerWidth - 2 * 32)}px`,
        height: '1px',
      });
    }
  };

  return (
    <section className="map container pt-20 md:pt-[120px]" id="eastern" ref={sectionRef}>
      <div className="relative mb-10 flex h-[900px] w-full flex-col md:h-[950px] lg:flex-row xl:h-auto">
        <div className="z-20 max-w-4xl">
          <div className="mb-10">
            <h2 className="mb-6 text-[29px] leading-[38px] md:mb-10 md:text-2xl xl:text-3xl">
              Starting Churches in the Nations of <span className="text-gray-3">Eastern Europe</span>
            </h2>
            <p className="mb-4 max-w-[605px] text-sm sm:text-base">
              Albania, Bosnia, Bulgaria, Croatia, Czech Republic, Hungary, Poland, Romania, Serbia, Slovakia and Slovenia already have new churches with God's help through CMI.
            </p>
            <a href="/countries" className="text-[18px] font-medium text-black underline decoration-2 underline-offset-4">
              Learn more
            </a>
          </div>
          <div className="relative z-20">
            <div className="absolute left-0 top-0 h-[1px] w-full bg-gray-300 lg:top-12 lg:h-[375px] lg:w-[2px]"></div>
            <div className="absolute left-0 top-0 h-[1px] overflow-x-hidden bg-black lg:top-12 lg:h-0 lg:w-[2px]" ref={progressBarRef}></div>
            <ol className="relative flex justify-between lg:z-0 lg:flex-col lg:gap-10 lg:pl-14">
              {items.map((item, index) => (
                <li
                  key={index}
                  className={`relative z-20 w-fit cursor-pointer pt-10 transition-colors after:absolute after:-top-[7px] after:size-4 after:-translate-x-1/2 after:rounded-full last:after:left-full lg:pt-0 lg:after:-left-14 lg:after:-top-[5px] lg:first:after:top-10 lg:last:after:-left-14 lg:last:after:top-10 [&:nth-child(2)]:after:left-1/2 lg:[&:nth-child(2)]:after:-left-14 lg:[&:nth-child(2)]:after:top-12 ${
                    currentState === item.title ? 'text-black after:bg-black' : 'text-gray-1 after:bg-gray-1'
                  }`}
                  onClick={() => handleToggle(item.title)}>
                  <div className="flex flex-col gap-2">
                    <span className="lg:text-25 text-[40px] font-medium leading-none text-current sm:text-2xl md:text-3xl md:font-normal lg:text-[100px] lg:leading-[110px]">{item.count}+</span>
                    <span className="text-sm capitalize text-current md:text-lg">{item.title}</span>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
        <div className="absolute -bottom-20 -left-[500px] sm:-left-[400px] md:-bottom-40 md:-left-[300px] lg:left-0 lg:top-20 lg:translate-x-[200px] xl:translate-x-[400px]" id="map">
          <div className="relative after:pointer-events-none after:absolute after:top-20 after:z-10 after:h-[350px] after:w-full after:bg-steps md:mb-20 lg:mb-0 lg:after:hidden">
            <img src="/europe.svg" alt="map" className="max-w-none" />
            <MapTooltips items={TestCountries(jsonData)} currentState={currentState} data={countriesData} />
          </div>
        </div>
      </div>
    </section>
  );
}
