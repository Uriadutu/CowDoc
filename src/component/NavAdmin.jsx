import React, { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../auth/Firebase";

import { FaUser } from "react-icons/fa";
const NavAdmin = () => {
    const [userData, setUserData] = useState({ name: "", role: "" });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Ambil data tambahan dari Firestore
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setUserData({
            name: userDoc.data().nama || "Pengguna",
            role: userDoc.data().role || "User",
          });
        } else {
          setUserData({ name: user.email, role: "User" });
        }
      }
    });

    return () => unsubscribe();
  }, []);


  return (
    <div className="w-full sm:pl-64 absolute top-0 p-2 py-3">
      <div className="flex justify-end">
        <div className="flex items-center gap-4">
          <div className="text-end">
            <p className="text-sm">{userData.name}</p>
            <p className="text-sm">{userData.role}</p>
          </div>
          <div className="rounded-full bg-gray-200 p-3">
            <FaUser />
          </div>
        </div>
      </div>
      <div className="border-b  pt-[10px] border-gray-300"></div>
    </div>
  );
};

export default NavAdmin;
