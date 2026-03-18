"use client";

import { Heart, Trash2, Edit } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/services/api";
import { useAuthStore } from "@/store/auth-store";
import { useState } from "react";
import { toast } from "sonner";

interface PostProps {
  post: {
    id: string;
    title: string;
    content: string;
    image?: string;
    likesCount: number;
    authorId: number;
    authorName: string;
    createdAt: string;
  };
}

export function PostCard({ post }: PostProps) {
  const [userHasLiked, setUserHasLiked] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(post.title);
  const [editContent, setEditContent] = useState(post.content);
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  const likeMutation = useMutation({
    mutationFn: async () => {
      const response = await api.post(`/posts/${post.id}/like`);
      return response.data;
    },
    onSuccess: (data) => {
      setUserHasLiked(data.liked);
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: () => {
      toast.error("Erro ao curtir o post.");
    },
  });

  const updateMutation = useMutation({
    mutationFn: () =>
      api.put(`/posts/${post.id}`, {
        title: editTitle,
        content: editContent,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      setIsEditing(false);
      toast.success("Post atualizado!");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => api.delete(`/posts/${post.id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.info("Post removido!");
    },
  });

  const isAuthor = String(user?.id) === String(post.authorId);
  return (
    <article className="p-5 bg-card shadow-sm rounded-xl border border-border transition-all hover:shadow-md">
      {isEditing ? (
        <div className="space-y-3">
          <input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="w-full p-2 border border-border rounded-lg font-bold bg-background text-foreground outline-none focus:border-twitter"
          />
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="w-full p-2 border border-border rounded-lg h-24 bg-background text-foreground outline-none focus:border-twitter resize-none"
          />
          <div className="flex gap-2">
            <button
              onClick={() => updateMutation.mutate()}
              disabled={updateMutation.isPending}
              className="bg-twitter text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-twitter-hover disabled:opacity-50 transition-colors cursor-pointer"
            >
              {updateMutation.isPending ? "Salvando..." : "Salvar"}
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="bg-gray-100 dark:bg-white/10 px-4 py-2 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-white/20 text-foreground transition-colors cursor-pointer"
            >
              Cancelar
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-start">
            <div className="flex flex-col gap-1 w-full">
              <div className="flex items-center gap-2 overflow-hidden">
                <h3 className="font-bold text-foreground whitespace-nowrap">
                  {post.authorName}
                </h3>
                <div className="flex items-center gap-1 text-gray-500 truncate">
                  <span className="text-sm">
                    @{post.authorName.toLowerCase().replace(/\s+/g, "")}
                  </span>
                  <span className="text-gray-400">•</span>
                  <span className="text-sm">
                    {new Date(post.createdAt).toLocaleDateString("pt-BR")}
                  </span>
                </div>
              </div>

              <h1 className="text-lg font-bold text-foreground mt-1">
                {post.title}
              </h1>

              <p className="mt-1 text-foreground/90 leading-relaxed">
                {post.content}
              </p>
            </div>

            {isAuthor && (
              <div className="flex gap-2 ml-4">
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-gray-400 hover:text-twitter dark:hover:text-white transition-colors p-1  rounded-full"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => {
                    if (confirm("Deseja realmente excluir este post?"))
                      deleteMutation.mutate();
                  }}
                  className="text-gray-400 hover:text-red-500 transition-colors p-1 hover:bg-red-500/10 rounded-full"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            )}
          </div>

          {post.image && (
            <div className="mt-4 rounded-2xl overflow-hidden border border-border">
              <img
                src={post.image}
                alt={post.title}
                className="max-h-96 w-full object-cover"
              />
            </div>
          )}

          <div className="mt-4 pt-4 border-t border-border flex items-center gap-6">
            <button
              onClick={() => likeMutation.mutate()}
              className="flex items-center gap-2 text-gray-500 hover:text-red-500 transition-colors group cursor-pointer"
            >
              <div
                className={`p-2 rounded-full transition-colors ${userHasLiked ? "text-red-500" : "group-hover:bg-red-500/10"}`}
              >
                <Heart
                  size={20}
                  className={
                    userHasLiked
                      ? "fill-red-500 text-red-500"
                      : "group-hover:scale-110 transition-transform"
                  }
                />
              </div>
              <span
                className={`text-sm font-medium ${userHasLiked ? "text-red-500" : ""}`}
              >
                {post.likesCount}
              </span>
            </button>
          </div>
        </>
      )}
    </article>
  );
}
