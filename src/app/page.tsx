"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth-store";
import { CreatePostForm } from "@/components/CreatePostForm";
import { usePosts } from "@/hooks/use-posts";
import { PostCard } from "@/components/PostCard";
import { LogOut, Search } from "lucide-react";
import { useInView } from "react-intersection-observer";
import { Header } from "@/components/Header";

export default function TimelinePage() {
  const { ref, inView } = useInView();
  const [search, setSearch] = useState("");
  const { user } = useAuthStore();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    usePosts(search);

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const allPosts = data?.pages.flatMap((page) => page.posts || []) || [];

  return (
    <div
      className="min-h-screen transition-colors duration-300"
      style={{ backgroundColor: "var(--background)" }}
    >
      <Header onSearch={setSearch} />

      <main className="max-w-2xl mx-auto p-4">
        {user && <CreatePostForm />}

        <div className="space-y-6">
          {isLoading && (
            <p className="text-center text-gray-500 animate-pulse mt-10">
              Buscando tweets...
            </p>
          )}

          {allPosts.map((post: any) => (
            <PostCard key={post.id} post={post} />
          ))}

          {!isLoading && allPosts.length === 0 && (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">
                Nenhum tweet encontrado para "{search}"
              </p>
            </div>
          )}
        </div>

        <div ref={ref} className="h-40 flex items-center justify-center mt-4">
          {isFetchingNextPage && (
            <div className="flex flex-col items-center gap-2">
              <div className="w-6 h-6 border-2 border-twitter border-t-transparent rounded-full animate-spin" />
              <p className="text-twitter font-medium text-sm dark:text-white">
                Carregando mais tweets...
              </p>
            </div>
          )}
        </div>
      </main>
      <footer className="text-left p-4 flex flex-1 bg-card">
        <h1 className="text-xl ml-8 font-bold text-twitter shrink-0 dark:text-white">
          Mini Twitter
        </h1>
      </footer>
    </div>
  );
}
