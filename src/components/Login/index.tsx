"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { api } from "@/services/api";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import { Mail, Lock } from "lucide-react";

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
      alert(
        error.response?.data?.message ||
          "Erro ao fazer login. Verifique suas credenciais.",
      );
    }
  };

  return (
    <div className="mt-8 w-full">
      <p className="text-twitter text-2xl font-bold">Olá, de novo!</p>
      <p className="text-sm text-gray-400">
        Por favor, insira os dados solicitados para fazer o login.
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full flex flex-col gap-4 mt-6"
      >
        <div className="flex flex-col gap-1">
          <label className="text-gray-500">E-mail</label>

          <div className="relative">
            <input
              {...register("email")}
              type="email"
              placeholder="Insira o seu e-mail"
              className="w-full border border-gray-300 bg-white rounded-md p-2 pr-10 focus:outline-none focus:border-(--color-twitter)"
            />

            <Mail
              size={18}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
          </div>

          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-gray-500">Senha</label>

          <div className="relative">
            <input
              {...register("password")}
              type="password"
              placeholder="Insira a sua senha"
              className="w-full border border-gray-300 bg-white rounded-md p-2 pr-10 focus:outline-none focus:border-(--color-twitter)"
            />

            <Lock
              size={18}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
          </div>

          {errors.password && (
            <p className="text-sm text-red-500">{errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-4 w-full bg-(--color-twitter) text-white font-semibold py-2 rounded-md hover:bg-(--color-twitter-hover) transition disabled:opacity-60"
        >
          {isSubmitting ? "Carregando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}
