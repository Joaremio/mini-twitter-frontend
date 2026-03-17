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
  const { user, logout } = useAuthStore();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    usePosts(search);

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);
  const allPosts = data?.pages.flatMap((page) => page.posts || []) || [];

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header onSearch={setSearch} />

      <main className="max-w-2xl mx-auto p-4">
        {user && <CreatePostForm />}

        <div className="space-y-6">
          {isLoading && (
            <p className="text-center text-gray-500">Buscando tweets...</p>
          )}

          {allPosts.map((post: any) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>

        <div ref={ref} className="h-20 flex items-center justify-center mt-4">
          {isFetchingNextPage && (
            <p className="text-twitter font-medium animate-pulse">
              Carregando mais tweets...
            </p>
          )}
          {!hasNextPage && allPosts.length > 0 && (
            <p className="text-gray-400 text-sm">
              Você chegou ao fim da linha.
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
