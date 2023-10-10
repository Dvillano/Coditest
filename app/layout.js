import "./globals.css";
import { AuthUserProvider } from "./firebase/useFirebaseAuth";
import Navbar from "./components/UserInterface/Navbar";
import { Toaster } from "react-hot-toast";

export const metadata = {
    title: "Coditest",
    description: "Sistema de asistencia de reclutamiento y seleccion",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className="bg-gray-200">
                <AuthUserProvider>
                    <Navbar />
                    {children}
                </AuthUserProvider>
                <Toaster />
            </body>
        </html>
    );
}
