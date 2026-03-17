"use client";

import { Heart, Trash2, Edit } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/services/api";
import { useAuthStore } from "@/store/auth-store";
import { useState } from "react";

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
      alert("Erro ao curtir o post.");
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
      alert("Post atualizado!");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => api.delete(`/posts/${post.id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      alert("Post removido!");
    },
  });

  const isAuthor = String(user?.id) === String(post.authorId);
  return (
    <article className="p-5 bg-white shadow-sm rounded-md border border-gray-100 transition-all hover:shadow-md ">
      {isEditing ? (
        <div className="space-y-3">
          <input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="w-full p-2 border rounded font-bold text-black"
          />
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="w-full p-2 border rounded h-24 text-black"
          />
          <div className="flex gap-2">
            <button
              onClick={() => updateMutation.mutate()}
              disabled={updateMutation.isPending}
              className="bg-blue-500 text-white px-4 py-1 rounded text-sm hover:bg-blue-600 disabled:bg-gray-400"
            >
              {updateMutation.isPending ? "Salvando..." : "Salvar"}
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="bg-gray-200 px-4 py-1 rounded text-sm hover:bg-gray-300 text-black"
            >
              Cancelar
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-start">
            {/* CONTAINER PRINCIPAL DA ESQUERDA */}
            <div className="flex flex-col gap-1 w-full">
              {/* 1. LINHA DO AUTOR E DATA */}
              <div className="flex items-center gap-2 overflow-hidden">
                <h3 className="font-semibold text-[#0F1419] whitespace-nowrap">
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

              {/* 2. TÍTULO DO POST */}
              <h1 className="text-lg font-bold text-[#0F1419]  mt-1">
                {post.title}
              </h1>

              {/* 3. CONTEÚDO DO POST */}
              <p className="mt-1 text-[#0F1419]  leading-relaxed">
                {post.content}
              </p>
            </div>

            {/* BOTÕES DE AÇÃO (SÓ APARECEM SE FOR AUTOR) */}
            {isAuthor && (
              <div className="flex gap-2 ml-4">
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-gray-400 hover:text-blue-500 transition-colors"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => {
                    if (confirm("Deseja realmente excluir este post?"))
                      deleteMutation.mutate();
                  }}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            )}
          </div>

          {/* IMAGEM (SE EXISTIR) */}
          {post.image && (
            <img
              src={post.image}
              alt={post.title}
              className="mt-4 rounded-lg max-h-80 w-full object-cover border border-gray-100"
            />
          )}

          {/* RODAPÉ (LIKES) */}
          <div className="mt-4 pt-4 border-t border-gray-50 flex items-center gap-6">
            <button
              onClick={() => likeMutation.mutate()}
              className="flex items-center gap-1 text-gray-500 hover:text-red-500 transition-colors group"
            >
              <Heart
                size={20}
                className={
                  userHasLiked
                    ? "fill-red-500 text-red-500"
                    : "text-gray-500 group-hover:scale-110 transition-transform"
                }
              />
              <span className="text-sm font-medium">{post.likesCount}</span>
            </button>
          </div>
        </>
      )}
    </article>
  );
}
