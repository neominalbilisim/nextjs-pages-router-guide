import { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { NextPage } from "next";
import { loginSchema, type LoginInput } from "@/lib/schemas/auth";

const Login: NextPage = () => {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const redirectTo =
    typeof router.query.redirect === "string" ? router.query.redirect : "/dashboard";

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "ayse@example.com", password: "" },
  });

  async function onSubmit(values: LoginInput) {
    setServerError(null);

    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const body = await res.json();

    if (!res.ok || !body.ok) {
      if (body.fieldErrors) {
        for (const [field, message] of Object.entries(body.fieldErrors) as [
          keyof LoginInput,
          string
        ][]) {
          setError(field, { message });
        }
      } else {
        setServerError(body.message ?? "Giriş başarısız");
      }
      return;
    }

    router.push(redirectTo);
  }

  return (
    <div>
      <Head>
        <title>Giriş Yap</title>
      </Head>
      <span className="badge">react-hook-form + zod + gerçek JWT</span>
      <h1>Giriş Yap</h1>
      <p className="lede">
        Form <code>react-hook-form</code> ile yönetiliyor ve <code>zod</code> şeması
        ile doğrulanıyor. Gönderildiğinde <code>/api/login</code> şifreyi bcrypt ile
        karşılaştırıyor, <code>jsonwebtoken</code> ile imzalanmış gerçek bir JWT
        üretiyor ve onu <code>httpOnly</code> çereze yazıyor. <code>/dashboard</code>
        &apos;daki <code>getServerSideProps</code> bu token&apos;ın imzasını
        doğrulayarak kullanıcıyı çözümlüyor.
      </p>

      <form className="card form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="field">
          <label htmlFor="email">E-posta</label>
          <input id="email" type="email" autoComplete="email" {...register("email")} />
          {errors.email && <p className="field-error">{errors.email.message}</p>}
        </div>

        <div className="field">
          <label htmlFor="password">Şifre</label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            {...register("password")}
          />
          {errors.password && (
            <p className="field-error">{errors.password.message}</p>
          )}
        </div>

        {serverError && <p className="field-error">{serverError}</p>}

        <button className="primary" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Giriş yapılıyor..." : "Giriş yap"}
        </button>
      </form>

      <div className="callout info" style={{ marginTop: 16 }}>
        Demo hesap: <code>ayse@example.com</code> / <code>demo1234</code>
      </div>
    </div>
  );
};

export default Login;
