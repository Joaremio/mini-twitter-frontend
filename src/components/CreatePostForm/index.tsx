"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/services/api";
import { createPostSchema, CreatePostData } from "@/schemas/post";
import { ImageIcon, X } from "lucide-react";
import { useState } from "react";

export function CreatePostForm() {
  const queryClient = useQueryClient();
  const [preview, setPreview] = useState<string | null>(null);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setPreview(null);
    setValue("image", null);
  };

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
      alert("Post enviado!");
    },
  });

  return (
    <form
      onSubmit={handleSubmit((data) => mutation.mutate(data))}
      className="bg-white px-4 py-2 rounded-2xl shadow mb-8 border border-gray-300/50"
    >
      <input type="hidden" {...register("title")} />

      <div className="flex flex-col ">
        <textarea
          {...register("content", {
            onChange: (e) => {
              const firstLine = e.target.value.split("\n")[0];
              setValue("title", firstLine.substring(0, 50));
            },
          })}
          placeholder="E aí, o que está rolando?"
          className="w-full text-lg p-2 px-4 mt-3 border-none focus:ring-0 outline-none resize-none min-h-[88px] placeholder-gray-500 text-gray-800"
        />
        {preview && (
          <div className="relative mt-4 mb-4">
            <button
              type="button"
              onClick={() => {
                setPreview(null);
                setValue("image", undefined);
              }}
              className="absolute top-2 left-2 bg-black/70 text-white p-1.5 rounded-full hover:bg-black/90 transition-all"
            >
              <X size={18} />
            </button>
            <img
              src={preview}
              alt="Preview"
              className="w-full rounded-2xl max-h-96 object-cover border border-gray-100"
            />
          </div>
        )}

        {errors.content && (
          <p className="text-red-500 text-sm">{errors.content.message}</p>
        )}

        <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
          <label className="cursor-pointer p-2 hover:bg-blue-50 rounded-full transition-colors group">
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
            <ImageIcon className="text-twitter" size={26} />
          </label>

          <button
            type="submit"
            disabled={mutation.isPending}
            className="bg-twitter hover:bg-twitter-hover text-white px-8 py-2 text-sm rounded-full shadow-md transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
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
