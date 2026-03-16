"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/services/api";
import { createPostSchema, CreatePostData } from "@/schemas/post";

export function CreatePostForm() {
  const queryClient = useQueryClient();

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreatePostData>({
    resolver: zodResolver(createPostSchema),
  });

  const mutation = useMutation({
    mutationFn: async (data: CreatePostData) => {
      let imageString = "";

      if (data.image?.[0]) {
        imageString = await fileToBase64(data.image[0]);
      }

      return api.post("/posts", {
        title: data.title,
        content: data.content,
        image: imageString,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      reset();
      alert("Post criado com sucesso!");
    },
  });

  return (
    <form
      onSubmit={handleSubmit((data) => mutation.mutate(data))}
      className="bg-white p-6 rounded-lg shadow mb-8 border"
    >
      <h2 className="text-xl font-bold mb-4">No que você está pensando?</h2>

      <div className="space-y-4">
        <input
          {...register("title")}
          placeholder="Título do post"
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
        />
        {errors.title && (
          <p className="text-red-500 text-sm">{errors.title.message}</p>
        )}

        <textarea
          {...register("content")}
          placeholder="Escreva seu post aqui..."
          className="w-full p-2 border rounded h-24 resize-none outline-none"
        />
        {errors.content && (
          <p className="text-red-500 text-sm">{errors.content.message}</p>
        )}

        <div className="flex items-center justify-between">
          <input
            type="file"
            {...register("image")}
            className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          <button
            type="submit"
            disabled={mutation.isPending}
            className="bg-blue-600 text-white px-6 py-2 rounded-full font-bold hover:bg-blue-700 disabled:bg-gray-400 transition-all"
          >
            {mutation.isPending ? "Postando..." : "Postar"}
          </button>
        </div>
        {errors.image && (
          <p className="text-red-500 text-sm">{String(errors.image.message)}</p>
        )}
      </div>
    </form>
  );
}
