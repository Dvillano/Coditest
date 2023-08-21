import "./globals.css";
import { AuthUserProvider } from "./firebase/firebaseAuth";
import Navbar from "./components/navbar/Navbar";
import { Toaster } from "react-hot-toast";

export const metadata = {
    title: "Coditest",
    description: "Sistema de asistencia de reclutamiento y seleccion",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>
                <AuthUserProvider>
                    <Navbar />
                    {children}
                </AuthUserProvider>
                <Toaster />
            </body>
        </html>
    );
}
