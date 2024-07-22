import { useState, useEffect, useRef } from 'react';
import { CircleFlag } from 'react-circle-flags';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

const MapTooltips = ({ items, currentState, isActive }) => {
  const [openPopover, setOpenPopover] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [userInteracting, setUserInteracting] = useState(false);
  const timeoutRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 1024);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!isActive) {
      clearInterval(intervalRef.current);
      setOpenPopover(null);
      return;
    }

    const openNewPopover = () => {
      if (!userInteracting && items.length > 0) {
        let newIndex;
        do {
          newIndex = Math.floor(Math.random() * items.length);
        } while (newIndex === openPopover && items.length > 1);
        setOpenPopover(newIndex);
      }
    };

    intervalRef.current = setInterval(openNewPopover, 3000);

    return () => clearInterval(intervalRef.current);
  }, [items, openPopover, userInteracting, isActive]);

  const handleMouseEnter = (index) => {
    if (!isMobile && isActive) {
      clearTimeout(timeoutRef.current);
      setOpenPopover(index);
      setUserInteracting(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile && isActive) {
      timeoutRef.current = setTimeout(() => {
        setOpenPopover(null);
        setUserInteracting(false);
      }, 300);
    }
  };

  const handleClick = (index) => {
    if (isMobile && isActive) {
      setOpenPopover(openPopover === index ? null : index);
      setUserInteracting(openPopover !== index);
    }
  };

  if (!isActive) return null;

  return (
    <div>
      {items.map((item, idx) => (
        <div key={idx} className="group absolute" style={{ right: `${item.right}%`, top: `${item.top}%` }}>
          <Popover open={openPopover === idx}>
            <PopoverTrigger className="relative h-[22px] outline-none" onClick={() => handleClick(idx)} onMouseEnter={() => handleMouseEnter(idx)} onMouseLeave={handleMouseLeave}>
              {currentState !== 'churches' ? <CircleFlag countryCode={item.city} className="z-10 size-6 rounded-full border-2" /> : <img src="/churches.svg" className="size-6" alt="Church" />}
            </PopoverTrigger>
            <PopoverContent className="absolute !-left-6 !-top-10 pr-3" onMouseEnter={() => handleMouseEnter(idx)} onMouseLeave={handleMouseLeave}>
              <a href={`/countries/${item.slug}/`} className="flex items-center gap-2">
                {currentState !== 'churches' ? (
                  <CircleFlag countryCode={item.city} className="z-10 rounded-full lg:pointer-events-none" width="36" />
                ) : (
                  <img src="/churches-tooltip.svg" className="z-10 size-9" alt="Church" />
                )}
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
