import React, { useState } from 'react';
import { Eye, EyeOff, XCircle } from 'lucide-react';
import { adminLogin } from "../network/auth";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await adminLogin(email, password);
      localStorage.setItem("userDetails", JSON.stringify(response.user));
      navigate("/calendar");
    } catch (error) {
      console.error(error);
      setErrorMsg("Invalid email or password");
      setTimeout(() => setErrorMsg(''), 3000);
    }
  };

  const isTyping = email.length > 0 || password.length > 0;

  return (
    <div className="flex flex-col gap-10 items-center justify-center min-h-screen bg-[#fdf1dd] px-4">

      {/* Error Toast */}
      {errorMsg && (
        <div className="flex items-center justify-center bg-[#f8d7da] text-[#a94442] border border-[#a94442] px-4 py-2 p-5 rounded-md shadow-md w-[250px]">
          <XCircle className="mr-2 text-[#a94442]" size={30} />
          <span className="text-md font-semibold">{errorMsg}</span>
        </div>
      )}

      {/* Login Card */}
      <form
        onSubmit={handleSubmit}
        className="bg-[#fdf1dd] w-full max-w-sm p-8 rounded-xl shadow-lg"
      >
        <div className="bg-[#eac089] text-center text-3xl font-serif text-[#4b2b2b] py-4 rounded-t-xl">
          Administrator
        </div>

        <div className="mt-6">
          <label className="block text-[#4b2b2b] font-serif mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border border-[#4b2b2b] rounded-md focus:outline-none focus:ring-2 focus:ring-[#d2a679] bg-[#fdf1dd]"
          />
        </div>

        <div className="mt-4 relative">
          <label className="block text-[#4b2b2b] font-serif mb-1">Password</label>
          <input
            type={showPass ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border border-[#4b2b2b] rounded-md bg-[#fdf1dd] focus:outline-none focus:ring-2 focus:ring-[#d2a679]"
          />
          <div
            className="absolute right-3 top-9 cursor-pointer text-[#a94442]"
            onClick={() => setShowPass(!showPass)}
          >
            {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
          </div>
        </div>

        <button
          type="submit"
          className={`mt-6 w-full py-2 ${
            isTyping ? 'bg-sidebar-1' : 'bg-[#f6e3c5]'
          } text-[#4b2b2b] font-serif text-xl rounded-md shadow-md border border-[#eac089] hover:shadow-lg transition-all`}
        >
          Sign In
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
