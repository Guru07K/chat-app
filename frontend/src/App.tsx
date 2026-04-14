import ChatPage from "./pages/ChatPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import { useAuthStore } from "./store/AuthStore";
import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import Loader from "./components/Loader";
import toast, { Toaster } from "react-hot-toast";
import { getFcmToken } from "./service/getFcmToken";
import ChatContainer from "./components/ChatContainer";
import { ProtectedRoute } from "./components/ProtectedRoute";

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
    // <div className="min-h-screen w-screen bg-slate-900 relative flex items-center justify-center p-0 md:p-4 overflow-hidden">
    <div className="min-h-dvh w-screen bg-slate-900 relative flex items-center justify-center p-0 md:p-4">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-size-[14px_24px]" />
      <div className="absolute top-0 -left-4 size-96 bg-pink-800 opacity-20 blur-[100px]" />
      <div className="absolute bottom-0 -right-4 size-96 bg-cyan-500 opacity-20 blur-[100px]" />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route element={<ProtectedRoute />}>
          <Route index element={<ChatPage />} />
          <Route path="/chat/:user_id" element={<ChatPage />} />
        </Route>
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
