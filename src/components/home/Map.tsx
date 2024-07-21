import { useState, useEffect, useRef, useCallback } from 'react';
import { TestCountries } from '@/utils/countries';
import MapTooltips from '../ui/map-tooltips';
import { useSpring, animated } from '@react-spring/web';
import jsonData from '@/data/countries.json';
const items = [
  { count: 10, title: 'countries', progress: 0 },
  { count: 200, title: 'churches', progress: 50 },
  { count: 25, title: 'years', progress: 100 },
];

export function Map() {
  const [currentState, setCurrentState] = useState('countries');
  const [isPaused, setIsPaused] = useState(false);
  const currentProgressRef = useRef(0);
  const intervalRef = useRef(null);
  const animationRef = useRef(null);
  const pauseTimeoutRef = useRef(null);

  const setProgress = useCallback((progress, duration = 250) => {
    const startProgress = currentProgressRef.current;
    const startTime = performance.now();

    const animateToProgress = (timestamp) => {
      const elapsed = timestamp - startTime;
      if (elapsed < duration) {
        const t = elapsed / duration;
        const currentProgress = startProgress + (progress - startProgress) * t;
        currentProgressRef.current = currentProgress;

        const progressBar = document.getElementById('progress-bar');
        if (progressBar) {
          if (window.innerWidth < 768) {
            progressBar.style.width = `${currentProgress}%`;
          } else {
            progressBar.style.height = `${currentProgress * 3.8}px`;
          }
        }

        requestAnimationFrame(animateToProgress);
      } else {
        currentProgressRef.current = progress;
        const progressBar = document.getElementById('progress-bar');
        if (progressBar) {
          if (window.innerWidth < 768) {
            progressBar.style.width = `${progress}%`;
          } else {
            progressBar.style.height = `${progress * 3.8}px`;
          }
        }
      }
    };

    requestAnimationFrame(animateToProgress);
  }, []);

  const animateProgress = useCallback(
    (timestamp) => {
      if (!animationRef.current.startTime) {
        animationRef.current.startTime = timestamp;
      }

      const elapsed = timestamp - animationRef.current.startTime;
      const duration = 5000; // 5 seconds

      let newProgress;
      if (currentState === 'countries') {
        newProgress = (elapsed / duration) * 50;
      } else if (currentState === 'churches') {
        newProgress = 50 + (elapsed / duration) * 50;
      } else {
        newProgress = 100; // Для 'years' прогресс остается на 100%
      }

      if (elapsed < duration) {
        setProgress(newProgress, 0); // Устанавливаем длительность 0 для плавной анимации
        animationRef.current.frameId = requestAnimationFrame(animateProgress);
      } else {
        setProgress(currentState === 'years' ? 100 : newProgress, 0);
        animationRef.current.frameId = null;
      }
    },
    [currentState, setProgress],
  );

  useEffect(() => {
    if (isPaused) return;

    if (animationRef.current?.frameId) {
      cancelAnimationFrame(animationRef.current.frameId);
    }

    if (currentState === 'countries' && currentProgressRef.current === 100) {
      setProgress(0);
      setTimeout(() => {
        animationRef.current = {
          startTime: null,
          frameId: requestAnimationFrame(animateProgress),
        };
      }, 250);
    } else {
      animationRef.current = {
        startTime: null,
        frameId: requestAnimationFrame(animateProgress),
      };
    }

    return () => {
      if (animationRef.current?.frameId) {
        cancelAnimationFrame(animationRef.current.frameId);
      }
    };
  }, [currentState, isPaused, animateProgress, setProgress]);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCurrentState((prevState) => {
        const currentIndex = items.findIndex((item) => item.title === prevState);
        const nextIndex = (currentIndex + 1) % items.length;
        return items[nextIndex].title;
      });
    }, 5000);

    return () => clearInterval(intervalRef.current);
  }, []);

  const handleItemClick = useCallback(
    (title) => {
      setCurrentState(title);
      clearInterval(intervalRef.current);

      if (title === 'countries') {
        setProgress(0, 500); // Устанавливаем длительность 500ms для плавной анимации
      } else if (title === 'churches') {
        setProgress(50, 500);
      } else if (title === 'years') {
        setProgress(100, 500);
      }

      setIsPaused(true);
      if (pauseTimeoutRef.current) {
        clearTimeout(pauseTimeoutRef.current);
      }
      pauseTimeoutRef.current = setTimeout(() => {
        setIsPaused(false);
        intervalRef.current = setInterval(() => {
          setCurrentState((prevState) => {
            const currentIndex = items.findIndex((item) => item.title === prevState);
            const nextIndex = (currentIndex + 1) % items.length;
            return items[nextIndex].title;
          });
        }, 5000);
      }, 3000);
    },
    [setProgress],
  );

  const itemIndex = items.findIndex((i) => i.title === currentState);
  const mappedItems = items.map((item, index) => ({
    ...item,
    isActive: index === itemIndex,
    isActiveOrPassed: index <= itemIndex,
  }));

  return (
    <section className="map container pt-20 md:pt-[120px]" id="eastern">
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
            <div className="absolute left-0 top-0 h-[3px] w-full bg-gray-300 lg:top-12 lg:h-[375px] lg:w-[3px]"></div>
            <animated.div
              id="progress-bar"
              className="absolute left-0 top-0 h-[3px] overflow-x-hidden bg-black lg:top-12 lg:w-[2px]"
              style={{
                width: window.innerWidth < 768 ? `${currentProgressRef.current}%` : '3px',
                height: window.innerWidth < 768 ? '3px' : `${currentProgressRef.current * 3.8}px`,
              }}></animated.div>
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
            <img src="/europe.svg" alt="map" className="max-w-none" />
            <MapTooltips items={TestCountries(jsonData)} currentState={currentState} />
          </div>
        </div>
      </div>
    </section>
  );
}
