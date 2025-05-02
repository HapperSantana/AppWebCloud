"use client";
import Link from "next/link";
import { myAppHook } from "@/context/AppUtils";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { CiHome } from "react-icons/ci";
import { CiLogin } from "react-icons/ci";
import { CiLogout } from "react-icons/ci";
import { CiUser } from "react-icons/ci";
import { RxDashboard } from "react-icons/rx";

const Navbar = () => {
  const { isLoggedIn, setIsLoggedIn, setAuthToken } = myAppHook();
  const router = useRouter();
  const handleUserLogout = async () => {
    localStorage.removeItem("access_token");
    setIsLoggedIn(false);
    setAuthToken(null);
    await supabase.auth.signOut();
    toast.success("El usuario ha cerrado su sesion");
    router.push("/auth/login");
  };

  return (
    <>
      <nav
        className="navbar navbar-expand-lg px-4"
        style={{ backgroundColor: "#343a40" }}
      >
        <Link className="navbar-brand fw-bold text-white" href="/">
          AppWebCloud
        </Link>
        {isLoggedIn ? (
          <div className="ms-auto">
            <Link
              className="me-3 text-white text-decoration-none"
              href="/auth/dashboard"
              style={{ marginRight: "10px" }}
            >
              <RxDashboard size={30} />
            </Link>
            <Link
              className="me-3 text-white text-decoration-none"
              href="/auth/profile"
              style={{ marginRight: "10px" }}
            >
              <CiUser size={30} />
            </Link>
            <button className="btn btn-danger" onClick={handleUserLogout}>
              <CiLogout size={30} />
            </button>
          </div>
        ) : (
          <div className="ms-auto">
            <Link
              className="text-white text-decoration-none"
              href="/"
              style={{ marginRight: "10px" }}
            >
              <CiHome size={30} />
            </Link>

            <Link
              className="text-white text-decoration-none"
              href="/auth/login"
            >
              <CiLogin size={30} />
            </Link>

            {/* <Link
              className="text-white text-decoration-none"
              href="/auth/login"
            >
              Ingresar
            </Link> */}
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
