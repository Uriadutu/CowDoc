import React, { useState, useEffect } from "react";
import Navbar from "../component/Navbar";
import Sidebar from "../component/Sidebar";
import UbahSandiModal from "../component/modals/UbahSandiModal";
import { AnimatePresence } from "framer-motion";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../auth/Firebase";
import NavAdmin from "../component/NavAdmin";

const Layout = ({ children }) => {
  const [ubahSandiModal, setUbahSandiModal] = useState(false);
  const [userData, setUserData] = useState({ name: "", role: "" });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Ambil data tambahan dari Firestore
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setUserData({
            name: userDoc.data().name || "Pengguna",
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
    <React.Fragment>
      <div className="p-0 flex bg-[#FAFAFA]" style={{ minHeight: "100vh" }}>
        <AnimatePresence>
          {ubahSandiModal && (
            <UbahSandiModal onClose={() => setUbahSandiModal(false)} />
          )}
        </AnimatePresence>

        {/* Sidebar & Navbar */}
        <div className="">
          <div className="flex fixed z-10">
            <div className="flex">
              <Sidebar onUbahSandi={() => setUbahSandiModal(true)} />
            </div>
            <Navbar />
          </div>
        </div>

        {/* Konten utama */}
        <div className="flex-1">
          <main className="min-h-screen relative pt-20 sm:pt-20">
            <div className="">
             <NavAdmin/>
              <div className="px-1 sm:pl-72 sm:pr-8">
              {children}
              </div>

            </div>
          </main>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Layout;
