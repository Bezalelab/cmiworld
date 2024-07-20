import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useDebounce } from '@uidotdev/usehooks';
import { CircleFlag } from 'react-circle-flags';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useInView } from 'react-intersection-observer';

function preloadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = resolve;
    img.onerror = reject;
    img.src = src;
  });
}

const MapTooltips = ({ items, currentState }) => {
  const [openStates, setOpenStates] = useState(() => new Array(items.length).fill(false));
  const [shownTooltips, setShownTooltips] = useState([]);
  const [isHoveringMap, setIsHoveringMap] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const debouncedOpenStates = useDebounce(openStates, 500);
  const intervalRef = useRef(null);

  const { ref: intersectionRef, inView } = useInView({
    triggerOnce: false,
    threshold: 0.5,
  });

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const imagesToPreload = ['/churches.svg', '/churches-tooltip.svg'];
    Promise.all(imagesToPreload.map(preloadImage))
      .then(() => setImagesLoaded(true))
      .catch((err) => console.error('Error preloading images', err));
  }, []);

  useEffect(() => {
    if (!isHoveringMap && inView) {
      intervalRef.current = setInterval(() => {
        const availableIndices = items.reduce((acc, _, index) => (!shownTooltips.includes(index) ? [...acc, index] : acc), []);

        if (availableIndices.length > 0) {
          const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
          setOpenStates((prevStates) => prevStates.map((_, i) => i === randomIndex));
          setShownTooltips((prev) => [...prev, randomIndex]);
        }
      }, 3000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [items.length, shownTooltips, isHoveringMap, inView]);

  const handleMouseEnter = useCallback(
    (index) => {
      if (!isMobile) {
        setOpenStates((prevStates) => prevStates.map((_, i) => i === index));
      }
    },
    [isMobile],
  );

  const handleMouseLeave = useCallback(() => {
    if (!isMobile) {
      setOpenStates((prevStates) => prevStates.map(() => false));
    }
  }, [isMobile]);

  const handleClick = useCallback(
    (index) => {
      if (isMobile) {
        setOpenStates((prevStates) => prevStates.map((state, i) => (i === index ? !state : false)));
      }
    },
    [isMobile],
  );

  const renderItem = useMemo(
    () => (item, idx) => (
      <div
        key={idx}
        className="group absolute"
        style={{
          right: `${item.right}%`,
          top: `${item.top}%`,
        }}>
        <Popover open={debouncedOpenStates[idx]} onOpenChange={() => {}}>
          <PopoverTrigger className="relative h-[22px] outline-none" onMouseEnter={() => handleMouseEnter(idx)} onMouseLeave={handleMouseLeave} onClick={() => handleClick(idx)}>
            {currentState !== 'churches' ? (
              <CircleFlag countryCode={item.city} width="22" className="z-10 h-[22px] rounded-full border-2 lg:pointer-events-none" />
            ) : (
              <img src="/churches.svg" className="h-[22px]" alt="Church" />
            )}
          </PopoverTrigger>
          <PopoverContent className="absolute !-left-6 !-top-10 pr-3" onMouseEnter={() => handleMouseEnter(idx)} onMouseLeave={handleMouseLeave}>
            <a href={`/countries/${item.slug}/`} className="flex items-center gap-2">
              {currentState !== 'churches' ? (
                <CircleFlag countryCode={item.city} className="z-10 rounded-full lg:pointer-events-none" width="36" />
              ) : (
                <img src="/churches-tooltip.svg" className="size-9" alt="Church tooltip" />
              )}
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-bold text-black">{item.name}</span>
              </div>
            </a>
          </PopoverContent>
        </Popover>
      </div>
    ),
    [currentState, debouncedOpenStates, handleMouseEnter, handleMouseLeave, handleClick],
  );

  if (!imagesLoaded) {
    return <div>Loading...</div>; // или любой другой индикатор загрузки
  }

  return (
    <div ref={intersectionRef} onMouseEnter={() => setIsHoveringMap(true)} onMouseLeave={() => setIsHoveringMap(false)}>
      {items.map(renderItem)}
    </div>
  );
};

export default MapTooltips;
