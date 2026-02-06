import React, { useEffect, useRef, useState } from "react";
import { SongData } from "../context/Song";
import { GrChapterNext, GrChapterPrevious } from "react-icons/gr";
import { FaPause, FaPlay } from "react-icons/fa";

const Player = () => {
  const {
    song,
    fetchSingleSong,
    selectedSong,
    isPlaying,
    setIsPlaying,
    nextMusic,
    prevMusic,
  } = SongData();

  const audioRef = useRef(null);

  useEffect(() => {
    if (selectedSong?._id) {
      fetchSingleSong(selectedSong._id);
    }
  }, [selectedSong]);


  useEffect(() => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.play().catch(() => {});
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, song]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  
  const [volume, setVolume] = useState(1);

  const handleVolumeChange = (e) => {
    const newVolume = Number(e.target.value);
    setVolume(newVolume);

    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);


  useEffect(() => {
    setProgress(0);
  }, [song]);

  const handleProgressChange = (e) => {
    if (!duration) return;

    const percent = Number(e.target.value);
    const newTime = (percent / 100) * duration;

    audioRef.current.currentTime = newTime;
    setProgress(newTime);
  };

  return (
    <div>
      {song?.audio && (
        <div className="h-[10%] bg-black flex justify-between items-center text-white px-4">
          
         
          <div className="lg:flex items-center gap-4">
            <img
              src={song?.thumbnail?.url || "https://via.placeholder.com/50"}
              className="w-12"
              alt="thumbnail"
            />

            <div className="hidden md:block">
              <p>{song?.title}</p>
              <p>{song?.description?.slice(0, 30)}...</p>
            </div>
          </div>

          <div className="flex flex-col items-center gap-1 m-auto">
            
            <audio
              ref={audioRef}
              src={song.audio.url}
              onLoadedMetadata={() =>
                setDuration(audioRef.current?.duration || 0)
              }
              onTimeUpdate={() =>
                setProgress(audioRef.current?.currentTime || 0)
              }
            />

        
            <input
              type="range"
              min="0"
              max="100"
              className="progress-bar w-[120px] md:w-[300px]"
              value={duration ? (progress / duration) * 100 : 0}
              onChange={handleProgressChange}
            />

            <div className="flex justify-center items-center gap-4 cursor-pointer">
              <span className="cursor-pointer" onClick={prevMusic}>
                <GrChapterPrevious />
              </span>

              <button
                className="bg-white text-black rounded-full p-2 cursor-pointer"
                onClick={handlePlayPause}
              >
                {isPlaying ? <FaPause /> : <FaPlay />}
              </button>

              <span className="cursor-pointer" onClick={nextMusic}>
                <GrChapterNext />
              </span>
            </div>
          </div>

    
          <div className="flex items-center cursor-pointer">
            <input
              type="range"
              className="w-16 md:w-32 cursor-pointer"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Player;
