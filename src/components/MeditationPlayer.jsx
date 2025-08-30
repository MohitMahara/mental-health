import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, SkipForward, SkipBack } from "lucide-react";
import { motion } from "framer-motion";

const meditationPlaylist = [
  {
    id: 1,
    title: "Morning Mindfulness",
    type: "audio",
    duration: "2:58",
    src: "https://res.cloudinary.com/diwodg2yv/video/upload/v1756541350/inhale-exhale-ambient-peaceful-meditation-365001_tawmlu.mp3",
  },
  {
    id: 2,
    title: "Deep Relaxation",
    type: "audio",
    duration: "5:47",
    src: "https://res.cloudinary.com/diwodg2yv/video/upload/v1756541386/meditation-music-368634_dcleuk.mp3",
  },
  {
    id: 3,
    title: "Anxiety Relief",
    type: "audio",
    duration: "2:58",
    src: "https://res.cloudinary.com/diwodg2yv/video/upload/v1756541350/inhale-exhale-ambient-peaceful-meditation-365001_tawmlu.mp3",
  },
  {
    id: 4,
    title: "Morning Yoga",
    type: "video",
    duration: "0:23",
    src: "https://res.cloudinary.com/diwodg2yv/video/upload/v1756541213/meditation3_t9huin.mp4",
  },
];

export const MeditationPlayer = () => {
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const videoRef = useRef(null);
  const [currentMedia, setCurrentMedia] = useState(meditationPlaylist[0]);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const newMedia = meditationPlaylist[currentTrack];
    setCurrentMedia(newMedia);
    setIsPlaying(false);

    const media =
      newMedia?.type === "audio" ? audioRef.current : videoRef.current;
    if (media) {
      media.currentTime = 0;
      media.pause();
    }
  }, [currentTrack]);

  useEffect(() => {
    const media =
      currentMedia.type === "audio" ? audioRef.current : videoRef.current;
    if (media) {
      if (isPlaying) {
        media.play();
      } else {
        media.pause();
      }
    }
  }, [isPlaying, currentTrack, currentMedia.type]);

  const togglePlay = () => {
    setIsPlaying((prev) => !prev);
  };

  const nextTrack = () => {
    setTime(0);
    setDuration(0);
    setCurrentTrack((prev) => (prev + 1) % meditationPlaylist.length);
  };

  const prevTrack = () => {
    setTime(0);
    setDuration(0);
    setCurrentTrack(
      (prev) =>
        (prev - 1 + meditationPlaylist.length) % meditationPlaylist.length
    );
  };

  const selectTrack = (index) => {
    setCurrentTrack(index);
  };

  const formatTime = (secs) => {
    if (!secs || isNaN(secs)) return "0:00";
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="bg-slate-800 p-6 rounded-2xl shadow-xl border border-gray-700">
      <div className="mb-6">
        <h2 className="text-2xl font-light text-white mb-2">
          Meditation Sessions
        </h2>
        <p className="text-slate-300 text-sm">
          Find your center with our curated meditation library
        </p>
      </div>

      <div className="mb-6">
        <div className="bg-slate-700/50 rounded-xl p-4 mb-6 border border-emerald-500/20 backdrop-blur-sm">
          <h3 className="text-lg font-semibold mb-2 text-white">
            {currentMedia.title}
          </h3>
          {currentMedia.type == "audio" && (
            <div className="text-sm mb-3 text-gray-300">
              🎵 {currentMedia.type} • {currentMedia.duration}
            </div>
          )}

          {currentMedia &&
            (currentMedia.type === "audio" ? (
              <audio
                key={currentMedia.id}
                ref={audioRef}
                src={currentMedia.src}
                onEnded={() => setIsPlaying(false)}
                onLoadedMetadata={(e) => setDuration(e.target.duration)}
                onTimeUpdate={(e) => setTime(e.target.currentTime)}
                className="w-full mb-3"
              />
            ) : (
              <video
                key={currentMedia.id}
                ref={videoRef}
                src={currentMedia.src}
                onEnded={() => setIsPlaying(false)}
                onLoadedMetadata={(e) => setDuration(e.target.duration)}
                onTimeUpdate={(e) => setTime(e.target.currentTime)}
                className="w-full rounded-lg mb-3"
                style={{ maxHeight: "100%" }}
              />
            ))}
        </div>

        <div className="flex items-center justify-center space-x-4 mb-6">
          <button
            className="p-3 rounded-full bg-slate-700 hover:bg-slate-600 border border-slate-600 hover:border-emerald-400 transition-all duration-200 group"
            onClick={prevTrack}
          >
            <SkipBack className="w-4 h-4 text-slate-300 group-hover:text-emerald-400" />
          </button>

          <button
            className="p-4 rounded-full bg-emerald-500 hover:bg-emerald-400 transition-all transform hover:scale-105 shadow-lg hover:shadow-emerald-500/30"
            onClick={togglePlay}
          >
            {isPlaying ? (
              <Pause className="w-6 h-6 text-white" />
            ) : (
              <Play className="w-6 h-6 text-white ml-1" />
            )}
          </button>

          <button
            className="p-3 rounded-full bg-slate-700 hover:bg-slate-600 border border-slate-600 hover:border-emerald-400 transition-all duration-200 group"
            onClick={nextTrack}
          >
            <SkipForward className="w-4 h-4 text-slate-300 group-hover:text-emerald-400" />
          </button>
        </div>

        <div className="mb-6">
          <div className="bg-slate-700 h-2 rounded-full">
            <div
              className="bg-emerald-400 h-full rounded-full transition-all duration-300 shadow-sm shadow-emerald-400/50"
              style={{ width: `${(time / duration) * 100}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-slate-400 mt-2">
            <span>{formatTime(time)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="font-semibold mb-1 text-white">Playlist</h4>
        <div className="h-[1px] bg-gray-500 mb-5"></div>
        <div className="flex flex-col gap-2 overflow-y-scroll scrollbar-hide max-h-48 md:max-h-64 mb-4">
          {meditationPlaylist.map((item, index) => (
            <motion.div
              key={item.id}
              onClick={() => selectTrack(index)}
              whileHover={{ scale: 1.02 }}
              className={`p-3 rounded-lg cursor-pointer transition-colors ${
                index === currentTrack
                  ? "bg-emerald-800 border border-emerald-600"
                  : "bg-gray-700 hover:bg-gray-600"
              }`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <div className={`font-semibold text-white`}>{item.title}</div>
                  <div className="text-sm text-gray-300">
                    {item.type === "audio" ? "🎵" : "🎥"} {item.duration}
                  </div>
                </div>
                {index === currentTrack && isPlaying && (
                  <div className="text-white">
                    <div className="w-4 h-4 rounded-full bg-emerald-500 animate-pulse"></div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
