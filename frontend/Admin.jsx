import React, { useEffect, useState } from "react";

const CATEGORIES = {
  music: "Muzika",
  sport: "Sportas",
  culture: "Kultūra",
  food: "Maistas",
  education: "Švietimas",
  other: "Kita",
};

export default function Admin() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [login, setLogin] = useState({ email: "", password: "" });

  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    event_date: "",
    location: "",
    category: "music",
    image_url: "",
  });

  const fetchEvents = async () => {
    const res = await fetch("/api/events");
    const data = await res.json();
    setEvents(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const doLogin = async () => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(login),
    });
    const data = await res.json();
    if (!res.ok) return alert(data?.error || "Login failed");

    localStorage.setItem("token", data.token);
    setToken(data.token);
    alert("Prisijungta kaip admin ✅");
  };

  const addEvent = async () => {
    if (!token) return alert("Reikia prisijungti");
    const required = ["title", "description", "event_date", "location", "category"];
    for (const k of required) if (!form[k]) return alert("Užpildyk privalomus laukus");

    const res = await fetch("/api/admin/events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) return alert(data?.error || "Nepavyko pridėti");

    setForm({ title: "", description: "", event_date: "", location: "", category: "music", image_url: "" });
    await fetchEvents();
  };

  const deleteEvent = async (id) => {
    if (!token) return alert("Reikia prisijungti");
    if (!confirm("Tikrai trinti renginį?")) return;

    const res = await fetch(`/api/admin/events/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!res.ok) return alert(data?.error || "Nepavyko ištrinti");

    await fetchEvents();
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
  };

  return (
    <div style={{ padding: 20, maxWidth: 900, margin: "0 auto" }}>
      <h1>Admin Panel</h1>

      {!token ? (
        <div style={{ border: "1px solid #ddd", padding: 16, borderRadius: 12, marginBottom: 20 }}>
          <h3>Admin prisijungimas</h3>
          <input
            placeholder="Email"
            value={login.email}
            onChange={(e) => setLogin({ ...login, email: e.target.value })}
            style={{ width: "100%", padding: 10, marginBottom: 10 }}
          />
          <input
            placeholder="Password"
            type="password"
            value={login.password}
            onChange={(e) => setLogin({ ...login, password: e.target.value })}
            style={{ width: "100%", padding: 10, marginBottom: 10 }}
          />
          <button onClick={doLogin} style={{ padding: 10, width: "100%" }}>
            Prisijungti
          </button>
        </div>
      ) : (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div>✅ Prisijungta (token yra)</div>
          <button onClick={logout}>Atsijungti</button>
        </div>
      )}

      <div style={{ border: "1px solid #ddd", padding: 16, borderRadius: 12, marginBottom: 24 }}>
        <h3>Pridėti renginį</h3>

        <input placeholder="Pavadinimas" value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          style={{ width: "100%", padding: 10, marginBottom: 10 }} />

        <input type="date" value={form.event_date}
          onChange={(e) => setForm({ ...form, event_date: e.target.value })}
          style={{ width: "100%", padding: 10, marginBottom: 10 }} />

        <input placeholder="Vieta" value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
          style={{ width: "100%", padding: 10, marginBottom: 10 }} />

        <select value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          style={{ width: "100%", padding: 10, marginBottom: 10 }}>
          {Object.entries(CATEGORIES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>

        <textarea placeholder="Aprašymas" value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          style={{ width: "100%", padding: 10, marginBottom: 10, minHeight: 100 }} />

        <input placeholder="Nuotraukos URL (nebūtina)" value={form.image_url}
          onChange={(e) => setForm({ ...form, image_url: e.target.value })}
          style={{ width: "100%", padding: 10, marginBottom: 10 }} />

        <button onClick={addEvent} style={{ padding: 10, width: "100%" }}>
          Pridėti
        </button>
      </div>

      <h3>Renginių sąrašas</h3>
      <div style={{ display: "grid", gap: 10 }}>
        {events.map((e) => (
          <div key={e.id} style={{ border: "1px solid #eee", padding: 12, borderRadius: 12, display: "flex", justifyContent: "space-between", gap: 12 }}>
            <div>
              <div style={{ fontWeight: 800 }}>{e.title}</div>
              <div style={{ opacity: 0.8 }}>{e.location} • {e.event_date} • {e.category}</div>
            </div>
            <button onClick={() => deleteEvent(e.id)} style={{ padding: "8px 12px" }}>
              Trinti
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
