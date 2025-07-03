"use client";

import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import type { Channel } from "@/types";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Settings, Tv } from "lucide-react";
import { cn } from "@/lib/utils";

interface VideoPlayerProps {
  channel: Channel | null;
}

type QualityLevel = Hls.Level & {
  originalIndex: number;
};

export function VideoPlayer({ channel }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  
  const [qualityLevels, setQualityLevels] = useState<QualityLevel[]>([]);
  const [currentQuality, setCurrentQuality] = useState<number>(-1);

  useEffect(() => {
    if (hlsRef.current) {
      hlsRef.current.destroy();
    }

    if (channel && videoRef.current) {
      const video = videoRef.current;
      const hls = new Hls();
      hlsRef.current = hls;

      hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
        const videoLevels: QualityLevel[] = data.levels
          .map((level, index) => ({ ...level, originalIndex: index }))
          .filter(level => level.height)
          .sort((a, b) => b.height - a.height);
        
        setQualityLevels(videoLevels);
        setCurrentQuality(hls.autoLevelEnabled ? -1 : hls.currentLevel);
        video.play().catch(() => {}); // Autoplay might be blocked, fail silently
      });

      hls.on(Hls.Events.LEVEL_SWITCHED, (event, data) => {
        setCurrentQuality(data.level);
      });

      hls.loadSource(channel.streamUrl);
      hls.attachMedia(video);

    } else if (videoRef.current && channel && videoRef.current.canPlayType("application/vnd.apple.mpegurl")) {
      videoRef.current.src = channel.streamUrl;
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [channel]);

  const handleQualityChange = (levelIndex: number) => {
    if (hlsRef.current) {
      hlsRef.current.currentLevel = levelIndex;
      setCurrentQuality(levelIndex);
    }
  };

  const hasQualityOptions = qualityLevels.length > 0;

  return (
    <div className="w-full" key={channel?.id ?? 'no-channel'}>
      <div className={cn(
        "w-full overflow-hidden shadow-lg bg-black aspect-video",
        hasQualityOptions ? "rounded-t-lg" : "rounded-lg"
      )}>
        {channel ? (
          <video
            ref={videoRef}
            className="w-full h-full"
            controls
            autoPlay
            muted
            playsInline
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-center text-muted-foreground p-8">
            <div>
              <Tv className="mx-auto h-16 w-16 mb-4" />
              <h3 className="font-headline text-xl font-semibold">
                حدد قناة لبدء المشاهدة
              </h3>
              <p>اختر قناة من القائمة لبدء البث المباشر.</p>
            </div>
          </div>
        )}
      </div>
      
      {channel && hasQualityOptions && (
        <div className="flex justify-end items-center p-2 bg-card rounded-b-lg border-x border-b border-border">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4 ml-2" />
                <span>الجودة</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-auto p-2 bg-background/80 border-border text-foreground backdrop-blur-md">
              <div className="flex flex-col gap-1">
                <Button
                  variant="ghost"
                  className={cn(
                    "justify-start px-2 py-1 h-auto text-sm hover:bg-secondary",
                    currentQuality === -1 && "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
                  )}
                  onClick={() => handleQualityChange(-1)}
                >
                  تلقائي
                </Button>
                {qualityLevels.map((level) => (
                  <Button
                    key={level.originalIndex}
                    variant="ghost"
                    className={cn(
                      "justify-start px-2 py-1 h-auto text-sm hover:bg-secondary",
                      currentQuality === level.originalIndex && "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
                    )}
                    onClick={() => handleQualityChange(level.originalIndex)}
                  >
                    {level.height}p
                  </Button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      )}
    </div>
  );
}
