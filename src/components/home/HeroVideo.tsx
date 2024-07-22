import { useState, useRef } from 'react';
import ReactPlayer from 'react-player/lazy';
import { Button } from '../ui/button';
import { MoveRight } from 'lucide-react'
const Video = () => {
  const [playing, setPlaying] = useState(false);
  const playerRef = useRef(null);

  const handlePlay = () => {
    setPlaying(true);
  };
  const handleVideoEnded = () => {
    setPlaying(false);
  };
  return (
    <div>
       <div className='flex items-center gap-4'>
          <Button variant="default" onClick={handlePlay}>  Watch now </Button>
          <Button variant="outline" link="#eastern" className="!px-5"> Learn More <MoveRight size={21} /> </Button>
        </div>
        {playing && (
          <div className="absolute left-0 top-0 size-full">
            <ReactPlayer ref={playerRef} controls={true} onEnded={handleVideoEnded} url="https://www.youtube.com/watch?v=UWf1T6quGoI" width="100%" height="100%" playing={true} />
          </div>
        )}
    </div>
 
  );
};

export default Video;
