import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AdventureService } from "../api/AdventureService";
import type { AdventureDto } from "../types/adventure";
import GameSessionList from "./GameSessionList";
import AdventureSignupList from "./AdventureSignupList";
import GameSessionForm from "./GameSessionForm";
import AdventureSignupForm from "./AdventureSignupForm";

export default function AdventureDetails() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [adventure, setAdventure] = useState<AdventureDto | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [sessionsTick, setSessionsTick] = useState(0);
    const [signupsTick, setSignupsTick] = useState(0);

    useEffect(() => {
        if (!id) return;
        setLoading(true);
        AdventureService.get(id)
            .then(setAdventure)
            .catch(e => setError(e.message))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return <div>Загрузка...</div>;
    if (error) return <div style={{ color: "red" }}>{error}</div>;
    if (!adventure) return <div>Нет данных</div>;

    return (
        <div className="card">
            <h2>
                {adventure.title} <span style={{ fontSize: 16, fontWeight: 400, opacity: 0.7 }}>({adventure.type})</span>
            </h2>
            <div style={{ marginBottom: 10 }}>
                <b>Система:</b> {adventure.gameSystem}
            </div>
            <div style={{ marginBottom: 10 }}>
                <b>Мастер:</b> {adventure.dungeonMaster?.name || "-"}
            </div>
            <div style={{ marginBottom: 10 }}>
                <b>Описание:</b> {adventure.description ?? "-"}
            </div>
            <div style={{ marginBottom: 10 }}>
                <b>Стартовый уровень:</b> {adventure.startLevel ?? "-"}
            </div>
            <div style={{ marginBottom: 10 }}>
                <b>Игроки:</b> {adventure.minPlayers}–{adventure.maxPlayers}
            </div>
            <div style={{ marginBottom: 10 }}>
                <b>Стоимость:</b> {adventure.priceUnits ? adventure.priceUnits + " 🪙" : "-"}
            </div>

            {/* Вложенные таблицы */}
            <div style={{ marginTop: 40 }}>
                <GameSessionForm adventureId={adventure.id} onCancel={() => setSessionsTick(t => t + 1)} onSaved={() => setSessionsTick(t => t + 1)} />
                <GameSessionList adventureId={adventure.id} key={sessionsTick}/>
            </div>
            <div style={{ marginTop: 40 }}>
                <AdventureSignupForm adventureId={adventure.id} onCreated={() => setSignupsTick(t => t + 1)} />
                <AdventureSignupList adventureId={adventure.id} key={signupsTick}/>
            </div>

            <div style={{ marginTop: 32 }}>
                <button onClick={() => navigate(`/adventures/${adventure.id}/edit`)}>
                    Редактировать
                </button>
                <button onClick={() => navigate("/adventures")} style={{ marginLeft: 10 }}>
                    Назад к списку
                </button>
            </div>
        </div>
    );
}
