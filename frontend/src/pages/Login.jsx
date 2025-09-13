import React, { useState } from 'react'
import { useAuthStore } from '../store/useAuthStore';
import toast from 'react-hot-toast';
import AuthImagePattern from '../components/AuthImagePattern';
import { Eye, EyeOff, Loader2, Lock, Mail, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

const Login = () => {

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const{isLoggingIn,login}=useAuthStore()

  const validateForm = () => {
    if(!formData.email.trim()) return toast.error("Email is required")
    if(!formData.password) return toast.error("Password is required")
    if(formData.password.length <6) return toast.error("Password must be at least 6 characters long")
    if(!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) return toast.error("Invalid email address")

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

   const success= validateForm()

   if(success == true) login(formData)
    
  };
  return (
    <div className="bg-base-200 min-h-screen grid lg:grid-cols-2">
      {/* left side */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-4">
          <div className="text-center mb-5">
            <div className="flex flex-col items-center gap-2 group">
              <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <MessageSquare className="size-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold mt-2">Welcome Back</h1>
              <p className="text-base-content/60">
                Sign in to your account
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="form-control">
              <label className="label">
                <span className="font-medium label-text">Email</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-1">
                  <Mail className="size-5 text-base-content/40 " />
                </div>
                <input
                  type="email"
                  className="w-full pl-10 py-2 border border-zinc-500 bg-[#1D232A] outline-0 rounded placeholder:text-base-content/40"
                  placeholder="yours@example.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="form-control">
              <label className="label">
                <span className="font-medium label-text">password</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-1">
                  <Lock className="size-5 text-base-content/40" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full pl-10 py-2 border border-zinc-500 bg-[#1D232A] outline-0 rounded placeholder:text-base-content/40"
                  placeholder="******"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center z-1"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="size-5 text-base-content/40 " />
                  ) : (
                    <Eye className="size-5 text-base-content/40" />
                  )}
                </button>
              </div>
            </div>
            <button type="submit" className="btn btn-primary w-full" disabled={isLoggingIn}>
              {isLoggingIn ? (
                <>
                <Loader2 className="size-5 animate-spin" />
                Loading...
                </>
              ) : ("Log in")}
            </button>
          </form>
          <div className="text-center">
            <p className=" text-base-content/60">
              Don't have an account?{" "}
              <Link to="/signup" className="text-primary font-medium underline">
                Create account
              </Link>
            </p>
          </div>
        </div>
      </div>
      {/* right side */}
      <AuthImagePattern
      title="Welcome Back"
      subtitle="Sign in to continue your conversations and catch up on the latest chats."
      />
    </div>
  )
}

export default Login
