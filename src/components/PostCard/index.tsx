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
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(post.title);
  const [editContent, setEditContent] = useState(post.content);
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  const likeMutation = useMutation({
    mutationFn: () => api.post(`/posts/${post.id}/like`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
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
    <article className="p-5 bg-white shadow-sm rounded-xl border border-gray-100 transition-all hover:shadow-md">
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
            <div>
              <h3 className="font-bold text-lg text-gray-900">{post.title}</h3>
              <p className="text-xs text-gray-400 mb-2">
                Por: {post.authorName} •{" "}
                {new Date(post.createdAt).toLocaleDateString()}
              </p>
            </div>

            {isAuthor && (
              <div className="flex gap-2">
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

          <p className="mt-2 text-gray-800 leading-relaxed">{post.content}</p>

          {post.image && (
            <img
              src={post.image}
              alt={post.title}
              className="mt-4 rounded-lg max-h-80 w-full object-cover border border-gray-100"
            />
          )}

          <div className="mt-4 pt-4 border-t border-gray-50 flex items-center gap-6">
            <button
              onClick={() => likeMutation.mutate()}
              className="flex items-center gap-1 text-gray-500 hover:text-red-500 transition-colors group"
            >
              <Heart
                size={20}
                className={
                  post.likesCount > 0
                    ? "fill-red-500 text-red-500"
                    : "group-hover:scale-110 transition-transform"
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
