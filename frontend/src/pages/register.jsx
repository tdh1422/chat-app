import { useState } from "react";
import axios from "axios";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const register = async () => {
    await axios.post("http://localhost:5000/api/auth/register", {
      username,
      email,
      password
    });
    window.location.href = "/";
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded shadow w-80">
        <h2 className="text-xl font-bold mb-4">Register</h2>
        <input className="border p-2 w-full mb-2" placeholder="Username" onChange={e=>setUsername(e.target.value)} />
        <input className="border p-2 w-full mb-2" placeholder="Email" onChange={e=>setEmail(e.target.value)} />
        <input type="password" className="border p-2 w-full mb-2" placeholder="Password" onChange={e=>setPassword(e.target.value)} />
        <button onClick={register} className="bg-green-500 text-white p-2 w-full">Sign Up</button>
      </div>
    </div>
  );
}