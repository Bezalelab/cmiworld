import { useState, useEffect, useRef } from 'react';
import { useInView } from 'react-intersection-observer';
import { TestCountries } from '@/utils/countries';
import MapTooltips from '../ui/map-tooltips';
import jsonData from '@/data/countries.json';
import { ReactSVG } from 'react-svg';

const items = [
  { count: 10, title: 'countries', progress: 0 },
  { count: 200, title: 'churches', progress: 50 },
  { count: 25, title: 'years', progress: 100 },
];

export function Map() {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: false,
  });

  const [currentState, setCurrentState] = useState('countries');
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!inView) return;

    intervalRef.current = setInterval(() => {
      setCurrentState((prevState) => {
        const currentIndex = items.findIndex((item) => item.title === prevState);
        const nextIndex = (currentIndex + 1) % items.length;
        setProgress(items[nextIndex].progress);
        return items[nextIndex].title;
      });
    }, 4000);

    return () => clearInterval(intervalRef.current);
  }, [inView]);

  const handleItemClick = (title) => {
    if (!inView) return;

    const item = items.find((i) => i.title === title);
    if (item) {
      setCurrentState(title);
      setProgress(item.progress);

      clearInterval(intervalRef.current);
      intervalRef.current = setTimeout(() => {
        intervalRef.current = setInterval(() => {
          setCurrentState((prevState) => {
            const currentIndex = items.findIndex((item) => item.title === prevState);
            const nextIndex = (currentIndex + 1) % items.length;
            setProgress(items[nextIndex].progress);
            return items[nextIndex].title;
          });
        }, 4000);
      }, 3000);
    }
  };

  const itemIndex = items.findIndex((i) => i.title === currentState);
  const mappedItems = items.map((item, index) => ({
    ...item,
    isActive: index === itemIndex,
    isActiveOrPassed: index <= itemIndex,
  }));

  return (
    <section className="map container overflow-hidden pt-20 md:overflow-visible md:pt-[120px]" id="eastern" ref={ref}>
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
              Explore these nations
            </a>
          </div>
          <div className="relative z-20">
            <div className="absolute left-0 top-0 h-[3px] w-full bg-gray-300 lg:top-12 lg:h-[375px] lg:w-[3px]"></div>
            <div
              id="progress-bar"
              className="absolute left-0 top-0 h-[3px] overflow-x-hidden bg-black transition-all duration-500 lg:top-12 lg:w-[2px]"
              style={{
                width: window.innerWidth < 768 ? `${progress}%` : '3px',
                height: window.innerWidth < 768 ? '3px' : `${progress * 3.8}px`,
              }}
            />
            <ol className="lg5 :z-0 relative flex justify-between lg:flex-col lg:gap-10 lg:pl-14">
              {mappedItems.map((item, index) => (
                <li
                  key={index}
                  onClick={() => handleItemClick(item.title)}
                  className={`relative z-20 w-fit cursor-pointer pt-10 transition-colors after:absolute after:-top-[7px] after:size-4 after:-translate-x-1/2 after:rounded-full last:after:left-full lg:pt-0 lg:after:-left-[55px] lg:after:-top-[5px] lg:first:after:top-10 lg:last:after:-left-[55px] lg:last:after:top-10 [&:nth-child(2)]:after:left-1/2 lg:[&:nth-child(2)]:after:-left-[55px] lg:[&:nth-child(2)]:after:top-12 ${
                    item.isActive ? 'text-black' : 'text-gray-1'
                  } ${item.isActiveOrPassed ? 'after:bg-black' : 'after:bg-gray-1'}`}>
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
            <ReactSVG src="/europe.svg" />
            <MapTooltips items={TestCountries(jsonData)} />
          </div>
        </div>
      </div>
    </section>
  );
}
