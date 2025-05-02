"use client";

import Navbar from "@/components/Navbar";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { supabase } from "@/lib/supabaseClient";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { myAppHook } from "@/context/AppUtils";

const formSchema = yup.object().shape({
  fullName: yup.string().required("Nombre completo es requerido"),
  email: yup.string().required("Email es requerido"),
  phone: yup.string().required("El telefono es requerido"),
  gender: yup
    .string()
    .required("El genero es requerido")
    .oneOf(["Masculino", "Femenino", "Otro"], "El genero no es valido"),
  password: yup
    .string()
    .required("La contraseña es requerida")
    .min(6, "La contraseña debe ser minimo de 6 caracteres"),
  confirm_password: yup
    .string()
    .required("La constreña de confirmacion es requerida")
    .oneOf([yup.ref("password")], "La contraseña no coincide"),
});

export default function Register() {
  const router = useRouter();
  const { setIsLoading } = myAppHook();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(formSchema),
  });

  const onSubmit = async (formdata: any) => {
    //console.log(formdata);
    setIsLoading(true);
    const { fullName, email, password, gender, phone } = formdata;
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          fullName,
          gender,
          phone,
        },
      },
    });
    if (error) {
      toast.error("No se pudo registrar el usuario.");
    } else {
      toast.success("El usuario se creo con exito.");
      setIsLoading(false);
      router.push("/auth/login");
    }
  };

  const handleLoginRedirect = () => {
    router.push("/auth/login");
  };

  return (
    <>
      <Navbar />
      <div className="container mt-5">
        <h2 className="text-center">Registrarme</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="w-50 mx-auto mt-3">
          <div className="row mb-3">
            <div className="col-md-6">
              <label className="form-label">Nombre</label>
              <input
                type="text"
                className="form-control"
                {...register("fullName")}
              />
              <p className="text-danger">{errors.fullName?.message}</p>
            </div>
            <div className="col-md-6">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                {...register("email")}
              />
              <p className="text-danger">{errors.email?.message}</p>
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-6">
              <label className="form-label">Telefono</label>
              <input
                type="text"
                className="form-control"
                {...register("phone")}
              />
              <p className="text-danger">{errors.phone?.message}</p>
            </div>
            <div className="col-md-6">
              <label className="form-label">Genero</label>
              <select className="form-control" {...register("gender")}>
                <option value="Masculino">Masculino</option>
                <option value="Femenino">Femenino</option>
                <option value="Otro">Otro</option>
              </select>
              <p className="text-danger">{errors.gender?.message}</p>
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-6">
              <label className="form-label">Contrasena</label>
              <input
                type="password"
                className="form-control"
                {...register("password")}
              />
              <p className="text-danger">{errors.password?.message}</p>
            </div>
            <div className="col-md-6">
              <label className="form-label">Confirmar Contrasena</label>
              <input
                type="password"
                className="form-control"
                {...register("confirm_password")}
              />
              <p className="text-danger">{errors.confirm_password?.message}</p>
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Registrar
          </button>
        </form>

        <p className="text-center mt-3">
          Ya tienes una cuenta?{" "}
          <a
            onClick={handleLoginRedirect}
            style={{ cursor: "pointer", color: "dodgerblue" }}
          >
            Iniciar Sesion
          </a>
        </p>
      </div>
    </>
  );
}
