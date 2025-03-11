import React, { useEffect, useRef } from 'react';
import { useInterviewStore } from '../store/interviewStore';

export const VideoFeed: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const isRecording = useInterviewStore((state) => state.isRecording);
  const videoStream = useInterviewStore((state) => state.videoStream);

  useEffect(() => {
    if (videoRef.current && videoStream) {
      videoRef.current.srcObject = videoStream;
    }
  }, [videoStream]);

  return (
    <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-gradient-to-br from-blue-900 to-gray-900 shadow-2xl">
      {videoStream ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-white/70">
          Camera feed will appear here
        </div>
      )}
      {isRecording && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            <span className="text-white/90 text-sm">Recording</span>
          </div>
        </div>
      )}
    </div>
  );
};