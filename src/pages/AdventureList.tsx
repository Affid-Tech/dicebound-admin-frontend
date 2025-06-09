import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdventureService } from "../api/AdventureService";
import type { AdventureDto } from "../types/adventure";

export default function AdventureList() {
    const [adventures, setAdventures] = useState<AdventureDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        AdventureService.list()
            .then(setAdventures)
            .catch(e => setError(e.message))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="card">
            <h1>Приключения</h1>
            <button style={{ marginBottom: 24 }} onClick={() => navigate("/adventures/new")}>
                Создать приключение
            </button>
            {loading && <div>Загрузка...</div>}
            {error && <div style={{ color: "red" }}>{error}</div>}
            <table style={{ width: "100%", marginTop: 12 }}>
                <thead>
                <tr>
                    <th>Название</th>
                    <th>Тип</th>
                    <th>Система</th>
                    <th>Мастер</th>
                    <th>Игроки</th>
                </tr>
                </thead>
                <tbody>
                {adventures.map(a => (
                    <tr key={a.id} style={{ cursor: "pointer" }} onClick={() => navigate(`/adventures/${a.id}`)}>
                        <td>{a.title}</td>
                        <td>{a.type}</td>
                        <td>{a.gameSystem}</td>
                        <td>{a.dungeonMaster?.name || "-"}</td>
                        <td>{a.minPlayers}–{a.maxPlayers}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
