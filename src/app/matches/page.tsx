"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Match } from "@/types";
import { getMatches } from "@/ai/flows/get-matches-flow";
import { Badge } from "@/components/ui/badge";

const LeagueGroupSkeleton = () => (
    <Card className="overflow-hidden">
        <CardHeader className="p-3 bg-muted/50 border-b">
            <Skeleton className="h-6 w-1/3 rounded-md" />
        </CardHeader>
        <CardContent className="p-0">
            <div className="divide-y divide-border">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center justify-between px-4 py-5">
                         <div className="flex-1 flex items-center gap-3 justify-end">
                            <Skeleton className="h-6 w-28 rounded-md" />
                            <Skeleton className="h-8 w-8 rounded-full" />
                        </div>
                        <div className="text-center px-2 sm:px-4 w-32 md:w-40">
                            <Skeleton className="h-7 w-14 mb-2 mx-auto rounded-md" />
                            <Skeleton className="h-5 w-16 mx-auto rounded-md" />
                             <div className="mt-2 flex justify-center gap-1">
                                <Skeleton className="h-4 w-20 rounded-md" />
                            </div>
                        </div>
                         <div className="flex-1 flex items-center gap-3 justify-start">
                            <Skeleton className="h-8 w-8 rounded-full" />
                            <Skeleton className="h-6 w-28 rounded-md" />
                        </div>
                    </div>
                ))}
            </div>
        </CardContent>
    </Card>
);

export default function MatchesPage() {
  const [groupedMatches, setGroupedMatches] = useState<Record<string, Match[]>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadMatches() {
      setIsLoading(true);
      try {
        const data = await getMatches();
        
        const groupByLeague = (matchesToGroup: Match[]): Record<string, Match[]> => {
            return matchesToGroup.reduce((acc, match) => {
                const league = match.league || 'متفرقات';
                if (!acc[league]) {
                    acc[league] = [];
                }
                acc[league].push(match);
                return acc;
            }, {} as Record<string, Match[]>);
        };

        setGroupedMatches(groupByLeague(data.matches));

      } catch (error) {
        console.error("Failed to fetch matches:", error);
        setGroupedMatches({});
      } finally {
        setIsLoading(false);
      }
    }
    loadMatches();
  }, []);
  
  const getStatusBadgeVariant = (status: string) => {
    const lowerStatus = status.toLowerCase();
    if (lowerStatus.includes('live') || lowerStatus === 'ht') return 'destructive';
    if (lowerStatus.includes('finished')) return 'secondary';
    return 'outline';
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-8">
        <h1 className="text-3xl font-bold mb-8 text-right">جدول المباريات والنتائج</h1>
        
        <div className="space-y-6">
            {isLoading ? (
                [...Array(3)].map((_, i) => <LeagueGroupSkeleton key={i} />)
            ) : Object.keys(groupedMatches).length > 0 ? (
                Object.entries(groupedMatches).map(([league, leagueMatches]) => (
                    <Card key={league} className="overflow-hidden">
                        <CardHeader className="p-3 bg-muted/50 border-b">
                            <CardTitle className="text-base font-semibold">{league}</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="divide-y divide-border">
                                {leagueMatches.map((match, index) => (
                                    <div key={index} className="flex items-center justify-between px-4 py-5 hover:bg-muted/50 transition-colors">
                                        {/* Team 1 - Right side in RTL */}
                                        <div className="flex-1 flex items-center gap-3 justify-end min-w-0">
                                            <span className="font-semibold text-right truncate">{match.team1}</span>
                                            <Image src={match.team1Logo} alt={match.team1} width={32} height={32} className="object-contain shrink-0" data-ai-hint={`${match.team1.toLowerCase()} logo`} />
                                        </div>

                                        {/* Center Score & Status */}
                                        <div className="text-center px-2 sm:px-4 w-32 md:w-40 shrink-0">
                                            <div className="font-bold text-xl sm:text-2xl whitespace-nowrap">{match.score}</div>
                                            <Badge variant={getStatusBadgeVariant(match.status)} className="mt-1 text-xs px-1.5 py-0.5 h-auto leading-tight">
                                                {match.status}
                                            </Badge>
                                            {match.broadcastingChannels && match.broadcastingChannels.length > 0 && (
                                                <div className="mt-2 flex flex-wrap justify-center gap-1">
                                                    {match.broadcastingChannels.map((channel, i) => (
                                                        <Badge key={i} variant="secondary" className="font-normal text-[10px] py-0.5 px-1.5 h-auto">
                                                            {channel}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        {/* Team 2 - Left side in RTL */}
                                        <div className="flex-1 flex items-center gap-3 justify-start min-w-0">
                                            <Image src={match.team2Logo} alt={match.team2} width={32} height={32} className="object-contain shrink-0" data-ai-hint={`${match.team2.toLowerCase()} logo`} />
                                            <span className="font-semibold text-left truncate">{match.team2}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                ))
            ) : (
                <Card>
                    <CardContent className="p-8 text-center h-40 flex items-center justify-center">
                        <p className="text-muted-foreground">لم يتم العثور على مباريات اليوم.</p>
                    </CardContent>
                </Card>
            )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
