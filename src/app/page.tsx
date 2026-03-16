"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth-store";
import { CreatePostForm } from "@/components/CreatePostForm";
import { usePosts } from "@/hooks/use-posts";
import { PostCard } from "@/components/PostCard";
import { LogOut } from "lucide-react";
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
    <main className="max-w-2xl mx-auto p-4 bg-gray-50 min-h-screen">
      <header className="flex justify-between items-center py-6">
        <h1 className="text-3xl font-extrabold text-blue-600">Mini Twitter</h1>

        {user ? (
          <div className="flex items-center gap-4">
            <span className="font-medium text-gray-700 hidden sm:inline">
              Olá, {user.name}
            </span>
            <button
              onClick={() => {
                if (confirm("Deseja sair?")) logout();
              }}
              className="flex items-center gap-2 text-sm font-semibold text-red-500 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors"
            >
              <LogOut size={18} />
              Sair
            </button>
          </div>
        ) : (
          <a
            href="/login"
            className="bg-blue-500 text-white px-4 py-2 rounded-full font-bold"
          >
            Entrar
          </a>
        )}
      </header>

      {user && <CreatePostForm />}

      <div className="relative mb-8">
        <input
          type="text"
          placeholder="Pesquisar no Mini Twitter..."
          className="w-full p-3 pl-10 border rounded-full bg-white shadow-sm focus:ring-2 focus:ring-blue-400 outline-none text-black"
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

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
          <p className="text-blue-500 font-medium animate-pulse">
            Carregando mais tweets...
          </p>
        )}
        {!hasNextPage && allPosts.length > 0 && (
          <p className="text-gray-400 text-sm">Você chegou ao fim da linha.</p>
        )}
      </div>
    </main>
  );
}
