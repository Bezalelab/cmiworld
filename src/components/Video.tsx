import ReactPlayer from 'react-player/lazy';
import { ReactSVG } from 'react-svg';
const Video = ({ url, placement }) => {
  return (
    <>
      <div className="h-[190px] md:h-[412px] lg:h-[670px]">
        <ReactPlayer controls={true} url={url} width="100%" height="100%"  playIcon={<ReactSVG src="/play-button.svg" />} />
      </div>
      <p className="mt-4 text-center text-sm"> Click on the video for a two minute update from {placement} </p>
    </>
  );
};

export default Video;
