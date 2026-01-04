import React, { useEffect, useState } from "react";
import { auth, db } from "../auth/Firebase";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  doc,
  getDoc,
} from "firebase/firestore";
import { IoSearch, IoEye } from "react-icons/io5";
import RiwayatAdmin from "./admin/RiwayatAdmin";

const Riwayat = () => {
  const [role, setRole] = useState(null);

  useEffect(() => {
    const fetchRole = async () => {
      const r = await getUserRole();
      setRole(r);
    };
    fetchRole();
  }, []);
  

  const getUserRole = async () => {
    const user = auth.currentUser;
    if (!user) return null;

    const ref = doc(db, "users", user.uid);
    const snap = await getDoc(ref);

    if (snap.exists()) {
      return snap.data().role;
    }
    return null;
  };
  return (
    <div className="">
      {role === "Admin" ? (
       <RiwayatAdmin/>
      ) : (
        <div className="">Lol</div>
      )}
    </div>
  );
};

export default Riwayat;
