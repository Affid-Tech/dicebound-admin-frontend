import { useEffect, useState } from "react";
import { UserService } from "../api/UserService";
import type { UserDto, UserRole } from "../types/user";
import { useNavigate } from "react-router-dom";

export default function UserList() {
    const [users, setUsers] = useState<UserDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [roleFilter, setRoleFilter] = useState<UserRole | "ALL">("ALL");
    const navigate = useNavigate();

    useEffect(() => {
        UserService.list()
            .then(setUsers)
            .catch((e) => setError(e.message))
            .finally(() => setLoading(false));
    }, []);

    const filteredUsers =
        roleFilter === "ALL"
            ? users
            : users.filter((u) => u.roles.includes(roleFilter));

    return (
        <div className="card">
            <h1>Пользователи</h1>

            <div style={{ marginBottom: 16 }}>
                <button onClick={() => navigate("/users/new")}>Создать пользователя</button>
                <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value as UserRole | "ALL")}
                    style={{ marginLeft: 16 }}
                >
                    <option value="ALL">Все роли</option>
                    <option value="PLAYER">PLAYER</option>
                    <option value="DUNGEON_MASTER">DUNGEON_MASTER</option>
                    <option value="ADMIN">ADMIN</option>
                </select>
            </div>

            {loading && <div>Загрузка...</div>}
            {error && <div style={{ color: "red" }}>{error}</div>}

            <table border={1} cellPadding={8} cellSpacing={0}>
                <thead>
                <tr>
                    <th>Имя</th>
                    <th>Email</th>
                    <th>Роли</th>
                    <th>ID</th>
                </tr>
                </thead>
                <tbody>
                {filteredUsers.map((u) => (
                    <tr key={u.id} onClick={() => navigate(`/users/${u.id}`)} style={{ cursor: "pointer" }}>
                        <td>{u.name}</td>
                        <td>{u.email}</td>
                        <td>{u.roles.join(", ")}</td>
                        <td>{u.id}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
