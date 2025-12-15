import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db, auth } from "../auth/Firebase";

import BerandaUser from "./user/BerandaUser";
import BerandaAdmin from "./admin/BerandaAdmin";

const Beranda = () => {
  const [userData, setUserData] = useState({ name: "", role: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));

          if (userDoc.exists()) {
            const data = userDoc.data();

            setUserData({
              name: data.name || user.email,
              role: data.role || "User",
            });
          } else {
            // fallback jika tidak ada di firestore
            setUserData({
              name: user.email,
              role: "User",
            });
          }
        } catch (error) {
          console.log("Error mengambil data user:", error);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1 className="heading">Beranda</h1>
      {userData.role === "Admin" && <BerandaAdmin />}
      {userData.role === "User" && <BerandaUser />}
    </div>
  );
};

export default Beranda;
