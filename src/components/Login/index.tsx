"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { api } from "@/services/api";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import { Mail, Lock } from "lucide-react";
import { toast } from "sonner";

const loginSchema = z.object({
  email: z.string().email("Insira um e-mail válido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function Login() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      const response = await api.post("/auth/login", data);
      const { token, user } = response.data;

      localStorage.setItem("b2bit_token", token);
      localStorage.setItem("b2bit_user", JSON.stringify(user));

      setUser(user);

      router.push("/");
    } catch (error: any) {
      toast.error(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Erro ao fazer login.",
      );
    }
  };

  return (
    <div className="mt-8 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-twitter dark:text-white text-2xl font-bold">
        Olá, de novo!
      </h2>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Por favor, insira os dados solicitados para fazer o login.
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full flex flex-col gap-4 mt-6"
      >
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-foreground/70 ml-1">
            E-mail
          </label>
          <div className="relative group">
            <input
              {...register("email")}
              type="email"
              placeholder="Insira o seu e-mail"
              className="w-full border border-border bg-background rounded-xl p-3 pr-10 outline-none focus:border-twitter focus:ring-2 focus:ring-twitter/10 transition-all text-foreground placeholder:text-gray-400"
            />
            <Mail
              size={18}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-twitter  dark:text-white transition-colors"
            />
          </div>
          {errors.email && (
            <p className="text-xs text-red-500 ml-1">{errors.email.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-foreground/70 ml-1">
            Senha
          </label>
          <div className="relative group">
            <input
              {...register("password")}
              type="password"
              placeholder="Insira a sua senha"
              className="w-full border border-border bg-background rounded-xl p-3 pr-10 outline-none focus:border-twitter focus:ring-2 focus:ring-twitter/10 transition-all text-foreground placeholder:text-gray-400"
            />
            <Lock
              size={18}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-twitter dark:text-white transition-colors"
            />
          </div>
          {errors.password && (
            <p className="text-xs text-red-500 ml-1">
              {errors.password.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-6 w-full bg-twitter hover:bg-twitter-hover text-white font-bold py-3 rounded-full shadow-lg shadow-twitter/20 cursor-pointer transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}
