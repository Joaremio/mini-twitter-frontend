"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth-store";
import { CreatePostForm } from "@/components/CreatePostForm";
import { usePosts } from "@/hooks/use-posts";
import { PostCard } from "@/components/PostCard";
import { LogOut, Search } from "lucide-react";
import { useInView } from "react-intersection-observer";

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
      <header className="w-full flex justify-between p-4 px-12 bg-gray-100 border-b border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.05)] sticky top-0 z-10 items-center gap-8">
        <h1 className="text-xl font-semibold text-twitter shrink-0">
          Mini Twitter
        </h1>

        <div className="flex-1 max-w-xl relative group  ml-4">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-twitter transition-colors"
            size={18}
          />
          <input
            type="text"
            placeholder="Buscar por post..."
            className="w-full p-2  text-md pl-10 border border-gray-200 rounded-lg bg-white focus:bg-white focus:ring-2 focus:ring-twitter focus:border-transparent outline-none text-black transition-all"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-4 shrink-0">
          {user ? (
            <>
              <span className="font-medium text-gray-700 hidden lg:inline">
                Olá, {user.name}
              </span>
              <button
                onClick={() => {
                  if (confirm("Deseja sair?")) logout();
                }}
                className="flex items-center gap-2 text-sm font-semibold text-red-500 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors"
              >
                <LogOut size={18} />
                <span className="hidden sm:inline">Sair</span>
              </button>
            </>
          ) : (
            <a
              href="/login"
              className="bg-twitter text-white px-6 py-2 rounded-full font-bold hover:bg-twitter-hover transition-colors"
            >
              Entrar
            </a>
          )}
        </div>
      </header>

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
