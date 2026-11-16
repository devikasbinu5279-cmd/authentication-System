import { useEffect, useState } from "react";

const API = "http://localhost:5001/api/auth";

export default function App() {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  function update(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) return;
    fetch(`${API}/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then(async response => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.message);
        setUser(data.user);
      })
      .catch(() => localStorage.removeItem("authToken"));
  }, []);

  async function submit(event) {
    event.preventDefault();
    setMessage("");
    setLoading(true);
    try {
      const response = await fetch(`${API}/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Something went wrong.");
      setError(false);
      setMessage(data.message);
      if (mode === "login") {
        localStorage.setItem("authToken", data.token);
        setUser(data.user);
      } else {
        setForm({ name: "", email: form.email, password: "", confirmPassword: "" });
        setMode("login");
      }
    } catch (err) {
      setError(true);
      setMessage(err.message || "Unable to contact the server.");
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    localStorage.removeItem("authToken");
    setUser(null);
    setForm({ name: "", email: "", password: "", confirmPassword: "" });
    setMessage("You have logged out.");
    setError(false);
  }

  if (user) return <main className="page"><section className="panel dashboard">
    <div className="brand">◈ Account Portal</div><div className="avatar">{user.name[0]?.toUpperCase()}</div>
    <p className="eyebrow">YOUR DASHBOARD</p><h1>Welcome, {user.name}!</h1>
    <p className="muted">You are successfully logged in.</p>
    <div className="profile"><span>Registered email</span><strong>{user.email}</strong></div>
    <button onClick={logout} className="secondary">Log out</button>
  </section></main>;

  return <main className="page">
    <section className="panel">
      <div className="brand">◈ Account Portal</div>
      <p className="eyebrow">SIMPLE • SECURE • PERSONAL</p>
      <h1>{mode === "login" ? "Welcome back" : "Create your account"}</h1>
      <p className="muted">{mode === "login" ? "Sign in with your registered details." : "Register to get started."}</p>
      <div className="tabs"><button className={mode === "login" ? "active" : ""} onClick={() => {setMode("login");setMessage("");}}>Login</button><button className={mode === "register" ? "active" : ""} onClick={() => {setMode("register");setMessage("");}}>Register</button></div>
      <form onSubmit={submit}>
        {mode === "register" && <label>Full name<input name="name" value={form.name} onChange={update} placeholder="Your name" maxLength="80" required /></label>}
        <label>Email address<input name="email" type="email" value={form.email} onChange={update} placeholder="you@example.com" required /></label>
        <label>Password<input name="password" type="password" value={form.password} onChange={update} placeholder="At least 8 characters" minLength="8" required /></label>
        {mode === "register" && <label>Confirm password<input name="confirmPassword" type="password" value={form.confirmPassword} onChange={update} placeholder="Enter password again" required /></label>}
        <button className="primary" disabled={loading}>{loading ? "Please wait..." : mode === "login" ? "Login" : "Create account"}</button>
      </form>
      {message && <p className={error ? "notice error" : "notice success"}>{message}</p>}
      <p className="footnote">Passwords are securely hashed before they are stored.</p>
    </section>
  </main>;
}
