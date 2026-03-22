"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { api } from "@/services/api";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { toast } from "sonner";
import { Input } from "@/components/Input";
import { useState } from "react";

const registerSchema = z.object({
  name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function Register() {
  const setUser = useAuthStore((state) => state.setUser);
  const [showPassword, setShowPassword] = useState(false);
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
        <Input
          label="Nome"
          type="text"
          icon={User}
          placeholder="Insira o seu nome"
          error={errors.name}
          {...register("name")}
        />

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
          {isSubmitting ? "Criando conta..." : "Continuar"}
        </button>
      </form>
    </div>
  );
}
