import { useState, useEffect, useRef } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

const MapTooltips = ({ items }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 1024);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const randomTooltipInterval = setInterval(() => {
      if (!isHovered) {
        const randomIndex = Math.floor(Math.random() * items.length);
        setActiveIndex(randomIndex);
      }
    }, 2000);

    return () => clearInterval(randomTooltipInterval);
  }, [isHovered, items.length]);

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setIsHovered(false);
      timeoutRef.current = null;
    }, 1000);
  };

  const handleInteraction = (index) => {
    if (isMobile) {
      setActiveIndex(activeIndex === index ? null : index);
    } else {
      setActiveIndex(index);
    }
  };

  return (
    <div>
      {items.map((item, idx) => (
        <div key={idx} className="group absolute" style={{ right: `${item.right}%`, top: `${item.top}%` }}>
          <Popover open={activeIndex === idx}>
            <PopoverTrigger
              className="relative h-[22px] outline-none"
              onClick={() => handleInteraction(idx)}
              onMouseEnter={() => {
                if (timeoutRef.current) {
                  clearTimeout(timeoutRef.current);
                }
                setIsHovered(true);
                setActiveIndex(idx);
              }}
              onMouseLeave={handleMouseLeave}>
              <img
                src={`https://hatscripts.github.io/circle-flags/flags/${item.city}.svg`}
                className={`z-10 size-6 rounded-full border-2 transition-transform ${activeIndex === idx ? 'scale-110' : ''}`}
                width="24"
              />
            </PopoverTrigger>
            <PopoverContent className="absolute !-left-5 !-top-10" onMouseLeave={handleMouseLeave}>
              <a href={`/countries/${item.slug}/`} className="flex items-center gap-2">
                <img src={`https://hatscripts.github.io/circle-flags/flags/${item.city}.svg`} className="z-10 rounded-full lg:pointer-events-none" width="30" />
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs font-bold text-black">{item.name}</span>
                </div>
              </a>
            </PopoverContent>
          </Popover>
        </div>
      ))}
    </div>
  );
};

export default MapTooltips;
