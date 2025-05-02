"use client";
import Navbar from "@/components/Navbar";
import { myAppHook } from "@/context/AppUtils";
import { FaRegUserCircle } from "react-icons/fa";
import { MdOutlineAlternateEmail } from "react-icons/md";
import { FaPhoneAlt } from "react-icons/fa";
import { BsGenderFemale } from "react-icons/bs";

export default function Profile() {
  const { userProfile } = myAppHook();
  return (
    <>
      <Navbar />
      {userProfile ? (
        <div className="container mt-5">
          <h2>Perfil del Usuario</h2>
          <div className="card p-4 shadow-sm">
            <p>
              <strong>
                <FaRegUserCircle size={30} style={{ marginRight: "5px" }} />
              </strong>{" "}
              {userProfile?.name}
            </p>
            <p>
              <strong>
                <MdOutlineAlternateEmail
                  size={30}
                  style={{ marginRight: "5px" }}
                />
              </strong>
              {userProfile?.email}
            </p>
            <p>
              <strong>
                <FaPhoneAlt size={20} style={{ marginRight: "10px" }} />
              </strong>{" "}
              {userProfile?.phone}
            </p>
            <p>
              <strong>
                <BsGenderFemale size={25} style={{ marginRight: "5px" }} />
              </strong>{" "}
              {userProfile?.gender}
            </p>
          </div>
        </div>
      ) : (
        <p>No se encontro un perfil</p>
      )}
    </>
  );
}
