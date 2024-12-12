import React, { useState, useRef } from "react";
import { FaVolumeMute, FaVolumeUp } from "react-icons/fa";
import { FaArrowRotateLeft, FaPause, FaPlay } from "react-icons/fa6";
import ReactPlayer from "react-player";
import "./videoPlayerStyles.css";

export const VideoPlayer = () => {
  const [playing, setPlaying] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolume] = useState<number>(1.0);
  const [muted, setMuted] = useState<boolean>(false);
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  const rangeProgressRef = useRef<HTMLInputElement>(null);
  const rangeVolumeRef = useRef<HTMLInputElement>(null);

  let player: ReactPlayer | null = null;

  const handlePlayPause = () => {
    setPlaying(!playing);
  };

  const handleProgress = (state: { played: number }) => {
    setProgress(state.played * 100);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newProgress = parseFloat(e.target.value);
    setProgress(newProgress);

    const seekTo = (newProgress / 100) * duration;
    if (player) {
      player.seekTo(seekTo);
    }
  };

  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number(e.target.value) / 10;
    setVolume(newVolume);
  };

  const handleMute = () => setMuted(!muted);

  const handleResetVideo = () => {
    if (player) {
      player.seekTo(0);
      setProgress(0);
      setPlaying(false);
    }
  };

  const handleDuration = (duration: number) => {
    setDuration(duration);
  };

  const updateSliderBackground = () => {
    if (rangeProgressRef.current) {
      const value = Number(rangeProgressRef.current.value);
      const max = Number(rangeProgressRef.current.max);
      const progress = (value / max) * 100 + "%";
      rangeProgressRef.current.style.setProperty("--progress", progress);
    }

    if (rangeVolumeRef.current) {
      const value = Number(rangeVolumeRef.current.value);
      const max = Number(rangeVolumeRef.current.max);
      const progress = (value / max) * 100 + "%";
      rangeVolumeRef.current.style.setProperty("--progress", progress);
    }
  };

  React.useEffect(() => {
    const rangeProgress = rangeProgressRef.current;
    const rangeVolume = rangeVolumeRef.current;

    const handleProgressEvent = () => {
      if (rangeProgress) {
        rangeProgress.addEventListener("input", updateSliderBackground);
      }
      if (rangeVolume) {
        rangeVolume.addEventListener("input", updateSliderBackground);
      }
      updateSliderBackground();
    };

    handleProgressEvent();

    return () => {
      if (rangeProgress) {
        rangeProgress.removeEventListener("input", updateSliderBackground);
      }
      if (rangeVolume) {
        rangeVolume.removeEventListener("input", updateSliderBackground);
      }
    };
  }, [progress, duration]);

  return (
    <div className="w-9/12 h-auto flex flex-col border-r border-gray-300 overflow-y-auto font-secondary">
      <div className="relative w-full h-auto">
        <ReactPlayer
          ref={(playerRef) => (player = playerRef)}
          url="/videos/video.mp4"
          playing={playing}
          onProgress={handleProgress}
          onDuration={handleDuration}
          controls={false}
          height="auto"
          width="100%"
          onEnded={() => alert("O vídeo terminou")}
          volume={volume}
          muted={muted}
          playbackRate={playbackRate}
        />
        <input
          type="range"
          min={0}
          max={100}
          value={progress}
          onChange={handleSeek}
          className="w-full cursor-pointer absolute bottom-1"
          ref={rangeProgressRef}
          id="rangeProgress"
        />
      </div>
      <div className="flex w-full h-auto items-center justify-around bg-[#282828] py-3 text-white">
        <button onClick={handlePlayPause}>
          {!playing ? <FaPlay size={25} /> : <FaPause size={25} />}
        </button>
        <button onClick={handleResetVideo}>
          <FaArrowRotateLeft size={25} />
        </button>
        <div className="flex gap-1 items-center">
          <button onClick={handleMute}>
            {muted || volume === 0 ? (
              <FaVolumeMute size={30} />
            ) : (
              <FaVolumeUp size={30} />
            )}
          </button>
          <input
            type="range"
            min={0}
            max={10}
            value={volume * 10}
            onChange={handleVolume}
            ref={rangeVolumeRef}
            className="cursor-pointer"
          />
        </div>

        <select
          value={playbackRate}
          onChange={(e) => setPlaybackRate(Number(e.target.value))}
          className="bg-transparent cursor-pointer focus:text-black focus:outline-none"
        >
          <option value={0.5}>0.5x</option>
          <option value={0.75}>0.75x</option>
          <option value={1}>1x</option>
          <option value={2}>2x</option>
        </select>
        <p>Progresso do vídeo: {progress.toFixed(0)}%</p>
        <p>
          Duração do vídeo: {Math.floor(duration / 60)}:
          {String(Math.floor(duration % 60)).padStart(2, "0")}
        </p>
      </div>

      <div className="w-full h-auto flex flex-col">
        <nav className="w-full h-10 flex justify-around border-b-2 border-gray-300 text-xl">
          <button className="border-r-2 border-gray-300 w-full font-semibold">
            Visão Geral
          </button>
          <button className="w-full">Avaliações e Comentários</button>
        </nav>
        <div className="text-2xl mt-2 p-2">
          <h1 className="text-2xl">titulo do curso</h1>
          <h2 className="text-xl text-gray-600 cursor-pointer">quem fez</h2>
        </div>
        <div className="mt-4 p-2">
          <p className="text-xl uppercase">Sobre o curso</p>
          <p className="mt-1 w-10/12">
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Accusantium, voluptas! Dignissimos voluptates quas aperiam non unde
            soluta sit nisi a quia, dolorum rerum, quisquam nobis exercitationem
            laborum iure harum ratione?
          </p>
        </div>
      </div>
    </div>
  );
};
