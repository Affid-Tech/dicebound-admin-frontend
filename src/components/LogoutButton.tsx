import { useNavigate } from "react-router-dom";
import { clearBasicAuth } from "../api/fetchWithAuth";

export default function LogoutButton({ onLogout }: Readonly<{ onLogout?: () => void }>) {
    const navigate = useNavigate();
    const handleLogout = () => {
        clearBasicAuth();
        if (onLogout) onLogout();
        navigate("/login");
    };
    return <button onClick={handleLogout}>Выйти</button>;
}