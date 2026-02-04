import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {
    Alert,
    Box,
    Button,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Tooltip,
    Typography,
    useMediaQuery,
} from "@mui/material";
import {useTheme} from "@mui/material/styles";
import AddIcon from "@mui/icons-material/Add";
import {CurrencyRateService} from "../api/CurrencyRateService";
import type {CurrencyRateDto} from "../types/currencyRate";
import GlassCard from "../components/GlassCard.tsx";
import LoadingSpinner from "../components/LoadingSpinner.tsx";
import AnimatedList from "../components/AnimatedList.tsx";
import {brand} from "../theme/palette";

export default function CurrencyRateList() {
    const [rates, setRates] = useState<CurrencyRateDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const isDark = theme.palette.mode === "dark";

    useEffect(() => {
        CurrencyRateService.list()
            .then(setRates)
            .catch(e => setError(e.message))
            .finally(() => setLoading(false));
    }, []);

    const headerBlock = (
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
            <Typography variant={isMobile ? "h6" : "h5"} component="h1" sx={{fontWeight: 700}}>
                Курсы валют
            </Typography>
            <Tooltip title="Добавить курс">
                {isMobile ? (
                    <Button
                        color="primary"
                        variant="contained"
                        size="small"
                        sx={{minWidth: 0, px: 1.5, boxShadow: 1}}
                        onClick={() => navigate("/currency-rates/new")}
                    >
                        <AddIcon/>
                    </Button>
                ) : (
                    <AddIcon
                        color="primary"
                        onClick={() => navigate("/currency-rates/new")}
                        sx={{
                            cursor: "pointer",
                            color: "primary.main",
                            fontSize: 22,
                            '&:hover': {color: brand.teal},
                            transition: "color 0.2s ease",
                        }}
                    />
                )}
            </Tooltip>
        </Box>
    );

    const feedbackBlock = (
        <>
            {loading && (
                <Box display="flex" justifyContent="center" my={4}>
                    <LoadingSpinner text="Загрузка курсов..."/>
                </Box>
            )}
            {error && (
                <Alert severity="error" sx={{mb: 2}}>
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
            <Box sx={{px: 2, pt: 4, pb: 2}}>
                {headerBlock}
                {feedbackBlock}
                {!loading && !error && rates.length > 0 && (
                    <AnimatedList>
                        {rates.map((r) => (
                            <GlassCard
                                key={r.currency}
                                hoverable
                                padding={2}
                                sx={{
                                    mb: 2,
                                    cursor: "pointer",
                                }}
                                onClick={() => navigate(`/currency-rates/${r.currency}`)}
                            >
                                <Typography variant="subtitle1" sx={{fontWeight: 700, mb: 0.5, color: isDark ? brand.teal : "text.primary"}}>
                                    {r.currency}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    <b>Курс:</b> {r.ratio}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    <b>Обновлён:</b> {new Date(r.updatedAt).toLocaleString()}
                                </Typography>
                            </GlassCard>
                        ))}
                    </AnimatedList>
                )}
            </Box>
        );
    }

    // Desktop/tablet
    return (
        <GlassCard
            hoverable={false}
            sx={{maxWidth: 600, margin: "24px auto"}}
            padding={4}
        >
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
                                sx={{cursor: "pointer"}}
                                onClick={() => navigate(`/currency-rates/${r.currency}`)}
                            >
                                <TableCell sx={{color: isDark ? brand.teal : "inherit"}}>{r.currency}</TableCell>
                                <TableCell>{r.ratio}</TableCell>
                                <TableCell>{new Date(r.updatedAt).toLocaleString()}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
        </GlassCard>
    );
}
