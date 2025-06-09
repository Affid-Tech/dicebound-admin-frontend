import { useEffect, useState } from "react";
import { AdventureSignupService } from "../api/AdventureSignupService";
import type {AdventureSignupDto, AdventureSignupStatus} from "../types/adventureSignup";

export default function AdventureSignupList({ adventureId }: Readonly<{ adventureId: string }>) {
    const [signups, setSignups] = useState<AdventureSignupDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [editingSignup, setEditingSignup] = useState<string | null>(null);


    useEffect(() => {
        AdventureSignupService.listForAdventure(adventureId)
            .then(setSignups)
            .catch(e => setError(e.message))
            .finally(() => setLoading(false));
    }, [adventureId]);

    return (
        <div>
            <h3>Записи на приключение</h3>
            {loading && <div>Загрузка...</div>}
            {error && <div style={{ color: "red" }}>{error}</div>}
            <table>
                <thead>
                <tr>
                    <th>Игрок</th>
                    <th>Email</th>
                    <th>Статус</th>
                </tr>
                </thead>
                <tbody>
                {signups.map(s => (
                    <tr key={s.id}>
                        <td>{s.user.name}</td>
                        <td>{s.user.email}</td>
                        <td onClick={() => setEditingSignup(s.id)}>
                            {editingSignup === s.id ? (
                                <select
                                    value={s.status}
                                    onChange={async e => {
                                        await AdventureSignupService.patch(s.id, { status: e.target.value as AdventureSignupStatus });
                                        setEditingSignup(null);
                                        // обнови список!
                                    }}
                                >
                                    <option value="PENDING">PENDING</option>
                                    <option value="APPROVED">APPROVED</option>
                                    <option value="CANCELED">CANCELED</option>
                                </select>
                            ) : (
                                s.status
                            )}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
