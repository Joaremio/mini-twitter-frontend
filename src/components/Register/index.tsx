"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { api } from "@/services/api";
import { useRouter } from "next/navigation";
import { Lock, Mail, User } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { toast } from "sonner";

const registerSchema = z.object({
  name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function Register() {
  const setUser = useAuthStore((state) => state.setUser);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    try {
      await api.post("/auth/register", data);

      const loginResponse = await api.post("/auth/login", {
        email: data.email,
        password: data.password,
      });

      const { token, user } = loginResponse.data;

      localStorage.setItem("b2bit_token", token);
      localStorage.setItem("b2bit_user", JSON.stringify(user));

      setUser(user);
      toast.success("Conta criada com sucesso!");
      router.push("/");
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Erro ao registrar");
    }
  };

  return (
    <div className="mt-8 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-twitter dark:text-white text-2xl font-bold">
        Olá, vamos começar!
      </h2>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Por favor, insira os dados solicitados para fazer o cadastro
      </p>

      <form
        className="w-full flex flex-col gap-4 mt-6"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-foreground/70 ml-1">
            Nome
          </label>
          <div className="relative group">
            <input
              {...register("name")}
              type="text"
              className="w-full border border-border bg-background rounded-xl p-3 pr-10 outline-none focus:border-twitter focus:ring-2 focus:ring-twitter/10 transition-all text-foreground placeholder:text-gray-400"
              placeholder="Insira o seu nome"
            />
            <User
              size={18}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-twitter dark:group-focus-within:text-white transition-colors"
            />
          </div>
          {errors.name && (
            <p className="text-red-500 text-xs ml-1">{errors.name.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-foreground/70 ml-1">
            E-mail
          </label>
          <div className="relative group">
            <input
              {...register("email")}
              type="email"
              className="w-full border border-border bg-background rounded-xl p-3 pr-10 outline-none focus:border-twitter focus:ring-2 focus:ring-twitter/10 transition-all text-foreground placeholder:text-gray-400"
              placeholder="Insira o seu e-mail"
            />
            <Mail
              size={18}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-twitter dark:group-focus-within:text-white transition-colors"
            />
          </div>
          {errors.email && (
            <p className="text-red-500 text-xs ml-1">{errors.email.message}</p>
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
              className="w-full border border-border bg-background rounded-xl p-3 pr-10 outline-none focus:border-twitter focus:ring-2 focus:ring-twitter/10 transition-all text-foreground placeholder:text-gray-400"
              placeholder="Crie uma senha forte"
            />
            <Lock
              size={18}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-twitter dark:group-focus-within:text-white transition-colors"
            />
          </div>
          {errors.password && (
            <p className="text-red-500 text-xs ml-1">
              {errors.password.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-6 w-full bg-twitter hover:bg-twitter-hover text-white font-bold py-3 rounded-full shadow-lg shadow-twitter/20 cursor-pointer transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Criando conta..." : "Continuar"}
        </button>
      </form>
    </div>
  );
}
