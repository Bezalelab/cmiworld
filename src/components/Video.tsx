
import ReactPlayer from 'react-player/lazy'
import { ReactSVG } from 'react-svg';
const Video = ({url}) => {
  return (
    <>
      <div className="h-[190px] md:h-[412px] lg:h-[670px]">
        <ReactPlayer
          controls={true}
          url={url}
          width="100%"
          height="100%"
          playing
          playIcon={<ReactSVG src="/play-button.svg" />}
          light="https://www.cmiworld.org/wp-content/uploads/2023/10/YouTube-Thumbnail-October-2023.jpg"
        />
      </div>
      <p className="mt-4 text-center text-sm"> Click on the video for a two minute update from Budapest </p>
    </>
  );
};

export default Video;
