"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { api } from "@/services/api";
import { useRouter } from "next/navigation";

const registerSchema = z.object({
  name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
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
      await api.post("/auth/register", data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      alert("Conta criada com sucesso!");
      router.push("/login");
    } catch (error: any) {
      console.error(error.response?.data);
      alert(error.response?.data?.message || "Erro ao registrar");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="p-8 bg-white rounded shadow-md w-96"
      >
        <h1 className="text-2xl font-bold mb-4">Criar Conta</h1>
        <input
          {...register("name")}
          placeholder="Nome de usuário"
          className="w-full mb-2 p-2 border rounded"
        />
        {errors.name && (
          <p className="text-red-500 text-xs">{errors.name.message}</p>
        )}

        <input
          {...register("email")}
          placeholder="E-mail"
          className="w-full mb-2 p-2 border rounded"
        />
        {errors.email && (
          <p className="text-red-500 text-xs">{errors.email.message}</p>
        )}

        <input
          {...register("password")}
          type="password"
          placeholder="Senha"
          className="w-full mb-4 p-2 border rounded"
        />
        {errors.password && (
          <p className="text-red-500 text-xs">{errors.password.message}</p>
        )}

        <button
          type="submit"
          className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
        >
          Cadastrar
        </button>
      </form>
    </div>
  );
}
