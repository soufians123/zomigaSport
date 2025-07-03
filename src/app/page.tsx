"use client";

import { useState, useEffect } from "react";
import dynamic from 'next/dynamic';
import type { Channel, User } from "@/types";
import { getChannels } from "@/lib/channels-service";
import { Header } from "@/components/header";
import { ChannelList } from "@/components/channel-list";
import { SocialLinks } from "@/components/social-links";
import { Footer } from "@/components/footer";
import { isAuthenticated } from '@/lib/auth-service';
import { LoginPrompt } from '@/components/login-prompt';
import { Skeleton } from "@/components/ui/skeleton";

const VideoPlayer = dynamic(() => 
  import('@/components/video-player').then(mod => mod.VideoPlayer), 
  { 
    loading: () => <Skeleton className="aspect-video w-full rounded-lg" />,
    ssr: false 
  }
);

export default function Home() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [isClientAuthenticated, setIsClientAuthenticated] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const allChannels = getChannels();
    setChannels(allChannels);
    if (allChannels.length > 0) {
      setSelectedChannel(allChannels[0]);
    }
    
    const checkAuth = () => {
      setIsClientAuthenticated(isAuthenticated());
    };

    checkAuth();
    setIsMounted(true);

    window.addEventListener('auth-changed', checkAuth);

    return () => {
      window.removeEventListener('auth-changed', checkAuth);
    };
  }, []);


  const handleSelectChannel = (channel: Channel) => {
    setSelectedChannel(channel);
  };

  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-8">
      <div className="lg:col-span-2 mb-8 lg:mb-0">
        <Skeleton className="aspect-video w-full rounded-lg" />
         <div className="flex justify-center items-center gap-6 my-6">
            <Skeleton className="h-20 w-20 rounded-full" />
            <Skeleton className="h-20 w-20 rounded-full" />
            <Skeleton className="h-20 w-20 rounded-full" />
        </div>
      </div>
      <div className="lg:col-span-1">
        <Skeleton className="h-[500px] lg:h-[calc(100vh-16rem)] w-full rounded-lg" />
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-8">
        {!isMounted ? (
            <LoadingSkeleton />
        ) : isClientAuthenticated ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-8">
            <div className="lg:col-span-2 mb-8 lg:mb-0">
              <VideoPlayer channel={selectedChannel} />
              <SocialLinks />
            </div>
            <div className="lg:col-span-1">
              <ChannelList
                channels={channels}
                selectedChannelId={selectedChannel?.id ?? null}
                onSelectChannel={handleSelectChannel}
              />
            </div>
          </div>
        ) : (
          <LoginPrompt />
        )}
      </main>
      <Footer />
    </div>
  );
}
