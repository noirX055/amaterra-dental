"use client";

import Image from "next/image";
import { useActionState } from "react";
import { loginAction } from "./actions";

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, null);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-zinc-950">
      <Image
        src="/login-bg.png"
        alt=""
        fill
        priority
        className="object-cover"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-black/55"
      />

      <div className="hero-appear relative z-10 mx-4 w-full max-w-md">
        <div className="rounded-3xl border border-white/10 bg-white/6 p-8 shadow-2xl shadow-black/40 backdrop-blur-xl sm:p-10">
          <div className="mb-8 flex justify-center">
            <div className="relative h-14 w-[210px]">
              <Image
                src="/logo.webp"
                alt="Amaterra"
                fill
                className="origin-center scale-[3.2] object-contain brightness-0 invert"
                priority
              />
            </div>
          </div>

          <div className="mb-8 text-center">
            <h1 className="text-2xl font-semibold tracking-tight text-white">
              Панель управления
            </h1>
            <p className="mt-2 text-sm text-zinc-400">
              Войдите чтобы продолжить
            </p>
          </div>

          {state?.error && (
            <div className="mb-6 flex items-center gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              <svg
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-5 w-5 shrink-0 text-red-400"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
                  clipRule="evenodd"
                />
              </svg>
              {state.error}
            </div>
          )}

          <form action={formAction} className="space-y-5">
            <div>
              <label
                htmlFor="login-email"
                className="mb-1.5 block text-sm font-medium text-zinc-300"
              >
                Email
              </label>
              <input
                id="login-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="Email"
                className="block w-full rounded-xl border border-white/15 bg-black/25 px-4 py-3 text-sm text-white placeholder-zinc-400 outline-none transition-colors focus:border-white/30"
              />
            </div>

            <div>
              <label
                htmlFor="login-password"
                className="mb-1.5 block text-sm font-medium text-zinc-300"
              >
                Password
              </label>
              <input
                id="login-password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                placeholder="password"
                className="block w-full rounded-xl border border-white/15 bg-black/25 px-4 py-3 text-sm text-white placeholder-zinc-400 outline-none transition-colors focus:border-white/30"
              />
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="group relative mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-900/30 transition-all hover:bg-emerald-500 hover:shadow-emerald-900/40 disabled:opacity-60 disabled:hover:bg-emerald-600"
            >
              {isPending ? (
                <>
                  <svg
                    className="h-4 w-4 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="3"
                      className="opacity-25"
                    />
                    <path
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      fill="currentColor"
                      className="opacity-75"
                    />
                  </svg>
                  Вход…
                </>
              ) : (
                "Войти"
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-xs text-zinc-500">
            © {new Date().getFullYear()} Amaterra Dental Clinic
          </p>
        </div>
      </div>
    </div>
  );
}
