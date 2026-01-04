import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/userPage/HomePage";
import Splash from "./component/user/Splash";
import Login from "./component/Login";
import HasilPerhitunganPage from "./pages/userPage/HasilPerhitunganPage";
import ProtectedRoute from "./ProtectedRoute";
import CobaPerhitunganPage from "./pages/CobaPerhitunganPage";
import HasilCobaPerhitunganPage from "./pages/HasilCobaPerhitunganPage";
import Regis from "./component/Regis";
import BerandaPage from "./pages/BerandaPage";
import DiagnosaPage from "./pages/DiagnosaPage";
import RiwayatPage from "./pages/RiwayatPage";
import BantuanPage from "./pages/BantuanPage";
import DataPenyakitPage from "./pages/DataPenyakitPage";
import DataGejalaPage from "./pages/DataGejalaPage";
import RekomendasiPengobatanPage from "./pages/RekomendasiPengobatanPage";
import BasisAturanPage from "./pages/BasisAturanPage";
import HasilDIagnosaPage from "./pages/HasilDIagnosaPage";
import RiwayatPeruserPage from "./pages/RiwayatPeruserPage";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Splash />} />
        <Route path="/masuk" element={<Login />} />
        <Route path="/daftar" element={<Regis />} />

        {/* <Route path="/kelola" element={<KelolaDataPage />} /> */}
        <Route path="/home" element={<HomePage />} />
        {/* Protected routes */}
        <Route
          path="/beranda"
          element={
            <ProtectedRoute>
              <BerandaPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/diagnosis"
          element={
            <ProtectedRoute>
              <DiagnosaPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/riwayat-diagnosis"
          element={
            <ProtectedRoute>
              <RiwayatPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/riwayat-diagnosis/:id/:nama"
          element={
            <ProtectedRoute>
              <RiwayatPeruserPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/riwayat-diagnosis"
          element={
            <ProtectedRoute>
              <RiwayatPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/bantuan"
          element={
            <ProtectedRoute>
              <BantuanPage />
            </ProtectedRoute>
          }
        />

        {/* Admin */}
        <Route
          path="/data-penyakit"
          element={
            <ProtectedRoute>
              <DataPenyakitPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/data-gejala"
          element={
            <ProtectedRoute>
              <DataGejalaPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hasil-diagnosa"
          element={
            <ProtectedRoute>
              <HasilDIagnosaPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/rekomendasi-pengobatan"
          element={
            <ProtectedRoute>
              <RekomendasiPengobatanPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/basis-aturan"
          element={
            <ProtectedRoute>
              <BasisAturanPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
