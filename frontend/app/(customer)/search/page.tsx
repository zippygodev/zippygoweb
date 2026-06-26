"use client";

import * as React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Search, Sparkles, Mic, TrendingUp, X } from "lucide-react";

const trending = ["Pizza", "Burgers", "Sushi", "Pasta", "Salad", "Coffee", "Desserts", "BBQ"];

const recentSearches = ["Margherita Pizza", "Italian restaurants", "Healthy options under ₹300"];

export default function SearchPage() {
  const [query, setQuery] = React.useState("");
  const [isAISearch, setIsAISearch] = React.useState(false);

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold tracking-tight">Search</h1>

      <div className="relative mb-8">
        <div className="relative">
          {isAISearch ? (
            <Sparkles className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-primary" />
          ) : (
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          )}
          <Input
            placeholder={
              isAISearch
                ? "Describe what you're craving..."
                : "Search restaurants or dishes..."
            }
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-14 pl-12 pr-24 text-base"
          />
          <div className="absolute right-2 top-1/2 flex -translate-y-1/2 gap-1">
            <button
              onClick={() => setIsAISearch(!isAISearch)}
              className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                isAISearch
                  ? "bg-primary/20 text-foreground dark:bg-primary/10"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              <Sparkles className="h-3.5 w-3.5" />
              AI
            </button>
            <button className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted">
              <Mic className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <div className="mb-3 flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-medium">Trending Searches</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {trending.map((term) => (
            <button
              key={term}
              onClick={() => setQuery(term)}
              className="rounded-full border px-4 py-1.5 text-sm transition-colors hover:bg-accent"
            >
              {term}
            </button>
          ))}
        </div>
      </div>

      {recentSearches.length > 0 && !query && (
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-medium">Recent Searches</h2>
            <button className="text-xs text-muted-foreground hover:text-foreground">Clear all</button>
          </div>
          <div className="space-y-2">
            {recentSearches.map((s) => (
              <button
                key={s}
                onClick={() => setQuery(s)}
                className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm transition-colors hover:bg-accent"
              >
                <span>{s}</span>
                <X className="h-3.5 w-3.5 text-muted-foreground" />
              </button>
            ))}
          </div>
        </div>
      )}

      {query && (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {isAISearch ? "AI-powered results for:" : "Results for:"}{" "}
            <span className="font-medium text-foreground">{query}</span>
          </p>

          {isAISearch ? (
            <Card className="rounded-2xl border-primary/30 bg-primary/5 p-6 dark:border-primary/20 dark:bg-primary/5">
              <div className="mb-3 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <span className="font-semibold text-primary-dark dark:text-primary">AI Suggestion</span>
              </div>
              <p className="mb-4 text-sm text-muted-foreground">
                Based on your craving for &ldquo;{query}&rdquo;, we recommend trying Pizza Paradise&apos;s
                Margherita Pizza - it&apos;s our most popular item and perfectly matches your taste!
              </p>
              <div className="flex gap-2">
                <Link href="/restaurants/1">
                  <Button size="sm">View Restaurant</Button>
                </Link>
                <Button variant="outline" size="sm">Add to Cart</Button>
              </div>
            </Card>
          ) : null}

          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { name: "Margherita Pizza", restaurant: "Pizza Paradise", price: "₹349", image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=200" },
              { name: "Pepperoni Pizza", restaurant: "Pizza Paradise", price: "₹449", image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=200" },
            ].map((item) => (
              <Card key={item.name} className="flex items-center gap-3 p-3">
                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl">
                  <img src={item.image} alt="" className="h-full w-full object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium truncate">{item.name}</p>
                  <p className="text-xs text-muted-foreground">{item.restaurant}</p>
                  <p className="text-sm font-semibold text-amber-600 dark:text-primary">{item.price}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
