import { useState, useEffect } from 'react';
import { CircleFlag } from 'react-circle-flags';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

const MapTooltips = ({ items, isActive }) => {
  const [openPopover, setOpenPopover] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

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
      setOpenPopover(null);
      return;
    }

    const bgIndex = items.findIndex((item) => item.city === 'hu');
    setOpenPopover(bgIndex !== -1 ? bgIndex : 0);

    const interval = setInterval(() => {
      const newIndex = Math.floor(Math.random() * items.length);
      setOpenPopover(newIndex);
    }, 2000);

    return () => clearInterval(interval);
  }, [isActive]);

  const handleInteraction = (index) => {
    if (isMobile) {
      setOpenPopover(openPopover === index ? null : index);
    } else {
      setOpenPopover(index);
    }
  };

  if (!isActive) return null;

  return (
    <div>
      {items.map((item, idx) => (
        <div key={idx} className="group absolute" style={{ right: `${item.right}%`, top: `${item.top}%` }}>
          <Popover open={openPopover === idx}>
            <PopoverTrigger className="relative h-[22px] outline-none" onClick={() => handleInteraction(idx)} onMouseEnter={() => !isMobile && handleInteraction(idx)}>
              <CircleFlag countryCode={item.city} className="z-10 size-6 rounded-full border-2" />
            </PopoverTrigger>
            <PopoverContent className="absolute !-left-6 !-top-10 pr-3" onMouseLeave={() => !isMobile && setOpenPopover(null)}>
              <a href={`/countries/${item.slug}/`} className="flex items-center gap-2">
                <CircleFlag countryCode={item.city} className="z-10 rounded-full lg:pointer-events-none" width="36" />
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
