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
            padding: "0",
            borderBottom: "3px solid #28D8C4",
            borderRadius: 0,
            position: "fixed",
            display: "flex",
            justifyContent: "space-between",
            left: 0,
            top: 0,
            width: "100vw",
            height: 64,
            zIndex: 100,
            boxShadow: "0 2px 12px 0 #0C081522",
        }}>
            <div style={{
                display: "flex",
                gap: 24,
                fontWeight: 600,
                alignItems: "center",
                margin: "12px 32px",
            }}>
                <NavLink to="/" style={{color: "#28D8C4", textDecoration: "none", fontSize: 22, fontWeight: 700}}>
                    🏠 Главная
                </NavLink>
                <NavLink to="/users" style={{
                    color: "#fff",
                    fontWeight: 600,
                }}>Пользователи</NavLink>
                <NavLink to="/adventures" style={{color: "#fff"}}>Приключения</NavLink>
                <NavLink to="/currency-rates" style={{color: "#fff"}}>Курсы валют</NavLink>
            </div>

            <div style={{
                margin: "12px 32px",}}>
                <LogoutButton onLogout={handleLogout}/>
            </div>
        </nav>
    );
}
