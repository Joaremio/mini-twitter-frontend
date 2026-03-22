"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/services/api";
import { createPostSchema, CreatePostData } from "@/schemas/post";
import { ImageIcon, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function CreatePostForm() {
  const queryClient = useQueryClient();
  const [preview, setPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CreatePostData>({
    resolver: zodResolver(createPostSchema),
  });

  const mutation = useMutation({
    mutationFn: async (data: CreatePostData) => {
      let imageString = "";
      if (preview) {
        imageString = preview;
      }

      const postTitle =
        data.title || data.content.split("\n")[0].substring(0, 50);

      return api.post("/posts", {
        title: postTitle,
        content: data.content,
        image: imageString,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      reset();
      setPreview(null);
      toast.success("Post enviado!");
    },
  });

  return (
    <form
      onSubmit={handleSubmit((data) => mutation.mutate(data))}
      className="bg-card px-4 py-2 rounded-2xl shadow-sm mb-8 border border-border transition-colors"
    >
      <input type="hidden" {...register("title")} />

      <div className="flex flex-col">
        <textarea
          {...register("content", {
            onChange: (e) => {
              const firstLine = e.target.value.split("\n")[0];
              setValue("title", firstLine.substring(0, 50));
            },
          })}
          placeholder="E aí, o que está rolando?"
          className="w-full text-lg p-2 px-4 mt-3 border-none focus:ring-0 outline-none resize-none min-h-[88px] placeholder-gray-500 text-foreground bg-transparent"
        />

        {preview && (
          <div className="relative mt-4 mb-4">
            <button
              type="button"
              onClick={() => {
                setPreview(null);
                setValue("image", undefined);
              }}
              className="absolute top-2 left-2 bg-black/70 text-white p-1.5 rounded-full hover:bg-black/90 transition-all z-10"
            >
              <X size={18} />
            </button>
            <img
              src={preview}
              alt="Preview"
              className="w-full rounded-2xl max-h-96 object-cover border border-border"
            />
          </div>
        )}

        {errors.content && (
          <p className="text-red-500 text-sm ml-4 mb-2">
            {errors.content.message}
          </p>
        )}
        <div className="pt-4 border-t border-border flex items-center justify-between">
          <label className="cursor-pointer p-2 hover:bg-twitter/10 dark:hover:bg-twitter/20 rounded-full transition-colors group">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              {...register("image", {
                onChange: (e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setPreview(reader.result as string);
                    };
                    reader.readAsDataURL(file);
                  }
                },
              })}
            />
            <ImageIcon className="text-twitter dark:text-white" size={26} />
          </label>

          <button
            type="submit"
            disabled={mutation.isPending}
            className="bg-twitter hover:bg-twitter-hover text-white px-8 py-2 text-sm font-bold rounded-full shadow-md transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            {mutation.isPending ? "Postando..." : "Postar"}
          </button>
        </div>

        {errors.image && (
          <p className="text-red-500 text-sm mt-2">
            {String(errors.image.message)}
          </p>
        )}
      </div>
    </form>
  );
}
