import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {Alert, Box, Card, CardContent, CircularProgress, Table, TableBody, TableCell, TableHead, TableRow, Tooltip, Typography} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import {CurrencyRateService} from "../api/CurrencyRateService";
import type {CurrencyRateDto} from "../types/currencyRate";

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
        <Card sx={{ maxWidth: 600, margin: "24px auto", p: 2 }}>
            <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                    <Typography variant="h5" component="h1">
                        Курсы валют
                    </Typography>
                    <Tooltip title="Добавить курс">
                        <AddIcon color="primary"
                                 onClick={() => navigate("/currency-rates/new")}
                                 sx={{cursor: "pointer", color: "primary.main", fontSize: 22, '&:hover': {color: "#000"}}}
                        />
                    </Tooltip>
                </Box>
                {loading && (
                    <Box display="flex" justifyContent="center" my={4}>
                        <CircularProgress />
                    </Box>
                )}
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Валюта</TableCell>
                            <TableCell>Курс</TableCell>
                            <TableCell>Обновлён</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rates.map((r) => (
                            <TableRow
                                key={r.currency}
                                hover
                                sx={{ cursor: "pointer" }}
                                onClick={() => navigate(`/currency-rates/${r.currency}`)}
                            >
                                <TableCell>{r.currency}</TableCell>
                                <TableCell>{r.ratio}</TableCell>
                                <TableCell>{new Date(r.updatedAt).toLocaleString()}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {(!loading && rates.length === 0 && !error) && (
                    <Typography variant="body2" color="text.secondary" align="center" mt={2}>
                        Нет данных о курсах валют.
                    </Typography>
                )}
            </CardContent>
        </Card>
    );
}
