import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";
import Footer from "../components/layout/Footer";

function MainLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-6">{children}</main>
      </div>

      <Footer />
    </div>
  );
}

export default MainLayout;
