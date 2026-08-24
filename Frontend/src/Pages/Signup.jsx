import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { Headphones, Eye, EyeOff } from "lucide-react";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signup(name, email, password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 md:px-6 py-8 md:py-12">
      <div
        className="w-full max-w-md rounded-3xl p-6 md:p-8"
        style={{
          background: "#111318",
          border: "1px solid rgba(255,255,255,0.06)",
          boxShadow: "0 24px 64px rgba(0,0,0,0.3)",
        }}
      >
        <div className="flex flex-col items-center mb-6 md:mb-8">
          <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-[#5FD0B3] flex items-center justify-center mb-4">
            <Headphones className="w-6 h-6 md:w-7 md:h-7 text-[#080D12]" />
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-white">Create account</h1>
          <p className="text-sm text-[#9CA3AF] mt-1">Start your vibe journey</p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#9CA3AF] mb-1.5">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl bg-[#15171E] border border-white/[0.06] text-sm text-white placeholder-[#5C6370] outline-none focus:border-[#5FD0B3]/40 transition-all"
              placeholder="Your name"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#9CA3AF] mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl bg-[#15171E] border border-white/[0.06] text-sm text-white placeholder-[#5C6370] outline-none focus:border-[#5FD0B3]/40 transition-all"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#9CA3AF] mb-1.5">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 pr-10 rounded-xl bg-[#15171E] border border-white/[0.06] text-sm text-white placeholder-[#5C6370] outline-none focus:border-[#5FD0B3]/40 transition-all"
                placeholder="Create password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5C6370] hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl text-sm font-semibold bg-[#5FD0B3] text-[#080D12] hover:brightness-110 active:scale-[0.98] transition-all duration-150 disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>

        <p className="text-center text-sm text-[#9CA3AF] mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-[#5FD0B3] hover:underline font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
