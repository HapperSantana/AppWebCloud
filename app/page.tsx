"use client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import supabaseLogo from "../public/Supabase_Logo2.png";
import bootstrapLogo from "../public/bootstrap-logo-vector.png";
import googleGithubLogo from "../public/google-github.jpg";
import renderLogo from "@/public/portfolio-render-updated.png";
import vscodeLogo from "@/public/vs-code-logo.png";
import nextjsLogo from "@/public/next-js-logo.png";
import { useRouter } from "next/navigation";
import { CiLogin } from "react-icons/ci";

export default function Home() {
  const router = useRouter();
  const handleLoginRedirect = () => {
    router.push("/auth/login");
  };
  return (
    <>
      <Navbar />

      <div className="container text-center py-5">
        <header className="mb-5">
          <h1 className="display-4 fw-bold">Producto Integrador</h1>
          <p className="lead">
            Aplicación web dinámica en un servicio de la nube
          </p>
          <button
            className="btn btn-primary btn-lg"
            onClick={handleLoginRedirect}
          >
            Ingresar <CiLogin size={30} />
          </button>
        </header>

        <section className="row g-4">
          <div className="col-md-4">
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="card-title">Base de Datos Supabase</h5>
                <p className="card-text">
                  BD Postgres, la alternativa open source de firebase, rapida y
                  segura.
                </p>

                <Image src={supabaseLogo} alt="" height={50} width={195} />
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="card-title">Interfaz de usuario Responsiva</h5>
                <p className="card-text">
                  El framework responsivo mas popular para sitios HTML, CSS y
                  JavaScript.
                </p>
                <Image src={bootstrapLogo} alt="" height={50} width={167} />
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="card-title">Integracion de servicios Cloud</h5>
                <p className="card-text">
                  Autenticacion de usuarios con token de acceso y codigo de
                  verificacion.
                </p>
                <Image src={googleGithubLogo} alt="" height={50} width={130} />
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="card-title">Render</h5>
                <p className="card-text">
                  Crea, implementa y escala tus aplicaciones con una facilidad
                  inigualableS.
                </p>
                <Image src={renderLogo} alt="" height={45} width={180} />
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="card-title">Visual Studio Code</h5>
                <p className="card-text">
                  Combina la simplicidad de un editor de código con lo que los
                  desarrolladores necesitan.
                </p>
                <Image src={vscodeLogo} alt="" height={45} width={180} />
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="card-title">Next JS</h5>
                <p className="card-text">
                  El framework de desarrollo front-end de React open source
                  creado por Vercel.
                </p>
                <Image src={nextjsLogo} alt="" height={45} width={180} />
              </div>
            </div>
          </div>
        </section>
      </div>
      {/* <Footer /> */}
    </>
  );
}
