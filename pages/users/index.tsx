import { useEffect, useState } from "react";
import Head from "next/head";
import type { JsonPlaceholderUser } from "@/pages/api/users";

type LoadState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "success"; users: JsonPlaceholderUser[] };

export default function UsersIndex() {
  const [state, setState] = useState<LoadState>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;

    fetch("/api/users")
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(`API ${res.status} döndü`);
        }
        return (await res.json()) as JsonPlaceholderUser[];
      })
      .then((users) => {
        if (!cancelled) setState({ status: "success", users });
      })
      .catch((err) => {
        if (!cancelled) {
          setState({
            status: "error",
            message: err instanceof Error ? err.message : "Bilinmeyen hata",
          });
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div>
      <Head>
        <title>Users</title>
      </Head>
      <span className="badge">API Routes (gerçek dış API verisi)</span>
      <h1>Users</h1>
      <p className="lede">
        Bu liste client&apos;ta <code>/api/users</code>&apos;a fetch atıyor;
        o endpoint de sunucu tarafında{" "}
        <code>https://jsonplaceholder.typicode.com/users</code>&apos;dan
        gerçek veri çekip aynen döndürüyor.
      </p>

      {state.status === "loading" && (
        <div className="loading-box">Yükleniyor...</div>
      )}

      {state.status === "error" && (
        <div className="error-box">Hata: {state.message}</div>
      )}

      {state.status === "success" && (
        <ul className="route-list">
          {state.users.map((user) => (
            <li key={user.id}>
              <span style={{ fontWeight: 600 }}>{user.name}</span>
              <div className="desc">
                {user.email} — {user.company.name} — {user.address.city}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
