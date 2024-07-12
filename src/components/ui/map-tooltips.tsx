import { useState, useEffect, useRef } from 'react';
import { useDebounce } from '@uidotdev/usehooks';
import { CircleFlag } from 'react-circle-flags';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useInView } from 'react-intersection-observer';

const MapTooltips = ({ items, currentState }) => {
  const [openStates, setOpenStates] = useState(Array(items.length).fill(false));
  const [shownTooltips, setShownTooltips] = useState([]);
  const [isHoveringMap, setIsHoveringMap] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const debouncedOpenStates = useDebounce(openStates, 200);
  const intervalRef = useRef(null);

  const { ref: intersectionRef, inView } = useInView({
    triggerOnce: false,
    threshold: 0.5,
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (!isHoveringMap && inView) {
      intervalRef.current = setInterval(() => {
        const availableIndices = items.map((_, index) => index).filter((index) => !shownTooltips.includes(index));

        if (availableIndices.length > 0) {
          const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
          setOpenStates((prevStates) => prevStates.map((state, i) => (i === randomIndex ? true : false)));
          setShownTooltips((prevShownTooltips) => [...prevShownTooltips, randomIndex]);
        }
      }, 3000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => {
      clearInterval(intervalRef.current);
    };
  }, [items.length, shownTooltips, isHoveringMap, inView]);

  const handleMouseEnter = (index) => {
    if (!isMobile) {
      setOpenStates((prevStates) => prevStates.map((state, i) => (i === index ? true : false)));
    }
  };
  
  const handleMouseLeave = (index) => {
    if (!isMobile) {
      setOpenStates((prevStates) => prevStates.map((state, i) => false));
    }
  };
  
  const handleClick = (index) => {
    if (isMobile) {
      setOpenStates((prevStates) => prevStates.map((state, i) => (i === index ? !state : false)));
    }
  };

  const handleMapMouseEnter = () => {
    setIsHoveringMap(true);
  };

  const handleMapMouseLeave = () => {
    setIsHoveringMap(false);
  };

  return (
    <div ref={intersectionRef} onMouseEnter={handleMapMouseEnter} onMouseLeave={handleMapMouseLeave}>
      {items.map((item, idx) => (
        <div
          key={idx}
          className="group absolute"
          style={{
            right: `${item.right}%`,
            top: `${item.top}%`,
          }}>
          {currentState !== 'churches' ? (
            <Popover open={debouncedOpenStates[idx]} onOpenChange={() => {}}>
              <PopoverTrigger className="relative h-[22px] outline-none" onMouseEnter={() => handleMouseEnter(idx)} onMouseLeave={() => handleMouseLeave(idx)} onClick={() => handleClick(idx)}>
                <CircleFlag countryCode={item.city} width="22" className="z-10 h-[22px] rounded-full border-2 lg:pointer-events-none" />
              </PopoverTrigger>
              <PopoverContent className="absolute !-left-6 !-top-10" onMouseEnter={() => handleMouseEnter(idx)} onMouseLeave={() => handleMouseLeave(idx)}>
                <CircleFlag countryCode={item.city} className="z-10 rounded-full lg:pointer-events-none" width="36" />
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs font-bold text-black">{item.name}</span>
                  <span className="text-[12px] leading-none">{item.countCity} cities</span>
                </div>
              </PopoverContent>
            </Popover>
          ) : (
            <Popover open={debouncedOpenStates[idx]} onOpenChange={() => {}}>
              <PopoverTrigger className="relative h-[22px] outline-none" onMouseEnter={() => handleMouseEnter(idx)} onMouseLeave={() => handleMouseLeave(idx)} onClick={() => handleClick(idx)}>
                <img src="/churches.svg" className="h-[22px]" />
              </PopoverTrigger>
              <PopoverContent className="absolute !-left-6 !-top-10" onMouseEnter={() => handleMouseEnter(idx)} onMouseLeave={() => handleMouseLeave(idx)}>
                <img src="/churches-tooltip.svg" className="size-9" />
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs font-bold text-black">{item.name}</span>
                  <span className="text-[12px] leading-none">{item.countCity} churches</span>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      ))}
    </div>
  );
};

export default MapTooltips;
