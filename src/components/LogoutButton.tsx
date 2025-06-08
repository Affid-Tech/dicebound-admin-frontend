import { useNavigate } from "react-router-dom";
import { clearBasicAuth } from "../api/fetchWithAuth";

export default function LogoutButton() {
    const navigate = useNavigate();
    const handleLogout = () => {
        clearBasicAuth();
        navigate("/login");
    };
    return <button onClick={handleLogout}>Выйти</button>;
}
