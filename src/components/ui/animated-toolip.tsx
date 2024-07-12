import React, { useState, useEffect } from 'react';
import { motion, useTransform, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { CircleFlag } from 'react-circle-flags';

export const AnimatedTooltip = ({
  items,
  showClutches,
  randomIndex,
  setIsHovered,
  handleMouseLeave,
}: {
  items: {
    name: string;
    countCity: number;
    city: string;
    top: number;
    right: number;
  }[];
  showClutches: boolean;
  randomIndex: number | null;
  setIsHovered: (isHovered: boolean) => void;
  handleMouseLeave: () => void;
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const springConfig = { stiffness: 100, damping: 10 };
  const x = useMotionValue(0);
  const rotate = useSpring(useTransform(x, [-100, 100], [-45, 45]), springConfig);
  const translateX = useSpring(useTransform(x, [-100, 100], [-50, 50]), springConfig);

  const handleMouseMove = (event: any) => {
    const halfWidth = event.target.offsetWidth / 2;
    x.set(event.nativeEvent.offsetX - halfWidth);
  };

  const handleMouseEnter = (idx: number) => {
    setHoveredIndex(idx);
    setIsHovered(true);
  };

  const handleMouseLeaveInternal = () => {
    setHoveredIndex(null);
    handleMouseLeave();
  };

  const handleClick = (idx: number) => {
    if (hoveredIndex === idx) {
      setHoveredIndex(null);
      setIsHovered(false);
    } else {
      setHoveredIndex(idx);
      setIsHovered(true);
    }
  };

  useEffect(() => {
    if (hoveredIndex !== null) {
      const timeout = setTimeout(() => {
        setHoveredIndex(null);
      }, 3000);

      return () => clearTimeout(timeout);
    }
  }, [hoveredIndex]);

  return (
    <>
      {items.map((item, idx) => (
        <div
          className="group absolute"
          style={{ right: `${item.right}%`, top: `${item.top}%` }}
          key={idx}
          onMouseEnter={() => handleMouseEnter(idx)}
          onMouseLeave={handleMouseLeaveInternal}
          onClick={() => handleClick(idx)}>
          <AnimatePresence mode="popLayout">
            {(hoveredIndex === idx || (randomIndex === idx && hoveredIndex === null)) && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.6 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: {
                    type: 'spring',
                    stiffness: 260,
                    damping: 20,
                  },
                }}
                exit={{ opacity: 0, y: 20, scale: 0.6 }}
                style={{
                  translateX: translateX,
                  rotate: rotate,
                  whiteSpace: 'nowrap',
                }}
                className="absolute -left-1/2 -top-1/2  z-50 flex w-[190px] gap-3 rounded-full bg-white p-1.5 shadow-xl">
                {showClutches ? (
                  <>
                    <div className="grid size-9 place-items-center rounded-full bg-[#F2F2F2]">
                      <img src="/churches.svg" className="size-6" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-bold text-black">{item.name}</span>
                      <span className="text-[12px] leading-none">{item.countCity} churches</span>
                    </div>
                  </>
                ) : (
                  <>
                    <CircleFlag countryCode={item.city} className="size-9 lg:pointer-events-none" width="36" />
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs font-bold text-black">{item.name}</span>
                      <span className="text-[12px] leading-none">{item.countCity} cities</span>
                    </div>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
          {showClutches ? (
            <div className="z-10 grid size-[22px] place-items-center rounded-full border-2 border-white bg-[#F2F2F2]" onMouseMove={handleMouseMove}>
              <img src="/churches.svg" className="size-3" />
            </div>
          ) : (
            <CircleFlag countryCode={item.city} width="22" className="z-10 h-[22px] rounded-full border-2 lg:pointer-events-none" onMouseMove={handleMouseMove} />
          )}
        </div>
      ))}
    </>
  );
};
