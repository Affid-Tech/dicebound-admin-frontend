import { useEffect, useState } from "react";
import { GameSessionService } from "../api/GameSessionService";
import type { GameSessionDto } from "../types/gameSession";
import GameSessionForm from "./GameSessionForm";
import {
    Paper,
    Typography,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Box,
    Alert,
    CircularProgress,
} from "@mui/material";

export default function GameSessionList({ adventureId }: Readonly<{ adventureId: string }>) {
    const [sessions, setSessions] = useState<GameSessionDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [editing, setEditing] = useState<string | null>(null);

    const fetchSessions = () => {
        setLoading(true);
        GameSessionService.listForAdventure(adventureId)
            .then(setSessions)
            .catch(e => setError(e.message))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchSessions();
        // eslint-disable-next-line
    }, [adventureId]);

    return (
        <Paper variant="outlined" sx={{ mt: 4, mb: 4, p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
                Сессии
            </Typography>
            {loading && (
                <Box sx={{ display: "flex", justifyContent: "center", my: 3 }}>
                    <CircularProgress />
                </Box>
            )}
            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
            )}
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>Дата и время</TableCell>
                        <TableCell>Длительность (ч)</TableCell>
                        <TableCell>Foundry</TableCell>
                        <TableCell>Заметки</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {sessions.map(s => (
                        <TableRow
                            key={s.id}
                            hover
                            onClick={() => setEditing(s.id)}
                            sx={{ cursor: "pointer" }}
                        >
                            <TableCell>{new Date(s.startTime).toLocaleString()}</TableCell>
                            <TableCell>{s.durationHours}</TableCell>
                            <TableCell>{s.linkFoundry ?? "-"}</TableCell>
                            <TableCell>{s.notes ?? "-"}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            {editing && (
                <Box sx={{ mt: 3 }}>
                    <GameSessionForm
                        adventureId={adventureId}
                        sessionId={editing}
                        onSaved={() => {
                            setEditing(null);
                            fetchSessions();
                        }}
                        onCancel={() => setEditing(null)}
                    />
                </Box>
            )}
        </Paper>
    );
}
