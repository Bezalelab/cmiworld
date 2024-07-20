import { useState, useEffect, useRef, useMemo } from 'react';
import { useDebounce } from '@uidotdev/usehooks';
import { CircleFlag } from 'react-circle-flags';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useInView } from 'react-intersection-observer';

const MapTooltips = ({ items, currentState }) => {
  const [openStates, setOpenStates] = useState(() => {
    const initialState = Array(items.length).fill(false);
    initialState[0] = true;
    return initialState;
  });
  const [shownTooltips, setShownTooltips] = useState([0]);
  const [isHoveringMap, setIsHoveringMap] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const debouncedOpenStates = useDebounce(openStates, 200);
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
    if (!isHoveringMap && inView) {
      intervalRef.current = setInterval(() => {
        const availableIndices = items.map((_, index) => index).filter((index) => !shownTooltips.includes(index));
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

  const handleMouseEnter = (index) => !isMobile && setOpenStates((prevStates) => prevStates.map((_, i) => i === index));
  const handleMouseLeave = () => !isMobile && setOpenStates((prevStates) => prevStates.map(() => false));
  const handleClick = (index) => isMobile && setOpenStates((prevStates) => prevStates.map((state, i) => (i === index ? !state : false)));

  const renderTooltip = useMemo(
    () => (item, idx) => {
      const isChurches = currentState === 'churches';
      const triggerContent = isChurches ? (
        <img src="/churches.svg" className="h-[22px]" alt="Church" />
      ) : (
        <CircleFlag countryCode={item.city} width="22" className="z-10 h-[22px] rounded-full border-2 lg:pointer-events-none" />
      );

      const popoverContent = (
        <a href={`/countries/${item.slug}/`} className="flex items-center gap-2">
          {isChurches ? (
            <img src="/churches-tooltip.svg" className="size-9" alt="Church tooltip" />
          ) : (
            <CircleFlag countryCode={item.city} className="z-10 rounded-full lg:pointer-events-none" width="36" />
          )}
          <div className="flex flex-col gap-0.5">
            <span className="text-xs font-bold text-black">{item.name}</span>
          </div>
        </a>
      );

      return (
        <div key={idx} className="group absolute" style={{ right: `${item.right}%`, top: `${item.top}%` }}>
          <Popover open={debouncedOpenStates[idx]} onOpenChange={() => {}}>
            <PopoverTrigger className="relative h-[22px] outline-none" onMouseEnter={() => handleMouseEnter(idx)} onMouseLeave={() => handleMouseLeave()} onClick={() => handleClick(idx)}>
              {triggerContent}
            </PopoverTrigger>
            <PopoverContent className="absolute !-left-6 !-top-10 pr-3" onMouseEnter={() => handleMouseEnter(idx)} onMouseLeave={() => handleMouseLeave()}>
              {popoverContent}
            </PopoverContent>
          </Popover>
        </div>
      );
    },
    [currentState, debouncedOpenStates, isMobile],
  );

  return (
    <div ref={intersectionRef} onMouseEnter={() => setIsHoveringMap(true)} onMouseLeave={() => setIsHoveringMap(false)}>
      {items.map(renderTooltip)}
    </div>
  );
};

export default MapTooltips;
