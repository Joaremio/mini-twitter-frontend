"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { api } from "@/services/api";
import { useRouter } from "next/navigation";
import { Lock, Mail, User } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";

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
    formState: { errors },
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

      router.push("/");
    } catch (error: any) {
      console.error(error.response?.data);
      alert(error.response?.data?.message || "Erro ao registrar");
    }
  };

  return (
    <div className="mt-8 w-full ">
      <p className="text-twitter text-2xl font-bold">Olá, vamos começar!</p>
      <p className="text-sm text-gray-400">
        Por favor, insira os dados solicitados para fazer o cadastro
      </p>
      <form
        className="w-full flex flex-col gap-4 mt-6"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex flex-col gap-1">
          <label className="text-gray-500">Nome</label>
          <div className="relative">
            <input
              {...register("name")}
              type="text"
              className="w-full border border-gray-300 bg-white rounded-md p-2 pr-10 focus:outline-none focus:border-(--color-twitter)"
              placeholder="Insira o seu nome"
            />
            <User
              size={18}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
          </div>
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-gray-500">E-mail</label>
          <div className="relative">
            <input
              {...register("email")}
              type="email"
              className="w-full border border-gray-300 rounded-md bg-white p-2 pr-10 focus:outline-none focus:border-(--color-twitter)"
              placeholder="Insira o seu e-mail"
            />
            <Mail
              size={18}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
          </div>
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-gray-500">Password</label>
          <div className="relative">
            <input
              {...register("password")}
              type="password"
              className="w-full border border-gray-300 rounded-md  bg-white p-2 pr-10 focus:outline-none focus:border-(--color-twitter)]"
              placeholder="Insira a sua senha "
            />
            <Lock
              size={18}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
          </div>
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          className="mt-4 w-full bg-twitter text-white font-semibold py-2 rounded-md cursor-pointer transition"
        >
          Continue
        </button>
      </form>
    </div>
  );
}
