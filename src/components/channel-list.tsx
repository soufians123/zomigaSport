"use client";

import Image from "next/image";
import type { Channel } from "@/types";
import { cn } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface ChannelListProps {
  channels: Channel[];
  selectedChannelId: number | null;
  onSelectChannel: (channel: Channel) => void;
}

export function ChannelList({ channels, selectedChannelId, onSelectChannel }: ChannelListProps) {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="font-headline text-primary">قائمة القنوات</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow p-0">
        <ScrollArea className="h-[500px] lg:h-[calc(100vh-16rem)]">
          <div className="space-y-2 p-2">
            {channels.map((channel) => (
              <button
                key={channel.id}
                onClick={() => onSelectChannel(channel)}
                className={cn(
                  "flex w-full items-center gap-4 rounded-lg border p-4 text-right transition-all hover:bg-secondary focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  selectedChannelId === channel.id ? "bg-secondary border-primary" : "bg-card border-transparent"
                )}
              >
                <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-md">
                   <Image
                      src={channel.thumbnailUrl}
                      alt={`Thumbnail for ${channel.name}`}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                </div>
                <div className="flex-grow">
                  <p className="font-semibold text-foreground">{channel.name}</p>
                  <p className="text-sm text-muted-foreground">{channel.time}</p>
                </div>
                <Badge variant={selectedChannelId === channel.id ? "default" : "secondary"}>
                  مباشر
                </Badge>
              </button>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
