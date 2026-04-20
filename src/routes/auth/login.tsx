import {
  createFileRoute,
  redirect,
  useRouter,
  useNavigate,
} from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { loginFn, verify2FAFn } from "#/server/auth";

// ✅ Validamos el search param "redirect" para saber a dónde ir después del login
const loginSearchSchema = z.object({
  redirect: z.string().optional().catch(undefined),
});

export const Route = createFileRoute("/auth/login")({
  validateSearch: loginSearchSchema,

  beforeLoad: ({ context, search }) => {
    // ✅ Si ya está autenticado, redirigir
    if (context.auth.user) {
      throw redirect({ to: search.redirect ?? "/dashboard" });
    }
  },

  component: LoginPage,
});

type Step = "login" | "2fa";

function LoginPage() {
  const router = useRouter();
  const navigate = useNavigate();
  const { redirect: redirectTo } = Route.useSearch();

  const [step, setStep] = useState<Step>("login");
  const [pendingEmail, setPendingEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const form = new FormData(e.currentTarget);

    const result = await loginFn({
      data: {
        email: form.get("email") as string,
        password: form.get("password") as string,
      },
    });

    setLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    if (result.requires2FA) {
      setPendingEmail(result.email);
      setStep("2fa");
      return;
    }

    if (result.success) {
      // ✅ router.invalidate() re-ejecuta todos los beforeLoad
      // Esto recarga el contexto con el nuevo usuario autenticado
      await router.invalidate();
      navigate({ to: redirectTo ?? "/dashboard" });
    }
  }

  async function handle2FA(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const form = new FormData(e.currentTarget);

    const result = await verify2FAFn({
      data: {
        email: pendingEmail,
        code: form.get("code") as string,
      },
    });

    setLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    if (result.success) {
      await router.invalidate();
      navigate({ to: redirectTo ?? "/dashboard" });
    }
  }

  if (step === "2fa") {
    return (
      <main>
        <h1>Verificación de dos pasos</h1>
        <p>Código enviado a {pendingEmail}</p>
        <form onSubmit={handle2FA}>
          <input
            name="code"
            type="text"
            inputMode="numeric"
            maxLength={6}
            placeholder="000000"
            autoComplete="one-time-code"
            required
          />
          {error && <p role="alert">{error}</p>}
          <button type="submit" disabled={loading}>
            {loading ? "Verificando..." : "Verificar"}
          </button>
        </form>
        <button onClick={() => setStep("login")}>Volver</button>
      </main>
    );
  }

  return (
    <main>
      <h1>Iniciar sesión</h1>
      <form onSubmit={handleLogin}>
        <input
          name="email"
          type="email"
          placeholder="correo@ejemplo.com"
          autoComplete="email"
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Contraseña"
          autoComplete="current-password"
          required
        />
        {error && <p role="alert">{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? "Ingresando..." : "Ingresar"}
        </button>
      </form>
    </main>
  );
}
