import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {AdventureService} from "../api/AdventureService";
import type {AdventureDto} from "../types/adventure";
import {Alert, Box, Button, CircularProgress, Paper, Table, TableBody, TableCell, TableHead, TableRow, Typography,} from "@mui/material";

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
        <Paper elevation={3} sx={{ maxWidth: 900, mx: "auto", my: 4, p: { xs: 2, sm: 4 }, borderRadius: 3 }}>
            <Typography variant="h4" sx={{ mb: 3 }}>
                Приключения
            </Typography>
            <Button
                variant="contained"
                color="primary"
                sx={{ mb: 3 }}
                onClick={() => navigate("/adventures/new")}
            >
                Создать приключение
            </Button>
            {loading && (
                <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
                    <CircularProgress />
                </Box>
            )}
            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
            )}
            <Table sx={{ mt: 2, cursor: "pointer" }}>
                <TableHead>
                    <TableRow>
                        <TableCell>Название</TableCell>
                        <TableCell>Тип</TableCell>
                        <TableCell>Система</TableCell>
                        <TableCell>Мастер</TableCell>
                        <TableCell>Игроки</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {adventures.map(a => (
                        <TableRow
                            key={a.id}
                            hover
                            onClick={() => navigate(`/adventures/${a.id}`)}
                            sx={{ cursor: "pointer" }}
                        >
                            <TableCell>{a.title}</TableCell>
                            <TableCell>{a.type}</TableCell>
                            <TableCell>{a.gameSystem}</TableCell>
                            <TableCell>{a.dungeonMaster?.name || "-"}</TableCell>
                            <TableCell>{a.minPlayers}–{a.maxPlayers}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Paper>
    );
}
