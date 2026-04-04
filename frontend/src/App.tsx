import ChatPage from "./pages/ChatPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import { useAuthStore } from "./store/AuthStore";
import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import Loader from "./components/Loader";
import toast, { Toaster } from "react-hot-toast";

function App() {
  const { isLoading, success, error, isLoggedIn, ClearMessage, ChechAuth } =
    useAuthStore();

  useEffect(() => {
    ChechAuth();
  }, []);

  // Toast
  useEffect(() => {
    if (success) toast.success(success, { duration: 5000 });
    else if (error) toast.error(error, { duration: 5000 });

    ClearMessage();
  }, [success, error]);

  if (isLoading) return <Loader />;

  return (
    <div className="min-h-screen bg-slate-900 relative flex items-center justify-center p-4 overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px), linear-gradient(to_bottom,#4f4f4f2e_1px, transparent_1px)] bg-size-[14px_24px]" />
      <div className="absolute top-0 -left-4 size-96 bg-pink-800 opacity-20 blur-[100px]" />
      <div className="absolute bottom-0 -right-4 size-96 bg-cyan-500 opacity-20 blur-[100px]" />

      <Routes>
        <Route path="/" element={!isLoggedIn ? <LoginPage /> : <ChatPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
      </Routes>

      <Toaster />
    </div>
  );
}

export default App;
