"use client";
import Navbar from "@/components/Navbar";
import { supabase } from "@/lib/supabaseClient";
import toast from "react-hot-toast";
import { useEffect } from "react";
import { myAppHook } from "@/context/AppUtils";
import { useRouter } from "next/navigation";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { BsGithub } from "react-icons/bs";
import { FcGoogle } from "react-icons/fc";

const formSchema = yup.object().shape({
  email: yup
    .string()
    .required("El email es requerido")
    .email("El email no es valido"),
  password: yup.string().required("La contraseña es requerida"),
});

export default function Login() {
  const router = useRouter();
  const { isLoggedIn, setIsLoggedIn, setAuthToken, setIsLoading } = myAppHook();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm({
    resolver: yupResolver(formSchema),
  });

  useEffect(() => {
    if (isLoggedIn) {
      router.push("/auth/dashboard");
    }
  }, [isLoggedIn]);

  const handleSocialOauth = async (provider: "google" | "github") => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/auth/dashboard` },
    });
    if (error) {
      toast.error("Fallo al intentar iniciar sesion con Oauth");
    }
  };

  const onSubmit = async (formdata: any) => {
    setIsLoading(true);

    const { email, password } = formdata;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setIsLoading(false);
      toast.error("Los datos son incorrectos");
    } else {
      if (data.session?.access_token) {
        setAuthToken(data.session?.access_token);
        localStorage.setItem("access_token", data.session?.access_token);
        setIsLoggedIn(true);
        setIsLoading(false);
        toast.success("El usuario inicio sesion con exito");
      }
    }
  };

  const handleRegisterRedirect = () => {
    router.push("/auth/register");
  };

  return (
    <>
      <Navbar />
      <div className="container mt-5">
        <h2 className="text-center">Iniciar Sesion</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="w-50 mx-auto mt-3">
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              {...register("email")}
            />
            <p className="text-danger"> {errors.email?.message}</p>
          </div>

          <div className="mb-3">
            <label className="form-label">Contraseña</label>
            <input
              type="password"
              className="form-control"
              {...register("password")}
            />
            <p className="text-danger">{errors.password?.message}</p>
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Ingresar
          </button>
        </form>

        <div className="text-center mt-3">
          <button
            className="btn btn-outline-secondary mx-2"
            onClick={() => handleSocialOauth("google")}
          >
            <FcGoogle size={25} style={{ marginRight: "5px" }} />
            <span>Google</span>
          </button>
          <button
            className="btn btn-dark mx-2"
            onClick={() => handleSocialOauth("github")}
          >
            <BsGithub size={25} style={{ marginRight: "5px" }} />
            <span>GitHub</span>
          </button>
        </div>

        <p className="text-center mt-3">
          Aun no tienes una cuenta?{" "}
          <a
            onClick={handleRegisterRedirect}
            style={{ cursor: "pointer", color: "dodgerblue" }}
          >
            Registrarme
          </a>
        </p>
      </div>
    </>
  );
}
