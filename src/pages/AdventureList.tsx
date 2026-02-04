import {useCallback, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import type {UserDto} from "../types/user";
import {UserService} from "../api/UserService";
import Autocomplete from "@mui/material/Autocomplete";
import {AdventureService} from "../api/AdventureService";
import type {AdventureDto, AdventurePage, AdventureStatus, AdventureType} from "../types/adventure";
import {
    Alert,
    Box,
    Button,
    Chip,
    FormControl,
    InputLabel,
    MenuItem,
    OutlinedInput,
    Pagination,
    Select,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    Typography,
    useMediaQuery,
} from "@mui/material";
import {useTheme} from "@mui/material/styles";
import {adventureStatuses, adventureTypes} from "./AdventureLabels.ts";
import {SortableHeader} from "../components/SortableHeader.tsx";
import GlassCard from "../components/GlassCard.tsx";
import LoadingSpinner from "../components/LoadingSpinner.tsx";
import AnimatedList from "../components/AnimatedList.tsx";
import {brand} from "../theme/palette";

export default function AdventureList() {
    const [adventures, setAdventures] = useState<AdventureDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [page, setPage] = useState(0);
    const [size] = useState(10);
    const [totalPages, setTotalPages] = useState(0);

    const [statusFilter, setStatusFilter] = useState<AdventureStatus[]>([]);
    const [typeFilter, setTypeFilter] = useState<AdventureType[]>([]);

    const [dungeonMasters, setDungeonMasters] = useState<UserDto[]>([]);
    const [selectedDm, setSelectedDm] = useState<UserDto | null>(null);
    const [dmIdFilter, setDmIdFilter] = useState("");

    const [sort, setSort] = useState<string | null>(null);

    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const isDark = theme.palette.mode === "dark";

    const loadAdventures = useCallback(() => {
        setLoading(true);
        setError(null);

        AdventureService.list({
            page,
            size,
            statuses: statusFilter.length ? statusFilter : undefined,
            types: typeFilter.length ? typeFilter : undefined,
            dungeonMasterIds: dmIdFilter ? [dmIdFilter] : undefined,
            sort: sort ? [sort] : undefined,
        })
            .then((data: AdventurePage) => {
                setAdventures(data.content);
                setTotalPages(data.totalPages);
            })
            .catch(e => setError(e.message || "Ошибка загрузки приключений"))
            .finally(() => setLoading(false));
    }, [page, size, statusFilter, typeFilter, dmIdFilter, sort]);

    useEffect(() => {
        loadAdventures();
    }, [loadAdventures]);

    useEffect(() => {
        UserService.listDungeonMasters()
            .then((all) => setDungeonMasters(all.content))
            .catch(() => {});
    }, []);

    const handleSort = (field: string) => {
        setPage(0);
        setSort(prev => {
            if (!prev) return `${field},asc`;
            const [prevField, prevDir] = prev.split(",");
            if (prevField !== field) return `${field},asc`;
            if (prevDir === "asc") return `${field},desc`;
            return null;
        });
    };

    const handleChangePage = (_: React.ChangeEvent<unknown>, newPage1Based: number) => {
        setPage(newPage1Based - 1);
    };

    const clearFilters = () => {
        setStatusFilter([]);
        setTypeFilter([]);
        setSelectedDm(null);
        setDmIdFilter("");
        setPage(0);
        setSort(null);
    };

    const headerBlock = (
        <Box sx={{mb: 3, display: "flex", alignItems: "center", justifyContent: "space-between"}}>
            <Typography variant={isMobile ? "h5" : "h4"}>
                Приключения
            </Typography>
            <Button
                variant="contained"
                color="primary"
                size={isMobile ? "small" : "medium"}
                onClick={() => navigate("/adventures/new")}
                sx={{minWidth: 0, px: isMobile ? 1.5 : 2, boxShadow: isMobile ? 1 : undefined}}
            >
                Создать
            </Button>
        </Box>
    );

    const filtersBlock = (
        <Box
            sx={{
                mb: 2,
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                gap: 2,
                alignItems: isMobile ? "stretch" : "flex-end",
            }}
        >
            <FormControl sx={{minWidth: 160}} size={isMobile ? "small" : "medium"}>
                <InputLabel id="status-filter-label">Статус</InputLabel>
                <Select
                    labelId="status-filter-label"
                    multiple
                    value={statusFilter}
                    onChange={e => {
                        setPage(0);
                        setStatusFilter(e.target.value as AdventureStatus[]);
                    }}
                    input={<OutlinedInput label="Статус"/>}
                    renderValue={(selected) => (
                        <Box sx={{display: "flex", flexWrap: "wrap", gap: 0.5}}>
                            {selected.map(value => (
                                <Chip
                                    key={value}
                                    label={adventureStatuses.find(it => it.value === value)?.label ?? value}
                                    size="small"
                                    sx={{
                                        background: `${brand.teal}20`,
                                        color: isDark ? brand.teal : "text.primary",
                                    }}
                                />
                            ))}
                        </Box>
                    )}
                >
                    {adventureStatuses.map(s => (
                        <MenuItem key={s.value} value={s.value}>
                            {s.label}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <FormControl sx={{minWidth: 160}} size={isMobile ? "small" : "medium"}>
                <InputLabel id="type-filter-label">Тип</InputLabel>
                <Select
                    labelId="type-filter-label"
                    multiple
                    value={typeFilter}
                    onChange={e => {
                        setPage(0);
                        setTypeFilter(e.target.value as AdventureType[]);
                    }}
                    input={<OutlinedInput label="Тип"/>}
                    renderValue={(selected) => (
                        <Box sx={{display: "flex", flexWrap: "wrap", gap: 0.5}}>
                            {selected.map(value => (
                                <Chip
                                    key={value}
                                    label={adventureTypes.find(it => it.value === value)?.label ?? value}
                                    size="small"
                                    sx={{
                                        background: `${brand.lavender}20`,
                                        color: isDark ? brand.lavender : "text.primary",
                                    }}
                                />
                            ))}
                        </Box>
                    )}
                >
                    {adventureTypes.map(t => (
                        <MenuItem key={t.value} value={t.value}>
                            {t.label}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <Box sx={{display: "flex", gap: 1, flexGrow: 1}}>
                <Autocomplete
                    fullWidth
                    size={isMobile ? "small" : "medium"}
                    options={dungeonMasters}
                    value={selectedDm}
                    onChange={(_, newValue) => {
                        setSelectedDm(newValue);
                        setPage(0);
                        setDmIdFilter(newValue?.id ?? "");
                    }}
                    getOptionLabel={(option) => option.name ?? ""}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Мастер"
                            placeholder="Выберите мастера"
                        />
                    )}
                    noOptionsText="Мастера не найдены"
                />
            </Box>

            <Button
                variant="text"
                color="secondary"
                size={isMobile ? "small" : "medium"}
                onClick={clearFilters}
            >
                Сбросить
            </Button>
        </Box>
    );

    const feedbackBlock = (
        <>
            {loading && (
                <Box sx={{display: "flex", justifyContent: "center", my: 4}}>
                    <LoadingSpinner text="Загрузка приключений..." />
                </Box>
            )}
            {error && (
                <Alert severity="error" sx={{mb: 2}}>{error}</Alert>
            )}
            {!loading && !error && (adventures.length === 0) && (
                <Alert severity="info" sx={{mt: 3}}>
                    Пока нет приключений.
                </Alert>
            )}
        </>
    );

    const paginationBlock = (
        !error && totalPages > 1 && (
            <Box sx={{mt: 3, display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                <Typography variant="body2" color="text.secondary">
                    Страница {page + 1} из {totalPages}
                </Typography>
                <Pagination
                    color="primary"
                    page={page + 1}
                    count={totalPages}
                    onChange={handleChangePage}
                    size={isMobile ? "small" : "medium"}
                />
            </Box>
        )
    );

    // Mobile
    if (isMobile) {
        return (
            <Box sx={{px: 2, pt: 4, pb: 2}}>
                {headerBlock}
                {filtersBlock}
                {feedbackBlock}
                <Box>
                    {!loading && !error && adventures.length > 0 && (
                        <AnimatedList>
                            {adventures.map(a => (
                                <GlassCard
                                    key={a.id}
                                    hoverable
                                    padding={2}
                                    sx={{
                                        mb: 2,
                                        cursor: "pointer",
                                    }}
                                    onClick={() => navigate(`/adventures/${a.id}`)}
                                >
                                    <Typography variant="h6" sx={{mb: 1, color: isDark ? brand.teal : "text.primary"}}>
                                        {a.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        <b>Тип:</b> {adventureTypes.find(it => it.value == a.type)?.label}<br/>
                                        <b>Статус:</b> {adventureStatuses.find(it => it.value == a.status)?.label}<br/>
                                        <b>Система:</b> {a.gameSystem}<br/>
                                        <b>Мастер:</b> {a.dungeonMaster?.name || "-"}<br/>
                                        <b>Игроки:</b> {a.minPlayers !== a.maxPlayers ? `${a.minPlayers}–${a.maxPlayers}` : a.minPlayers}
                                    </Typography>
                                </GlassCard>
                            ))}
                        </AnimatedList>
                    )}
                    {paginationBlock}
                </Box>
            </Box>
        );
    }

    // Desktop
    return (
        <GlassCard
            hoverable={false}
            sx={{maxWidth: 900, mx: "auto", my: 4}}
            padding={4}
        >
            {headerBlock}
            {filtersBlock}
            {feedbackBlock}
            {!loading && !error && adventures.length > 0 && (
                <Box sx={{width: "100%", overflowX: "auto"}}>
                    <Table sx={{minWidth: 600, mt: 2, cursor: "pointer", tableLayout: "fixed"}}>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{width: "26%"}}>
                                    <SortableHeader
                                        label="Название"
                                        field="title"
                                        currentSort={sort}
                                        onSort={handleSort}
                                    />
                                </TableCell>
                                <TableCell sx={{width: "12%"}}>Тип</TableCell>
                                <TableCell sx={{width: "16%"}}>
                                    <SortableHeader
                                        label="Статус"
                                        field="statusSortOrder"
                                        currentSort={sort}
                                        onSort={handleSort}
                                    />
                                </TableCell>
                                <TableCell sx={{width: "16%"}}>Система</TableCell>
                                <TableCell sx={{width: "18%"}}>Мастер</TableCell>
                                <TableCell sx={{width: "12%"}}>Игроки</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {adventures.map(a => (
                                <TableRow
                                    key={a.id}
                                    hover
                                    onClick={() => navigate(`/adventures/${a.id}`)}
                                    sx={{cursor: "pointer"}}
                                >
                                    <TableCell sx={{color: isDark ? brand.teal : "inherit"}}>{a.title}</TableCell>
                                    <TableCell>{adventureTypes.find(it => it.value == a.type)?.label}</TableCell>
                                    <TableCell>{adventureStatuses.find(it => it.value == a.status)?.label}</TableCell>
                                    <TableCell>{a.gameSystem}</TableCell>
                                    <TableCell>{a.dungeonMaster?.name || "-"}</TableCell>
                                    <TableCell>{a.minPlayers !== a.maxPlayers ? `${a.minPlayers}–${a.maxPlayers}` : a.minPlayers}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Box>
            )}
            {paginationBlock}
        </GlassCard>
    );
}
