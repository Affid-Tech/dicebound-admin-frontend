import {useEffect, useState} from "react";
import {GameSessionService} from "../api/GameSessionService";
import type {GameSessionDto} from "../types/gameSession";

import GameSessionForm from "./GameSessionForm"; // Используем ниже

export default function GameSessionList({ adventureId }: Readonly<{ adventureId: string }>) {
    const [sessions, setSessions] = useState<GameSessionDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [editing, setEditing] = useState<string | null>(null);

    useEffect(() => {
        GameSessionService.listForAdventure(adventureId)
            .then(setSessions)
            .catch(e => setError(e.message))
            .finally(() => setLoading(false));
    }, [adventureId]);

    return (
        <div>
            <h3>Сессии</h3>
            {loading && <div>Загрузка...</div>}
            {error && <div style={{ color: "red" }}>{error}</div>}
            <table>
                <thead>
                <tr>
                    <th>Дата и время</th>
                    <th>Длительность (ч)</th>
                    <th>Foundry</th>
                    <th>Заметки</th>
                </tr>
                </thead>
                <tbody>
                {sessions.map(s => (
                    <tr key={s.id} onClick={() => setEditing(s.id)}>
                        <td>{new Date(s.startTime).toLocaleString()}</td>
                        <td>{s.durationHours}</td>
                        <td>{s.linkFoundry ?? "-"}</td>
                        <td>{s.notes ?? "-"}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            {editing && (
                <GameSessionForm
                    adventureId={adventureId}
                    sessionId={editing}
                    onSaved={() => {
                        setEditing(null);
                        // перезагрузить список сессий
                    }}
                    onCancel={() => setEditing(null)}
                />
            )}
        </div>
    );
}
