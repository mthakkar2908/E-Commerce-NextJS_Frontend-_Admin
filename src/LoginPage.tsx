/* eslint-disable react-hooks/exhaustive-deps */

"use client";

import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "./redux/hooks";
import { clearError, loginThunk } from "./redux/slices/authSlice";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();
  const dispatch = useAppDispatch();
  const { loading, error, isAuthenticated, user } = useAppSelector(
    (state) => state.auth,
  );

  // const redirectDashboard = async () => {
  //   if (isAuthenticated && user) {
  //     setRedirectLogin(true);
  //     console.log("Authenticated", isAuthenticated);
  //     await router.push("/dashboard");
  //     setRedirectLogin(false);
  //   }
  // };
  useEffect(() => {
    if (isAuthenticated && user) {
      console.log(user);
      router.replace("/dashboard");
    }
  }, [isAuthenticated, user]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      return;
    }

    const result = await dispatch(loginThunk({ email, password }));

    if (loginThunk.fulfilled.match(result)) {
      console.log("Login successful:", result.payload);
    } else if (loginThunk.rejected.match(result)) {
      console.error("Login failed:", result.payload);
    }
  };
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="mx-10 my-10 bg-amber-100 text-[#000000] w-150 h-auto rounded-lg shadow-lg p-8">
        <div className="flex justify-center mb-8">
          <h2 className="text-3xl font-bold">Admin Login</h2>
        </div>

        {error && (
          <div className="mb-5 p-3 bg-red-200 text-red-700 rounded-lg flex justify-between items-center">
            <span>{error}</span>
            <button
              onClick={() => dispatch(clearError())}
              className="text-red-700 hover:text-red-900 font-bold"
            >
              ×
            </button>
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="flex flex-col mx-5 my-5">
            <label htmlFor="email" className="font-semibold mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border-2 border-black rounded-xl h-10 mt-1 text-lg px-2 focus:outline-none focus:border-blue-500"
              placeholder="Enter your email"
              disabled={loading}
            />
          </div>
          <div className="flex flex-col mx-5 my-5">
            <label htmlFor="password" className="font-semibold mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border-2 w-full border-black rounded-xl h-10 mt-1 text-lg px-2 pr-10 focus:outline-none focus:border-blue-500"
                placeholder="Enter your password"
                disabled={loading}
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute cursor-pointer right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800"
                disabled={loading}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="flex justify-center my-8">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-bold py-2 px-8 rounded-lg transition duration-200"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
