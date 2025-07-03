"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { getBettingProviders } from "@/lib/betting-service";
import type { BettingProvider } from "@/types";
import { Star } from "lucide-react";
import { Footer } from "@/components/footer";

const StarRating = ({ rating }: { rating: number | null }) => {
  if (rating === null || rating === 0) {
    return <span className="text-muted-foreground text-sm">لا يوجد تقييم</span>;
  }
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;

  return (
    <div className="flex justify-center items-center">
      {[...Array(5)].map((_, i) => {
        const key = `star-${i}`;
        if (i < fullStars) {
          return <Star key={key} className="h-5 w-5 text-amber-400 fill-amber-400" />;
        }
        if (i === fullStars && halfStar) {
          return (
             <div key={key} className="relative">
               <Star className="h-5 w-5 text-muted-foreground/30" />
               <Star className="h-5 w-5 text-amber-400 fill-amber-400 absolute top-0 left-0" style={{ clipPath: 'polygon(0 0, 50% 0, 50% 100%, 0 100%)' }} />
             </div>
          );
        }
        return <Star key={key} className="h-5 w-5 text-muted-foreground/30" />;
      })}
    </div>
  );
};

export default function BettingPage() {
    const [providers, setProviders] = useState<BettingProvider[]>([]);

    useEffect(() => {
        setProviders(getBettingProviders());
    }, []);

    const sortedProviders = [...providers].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-8">
        <div className="text-right mb-8">
            <h1 className="text-3xl font-bold">أفضل مواقع المراهنات الرياضية</h1>
            <p className="text-muted-foreground mt-2 max-w-2xl ml-auto">
                لقد قمنا بتجميع ومراجعة أفضل مواقع المراهنات الرياضية لمساعدتك في العثور على المكان المثالي لك. تصفح قائمتنا أدناه.
            </p>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-2 sm:gap-3">
            {sortedProviders.map((provider) => (
                <Card key={provider.id} className="flex flex-col hover:shadow-primary/10 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                    <CardHeader className="items-center text-center p-2 bg-card">
                        <div className="relative h-14 w-full">
                            <Image
                                src={provider.logoUrl}
                                alt={`${provider.name} logo`}
                                fill
                                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 15vw"
                                className="object-contain"
                                data-ai-hint={`${provider.name.toLowerCase()} logo`}
                            />
                        </div>
                        <CardTitle className="text-sm pt-1">{provider.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow flex flex-col items-center justify-center p-2">
                        <StarRating rating={provider.rating} />
                    </CardContent>
                    <CardFooter className="p-1 bg-muted/50">
                        <Button asChild size="sm" className="w-full text-xs h-8">
                            <a href={provider.reviewUrl} target="_blank" rel="noopener noreferrer">
                                زيارة الموقع
                            </a>
                        </Button>
                    </CardFooter>
                </Card>
            ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
