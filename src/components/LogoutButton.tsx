import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { clearBasicAuth } from "../api/fetchWithAuth";

export default function LogoutButton({ onLogout }: Readonly<{ onLogout?: () => void }>) {
    const navigate = useNavigate();
    const handleLogout = () => {
        clearBasicAuth();
        if (onLogout) onLogout();
        navigate("/login");
    };
    return (
        <Button
            onClick={handleLogout}
            variant="outlined"
            color="primary"
            startIcon={<LogoutIcon />}
            sx={{
                borderColor: "accentTurquoise.main",
                color: "accentTurquoise.main",
                fontWeight: 600,
                textTransform: "none",
                letterSpacing: 0.2,
                px: 2,
                py: 1,
                bgcolor: "transparent",
                '&:hover': {
                    backgroundColor: "rgba(40,216,196,0.08)",
                    borderColor: "accentTurquoise.main",
                }
            }}
        >
            Выйти
        </Button>
    );
}
