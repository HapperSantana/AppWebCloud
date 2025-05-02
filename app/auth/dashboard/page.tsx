/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */

"use client";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { myAppHook } from "@/context/AppUtils";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Swal from "sweetalert2";
import { FaRegEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";

interface ProductType {
  id?: number;
  nombre: string;
  descripcion?: string;
  precio?: string;
  imagen?: string | File | null;
}

const formSchema = yup.object().shape({
  nombre: yup.string().required("El nombre del producto es requerido"),
  descripcion: yup.string().required("La descripcion es requerida"),
  precio: yup.string().required("Se requiere el precio del producto"),
});

export default function Dashboard() {
  const [previewImage, setPreviewImage] = useState<null>(null);
  const [products, setProducts] = useState<ProductType | null>(null);
  const [userId, setUserId] = useState<null>(null);
  const [editId, setEditId] = useState(null);

  const {
    setAuthToken,
    setIsLoggedIn,
    isLoggedIn,
    setUserProfile,
    setIsLoading,
  } = myAppHook();
  const router = useRouter();

  const {
    register,
    reset,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(formSchema),
  });

  useEffect(() => {
    const handleLoginSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        toast.error("Fallo al obtener los datos de usuario");
        router.push("/auth/login");
        return;
      }
      setIsLoading(true);
      if (data.session?.access_token) {
        // @ts-ignore
        setAuthToken(data.session?.access_token);
        // @ts-ignore
        setUserId(data.session?.user.id);
        localStorage.setItem("access_token", data.session?.access_token);
        setIsLoggedIn(true);
        // @ts-ignore
        setUserProfile({
          name: data.session.user?.user_metadata.fullName,
          email: data.session.user?.user_metadata.email,
          gender: data.session.user?.user_metadata.gender,
          phone: data.session.user?.user_metadata.phone,
        });
        //toast.success("El usuario inicio sesion con exito");
        localStorage.setItem(
          "user_profile",
          JSON.stringify({
            name: data.session.user?.user_metadata.fullName,
            email: data.session.user?.user_metadata.email,
            gender: data.session.user?.user_metadata.gender,
            phone: data.session.user?.user_metadata.phone,
          })
        );
        fetchProductsFromTable(data.session.user.id);
      }
      setIsLoading(false);
    };

    handleLoginSession();
    if (!isLoggedIn) {
      router.push("/auth/login");
      return;
    }
  }, []);

  const uploadImageFile = async (file: File) => {
    const fileExtension = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExtension}`;

    const { data, error } = await supabase.storage
      .from("imagenes")
      .upload(fileName, file);
    if (error) {
      toast.error("No se pudo cargar el archivo");
      return null;
    }
    return supabase.storage.from("imagenes").getPublicUrl(fileName).data
      .publicUrl;
  };

  const onFormSubmit = async (formData: any) => {
    setIsLoading(true);
    let imagePath = formData.imagen;
    if (formData.imagen instanceof File) {
      imagePath = await uploadImageFile(formData.imagen);
      if (!imagePath) return;
    }

    if (editId) {
      const { data, error } = await supabase
        .from("productos")
        .update({
          ...formData,
          imagen: imagePath,
        })
        .match({
          id: editId,
          user_id: userId,
        });
      if (error) {
        toast.error("No se pudo actualizar el producto.");
      } else {
        toast.success("El producto se actualizo con exito.");
      }
    } else {
      const { data, error } = await supabase.from("productos").insert({
        ...formData,
        user_id: userId,
        imagen: imagePath,
      });
      if (error) {
        toast.error("No se puedo agregar el producto.");
      } else {
        toast.success("El producto se agrego con exito.");
      }
      reset();
    }

    setPreviewImage(null);
    fetchProductsFromTable(userId!);
    setIsLoading(false);
  };

  const fetchProductsFromTable = async (userId: string) => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("productos")
      .select("*")
      .eq("user_id", userId);

    if (data) {
      // @ts-ignore
      setProducts(data);
    }
    setIsLoading(false);
  };

  const handleEditData = (product: ProductType) => {
    setValue("nombre", product.nombre);
    // @ts-ignore
    setValue("descripcion", product.descripcion);
    // @ts-ignore
    setValue("precio", product.precio);
    // @ts-ignore
    setValue("imagen", product.imagen);
    // @ts-ignore
    setPreviewImage(product.imagen);
    // @ts-ignore
    setEditId(product.id!);
  };

  const handleDeleteProduct = (id: number) => {
    Swal.fire({
      title: "Deseas eliminar el producto?",
      text: "La accion no se podra revertir",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "SI, borralo!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const { data, error } = await supabase
          .from("documentos")
          .delete()
          .match({
            id: id,
            user_id: userId,
          });
        if (error) {
          toast.error("No se pudo eliminar el producto.");
        } else {
          Swal.fire({
            title: "Eliminado",
            text: "El producto se ha eliminado.",
            icon: "success",
          });
          fetchProductsFromTable(userId!);
        }
      }
    });
  };

  return (
    <>
      <Navbar />
      <div className="container mt-5">
        <div className="row">
          <div className="col-md-4">
            <h3>{editId ? "Editar el Producto" : "Alta de Productos"}</h3>
            <form onSubmit={handleSubmit(onFormSubmit)}>
              <div className="mb-3">
                <label className="form-label">Nombre del producto</label>
                <input
                  type="text"
                  className="form-control"
                  {...register("nombre")}
                />
                <small className="text-danger">{errors.nombre?.message}</small>
              </div>
              <div className="mb-3">
                <label className="form-label">Descripcion</label>
                <textarea
                  className="form-control"
                  {...register("descripcion")}
                ></textarea>
                <small className="text-danger">
                  {errors.descripcion?.message}
                </small>
              </div>
              <div className="mb-3">
                <label className="form-label">Precio</label>
                <input
                  type="number"
                  className="form-control"
                  {...register("precio")}
                />
                <small className="text-danger">{errors.precio?.message}</small>
              </div>
              <div className="mb-3">
                <label className="form-label">Imagen</label>
                <div className="mb-2">
                  {previewImage ? (
                    <Image
                      src={previewImage}
                      alt="Preview"
                      id="bannerPreview"
                      width="100"
                      height="100"
                    />
                  ) : (
                    ""
                  )}
                </div>
                <input
                  type="file"
                  className="form-control"
                  onChange={(event) => {
                    // @ts-ignore
                    setValue("imagen", event.target.files[0]);
                    // @ts-ignore
                    setPreviewImage(URL.createObjectURL(event.target.files[0]));
                  }}
                />
                <small className="text-danger"></small>
              </div>

              <button type="submit" className="btn btn-success w-100">
                {editId ? "Actualizar" : "Agregar"}
              </button>
            </form>
          </div>

          <div className="col-md-8">
            <h3>Productos</h3>
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Descripcion</th>
                  <th>Precio</th>
                  <th>Imagen</th>
                  <th>Accion</th>
                </tr>
              </thead>
              <tbody>
                {products ? (
                  // @ts-ignore
                  products.map((singleProduct, index) => (
                    <tr key={index}>
                      <td>{singleProduct.nombre}</td>
                      <td>{singleProduct.descripcion}</td>
                      <td>{singleProduct.precio}</td>
                      <td>
                        {singleProduct.imagen ? (
                          <Image
                            src={singleProduct.imagen}
                            alt="imagen-producto"
                            width={50}
                            height={50}
                          />
                        ) : (
                          "--"
                        )}
                      </td>
                      <td>
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => handleEditData(singleProduct)}
                          style={{ fontSize: "12px" }}
                        >
                          <FaRegEdit size={20} />
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDeleteProduct(singleProduct.id!)}
                          style={{ marginLeft: "5px", fontSize: "12px" }}
                        >
                          <MdDeleteForever size={20} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center">
                      No hay productos todavia.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
