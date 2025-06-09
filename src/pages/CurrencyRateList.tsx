import { useEffect, useState } from "react";
import { CurrencyRateService } from "../api/CurrencyRateService";
import type { CurrencyRateDto } from "../types/currencyRate";
import { useNavigate } from "react-router-dom";

export default function CurrencyRateList() {
    const [rates, setRates] = useState<CurrencyRateDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        CurrencyRateService.list()
            .then(setRates)
            .catch(e => setError(e.message))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="card card--narrow">
            <h1>Курсы валют</h1>
            <button onClick={() => navigate("/currency-rates/new")}>Добавить курс</button>
            {loading && <div>Загрузка...</div>}
            {error && <div style={{ color: "red" }}>{error}</div>}
            <table style={{ marginTop: 24, width: "100%" }}>
                <thead>
                <tr>
                    <th>Валюта</th>
                    <th>Курс</th>
                    <th>Обновлён</th>
                </tr>
                </thead>
                <tbody>
                {rates.map(r => (
                    <tr key={r.currency} onClick={() => navigate(`/currency-rates/${r.currency}`)}>
                        <td>{r.currency}</td>
                        <td>{r.ratio}</td>
                        <td>{new Date(r.updatedAt).toLocaleString()}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
