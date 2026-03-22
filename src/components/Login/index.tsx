"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { api } from "@/services/api";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import { Mail, Lock, EyeOff, Eye } from "lucide-react";
import { toast } from "sonner";
import { Input } from "../Input";
import { useState } from "react";

const loginSchema = z.object({
  email: z.string().email("Insira um e-mail válido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
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
        <Input
          label="E-mail"
          type="email"
          icon={Mail}
          placeholder="Insira o seu e-mail"
          error={errors.email}
          {...register("email")}
        />

        <div className="relative">
          <Input
            label="Senha"
            type={showPassword ? "text" : "password"}
            placeholder="Insira a sua senha"
            error={errors.password}
            {...register("password")}
          />

          <button
            type="button"
            onClick={() => setShowPassword((prev: any) => !prev)}
            className="absolute right-4 top-[38px] text-gray-500 hover:text-gray-700"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-6 w-full bg-twitter hover:bg-twitter-hover text-white font-bold py-3 rounded-full shadow-lg shadow-twitter/20 cursor-pointer transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Entrando..." : "Continuar"}
        </button>
      </form>
    </div>
  );
}
