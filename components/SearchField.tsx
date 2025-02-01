"use client";

import { SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Input } from "./ui/input";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "../hooks/useDebounce";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  PopoverAnchor,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "./ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type SearchResult = {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  profilePicture: string | null;
};

export default function SearchField() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("user");
  const debouncedQuery = useDebounce(query, 300);

  const { data: results = [] } = useQuery<SearchResult[]>({
    queryKey: ["search", debouncedQuery, filter],
    queryFn: async () => {
      if (!debouncedQuery) return [];
      const res = await fetch(
        `/api/search?q=${encodeURIComponent(debouncedQuery)}&filter=${filter}`
      );
      if (!res.ok) throw new Error("Search failed");
      return res.json();
    },
    enabled: debouncedQuery.length > 0,
  });

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const q = (form.q as HTMLInputElement).value.trim();
    if (!q) return;
    setOpen(false);
    router.push(`/search?q=${encodeURIComponent(q)}&filter=${filter}`);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div className="relative">
        <PopoverAnchor asChild>
          <form onSubmit={handleSubmit} method="GET" action="/search">
            <div className="relative">
              <Input
                name="q"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  if (!open) setOpen(true);
                }}
                onFocus={() => setOpen(true)}
                placeholder="Search"
                className="pe-10"
              />
              <SearchIcon className="absolute right-3 top-1/2 size-5 -translate-y-1/2 transform text-muted-foreground" />
            </div>
          </form>
        </PopoverAnchor>

        <PopoverContent 
          className="w-[var(--radix-popover-trigger-width)] p-2" 
          align="start"
          sideOffset={5}
        >
          <div className="space-y-4">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">Users</SelectItem>
              </SelectContent>
            </Select>

            <ScrollArea className="max-h-[300px] -mr-2 pr-2">
              <div className="space-y-2">
                {results.map((result) => (
                  <Button
                    key={result.id}
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => {
                      setOpen(false);
                      router.push(`/profile/${result.id}`);
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={result.profilePicture || undefined}
                          alt={`${result.firstName} ${result.lastName}`}
                        />
                        <AvatarFallback>
                          {result.firstName[0]}
                          {result.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col items-start">
                        <span className="text-sm font-medium">
                          {result.firstName} {result.lastName}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          @{result.username}
                        </span>
                      </div>
                    </div>
                  </Button>
                ))}
                {query && results.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-2">
                    No results found
                  </p>
                )}
              </div>
            </ScrollArea>
          </div>
        </PopoverContent>
      </div>
    </Popover>
  );
}

