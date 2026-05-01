import ChatPage from "./pages/ChatPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import { useAuthStore } from "./store/AuthStore";
import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import Loader from "./components/Loader";
import toast, { Toaster } from "react-hot-toast";
import { ProtectedRoute } from "./components/ProtectedRoute";

function App() {
  const { isLoading, success, error, ClearMessage, ChechAuth } = useAuthStore();

  useEffect(() => {
    ChechAuth();
  }, []);

  useEffect(() => {
    if (success) toast.success(success, { duration: 5000 });
    else if (error) toast.error(error, { duration: 5000 });
    ClearMessage();
  }, [success, error]);

  if (isLoading) return <Loader />;

  return (
    <div className="h-svh w-screen relative flex items-center justify-center overflow-hidden"
      style={{ background: "#111b21" }}
    >
      {/* Layered background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Top-left teal glow */}
        <div
          className="absolute -top-32 -left-32 w-125 h-125 rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(0,167,131,0.18) 0%, transparent 70%)",
          }}
        />
        {/* Bottom-right blue glow */}
        <div
          className="absolute -bottom-32 -right-32 w-125 h-125 rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(0,100,200,0.13) 0%, transparent 70%)",
          }}
        />
        {/* Center subtle glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-175 h-100 rounded-full"
          style={{
            background: "radial-gradient(ellipse, rgba(0,167,131,0.05) 0%, transparent 70%)",
          }}
        />
        {/* WhatsApp-style diagonal stripe pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `repeating-linear-gradient(
              45deg,
              #ffffff 0px,
              #ffffff 1px,
              transparent 1px,
              transparent 20px
            )`,
          }}
        />
      </div>

      {/* App shell */}
      <div
        className="relative w-full max-w-5xl h-full md:h-[92vh] flex rounded-none md:rounded-2xl overflow-hidden"
        style={{
          boxShadow: "0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)",
        }}
      >
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route element={<ProtectedRoute />}>
            <Route index element={<ChatPage />} />
            <Route path="/chat/:user_id" element={<ChatPage />} />
          </Route>
        </Routes>
      </div>

      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "#1f2c34",
            color: "#e9edef",
            border: "1px solid #2a3942",
            borderRadius: "10px",
            fontSize: "14px",
          },
        }}
      />
    </div>
  );
}

export default App;