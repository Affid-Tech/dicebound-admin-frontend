import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {Alert, Box, Button, Card, CardContent, CircularProgress, Paper, Table, TableBody, TableCell, TableHead, TableRow, Tooltip, Typography, useMediaQuery,} from "@mui/material";
import {useTheme} from "@mui/material/styles";
import AddIcon from "@mui/icons-material/Add";
import {CurrencyRateService} from "../api/CurrencyRateService";
import type {CurrencyRateDto} from "../types/currencyRate";

export default function CurrencyRateList() {
    const [rates, setRates] = useState<CurrencyRateDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    useEffect(() => {
        CurrencyRateService.list()
            .then(setRates)
            .catch(e => setError(e.message))
            .finally(() => setLoading(false));
    }, []);

    // Shared header
    const headerBlock = (
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
            <Typography variant={isMobile ? "h6" : "h5"} component="h1" sx={{ fontWeight: 700 }}>
                Курсы валют
            </Typography>
            <Tooltip title="Добавить курс">
                {isMobile ? (
                    <Button
                        color="primary"
                        variant="contained"
                        size="small"
                        sx={{ minWidth: 0, px: 1.5, boxShadow: 1 }}
                        onClick={() => navigate("/currency-rates/new")}
                    >
                        <AddIcon />
                    </Button>
                ) : (
                    <AddIcon
                        color="primary"
                        onClick={() => navigate("/currency-rates/new")}
                        sx={{ cursor: "pointer", color: "primary.main", fontSize: 22, '&:hover': { color: "#000" } }}
                    />
                )}
            </Tooltip>
        </Box>
    );

    // Feedback
    const feedbackBlock = (
        <>
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
            {!loading && !error && rates.length === 0 && (
                <Typography variant="body2" color="text.secondary" align="center" mt={2}>
                    Нет данных о курсах валют.
                </Typography>
            )}
        </>
    );

    if (isMobile) {
        return (
            <Box sx={{ px: 2, pt: 4, pb: 2 }}>
                {headerBlock}
                {feedbackBlock}
                {!loading && !error && rates.length > 0 && (
                    <Box>
                        {rates.map((r) => (
                            <Paper
                                key={r.currency}
                                sx={{
                                    mb: 2, p: 2, borderRadius: 2,
                                    cursor: "pointer",
                                    boxShadow: 2,
                                    '&:hover': { boxShadow: 6, background: "#F8F9FB" },
                                    transition: "box-shadow 0.18s, background 0.18s"
                                }}
                                onClick={() => navigate(`/currency-rates/${r.currency}`)}
                            >
                                <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5 }}>
                                    {r.currency}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    <b>Курс:</b> {r.ratio}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    <b>Обновлён:</b> {new Date(r.updatedAt).toLocaleString()}
                                </Typography>
                            </Paper>
                        ))}
                    </Box>
                )}
            </Box>
        );
    }

    // Desktop/tablet
    return (
        <Card sx={{ maxWidth: 600, margin: "24px auto", p: 2 }}>
            <CardContent>
                {headerBlock}
                {feedbackBlock}
                {!loading && !error && rates.length > 0 && (
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
                )}
            </CardContent>
        </Card>
    );
}
