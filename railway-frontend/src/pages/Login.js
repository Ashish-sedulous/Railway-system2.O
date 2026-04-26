import { useState } from "react";
import { loginUser } from "../services/api";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });

  const handleSubmit = async () => {
    const res = await loginUser(form);

    if (res.success) {
      localStorage.setItem("token", res.data.token);
      alert("Login successful");
    } else {
      alert(res.message);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <input placeholder="Email" onChange={e => setForm({...form, email: e.target.value})} />
      <input placeholder="Password" type="password" onChange={e => setForm({...form, password: e.target.value})} />
      <button onClick={handleSubmit}>Login</button>
    </div>
  );
}