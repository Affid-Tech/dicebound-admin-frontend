import { useEffect, useState } from "react";
import { AdventureSignupService } from "../api/AdventureSignupService";
import type { AdventureSignupDto, AdventureSignupStatus } from "../types/adventureSignup";
import {
    Paper,
    Typography,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Select,
    MenuItem,
    CircularProgress,
    Alert,
    Box,
} from "@mui/material";

const STATUS_OPTIONS: AdventureSignupStatus[] = ["PENDING", "APPROVED", "CANCELED"];

export default function AdventureSignupList({ adventureId }: Readonly<{ adventureId: string }>) {
    const [signups, setSignups] = useState<AdventureSignupDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editingSignup, setEditingSignup] = useState<string | null>(null);

    const fetchSignups = () => {
        setLoading(true);
        AdventureSignupService.listForAdventure(adventureId)
            .then(setSignups)
            .catch(e => setError(e.message))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchSignups();
        // eslint-disable-next-line
    }, [adventureId]);

    const handleStatusChange = async (signupId: string, newStatus: AdventureSignupStatus) => {
        await AdventureSignupService.patch(signupId, { status: newStatus });
        setEditingSignup(null);
        fetchSignups();
    };

    return (
        <Paper variant="outlined" sx={{ mt: 4, mb: 4, p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
                Записи на приключение
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
                        <TableCell>Игрок</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Статус</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {signups.map(s => (
                        <TableRow
                            key={s.id}
                            hover
                            selected={editingSignup === s.id}
                        >
                            <TableCell>{s.user.name}</TableCell>
                            <TableCell>{s.user.email}</TableCell>
                            <TableCell onClick={() => setEditingSignup(s.id)} sx={{ cursor: "pointer" }}>
                                {editingSignup === s.id ? (
                                    <Select
                                        value={s.status}
                                        onChange={e =>
                                            handleStatusChange(s.id, e.target.value as AdventureSignupStatus)
                                        }
                                        onBlur={() => setEditingSignup(null)}
                                        autoFocus
                                        size="small"
                                    >
                                        {STATUS_OPTIONS.map(opt => (
                                            <MenuItem key={opt} value={opt}>
                                                {opt}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                ) : (
                                    s.status
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Paper>
    );
}
