"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

import { Header } from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";
import { getNews } from "@/lib/news-service";
import type { NewsArticle } from "@/types";
import { Footer } from "@/components/footer";

export default function NewsPage() {
  const [news, setNews] = useState<NewsArticle[]>([]);

  useEffect(() => {
    const sortedNews = getNews().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    setNews(sortedNews);
  }, []);

  const featuredArticle = news[0];
  const otherArticles = news.slice(1);

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-8">
        <h1 className="text-3xl font-bold mb-8 text-right">آخر الأخبار</h1>
        
        {featuredArticle && (
          <Card className="mb-12 overflow-hidden lg:grid lg:grid-cols-2 lg:gap-8 items-center border-border hover:border-primary/50 transition-all duration-300">
            <div className="relative aspect-video lg:aspect-auto lg:h-full">
              <Image
                src={featuredArticle.imageUrl}
                alt={featuredArticle.title}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                data-ai-hint="sports news featured"
              />
            </div>
            <div className="p-6 lg:p-10 flex flex-col justify-center">
              <CardTitle className="text-2xl lg:text-4xl mb-4">{featuredArticle.title}</CardTitle>
              <CardDescription className="mb-6 text-base text-muted-foreground line-clamp-4">
                {featuredArticle.content}
              </CardDescription>
              <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">
                  {format(new Date(featuredArticle.createdAt), "d MMMM yyyy", { locale: ar })}
                </p>
              </div>
            </div>
          </Card>
        )}

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {otherArticles.map((article) => (
            <Card key={article.id} className="flex flex-col overflow-hidden hover:shadow-primary/10 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 bg-card">
              <CardHeader className="p-0">
                 <div className="relative aspect-video">
                    <Image
                      src={article.imageUrl}
                      alt={article.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover"
                      data-ai-hint="sports news"
                    />
                 </div>
              </CardHeader>
              <CardContent className="flex-grow p-6">
                <CardTitle className="mb-2 text-xl">{article.title}</CardTitle>
                <p className="text-muted-foreground text-sm line-clamp-3">
                  {article.content}
                </p>
              </CardContent>
              <CardFooter className="p-6 pt-0 text-xs text-muted-foreground">
                <span>
                    {format(new Date(article.createdAt), "d MMMM yyyy", { locale: ar })}
                </span>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
