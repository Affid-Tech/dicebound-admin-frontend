import {NavLink} from "react-router-dom";
import LogoutButton from "./LogoutButton.tsx";

interface NavigationBarProps {
    handleLogout?: () => void
}

export default function NavigationBar({handleLogout}: Readonly<NavigationBarProps>) {
    return (
        <nav style={{
            background: "#1B1033",
            color: "#fff",
            padding: "12px 32px",
            marginBottom: 30,
            borderRadius: 16,
            display: "flex",
            gap: 24,
            fontWeight: 600,
            alignItems: "center",
        }}>
            <NavLink to="/" style={{color: "#28D8C4", textDecoration: "none"}}>🏠 Главная</NavLink>
            <NavLink to="/users" style={{color: "#fff"}}>Пользователи</NavLink>
            <NavLink to="/adventures" style={{color: "#fff"}}>Приключения</NavLink>
            <NavLink to="/currency-rates" style={{color: "#fff"}}>Курсы валют</NavLink>
            {/* и т.д. */}
            <LogoutButton onLogout={handleLogout}/>
        </nav>
    );
}
