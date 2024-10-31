import { useState } from 'react';
import { Button } from './ui/button';
import { Icon } from '@iconify/react';

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [player, setPlayer] = useState<any>(null);

  // YouTube Video ID ที่ต้องการเล่น
  const videoId = 'YOUR_YOUTUBE_VIDEO_ID';

  const opts = {
    height: '0',
    width: '0',
    playerVars: {
      autoplay: 0,
    },
  };

  const onReady = (event: any) => {
    setPlayer(event.target);
  };

  const togglePlay = () => {
    if (isPlaying) {
      player?.pauseVideo();
    } else {
      player?.playVideo();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div>
      <YouTube
        videoId={videoId}
        opts={opts}
        onReady={onReady}
        className="hidden" // ซ่อน YouTube player
      />
      <Button
        onClick={togglePlay}
        className="flex items-center gap-2 border border-solid border-gray-300 bg-transparent hover:bg-gray-100"
      >
        <Icon 
          icon={isPlaying ? "mdi:volume-off" : "mdi:volume-high"} 
          className="text-slate-600"
        />
      </Button>
    </div>
  );
}