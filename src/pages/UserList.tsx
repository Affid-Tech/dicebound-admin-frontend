import React, {useEffect, useState} from "react";
import {UserService} from "../api/UserService";
import type {UserDto, UserRole} from "../types/user";
import {useNavigate} from "react-router-dom";
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Checkbox,
    CircularProgress,
    ListItemText,
    Menu,
    MenuItem,
    Paper,
    Pagination,
    Stack,
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
import FilterListIcon from "@mui/icons-material/FilterList";
import {SortableHeader} from "../components/SortableHeader.tsx";
import type {PageResponse} from "../types/commons.ts";

const ALL_ROLES: UserRole[] = ["PLAYER", "DUNGEON_MASTER", "ADMIN"] as const;

// поля, по которым реально можем сортировать на бэке
type SortField = "name" | "email" | "id";

export default function UserList() {
    const [users, setUsers] = useState<UserDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // фильтр по одной роли (для бэка)
    const [roleFilter, setRoleFilter] = useState<UserRole | null>(null);
    const [filterAnchor, setFilterAnchor] = useState<null | Element>(null);

    // пагинация
    const [page, setPage] = useState(0);        // 0-based для бэка
    const [size] = useState(5);
    const [totalPages, setTotalPages] = useState(0);

    // сортировка (на бэке)
    const [sort, setSort] = useState<string | null>(null); // "name,asc" | null

    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const loadUsers = () => {
        setLoading(true);
        setError(null);

        UserService.listPageable({
            page,
            size,
            role: roleFilter ?? undefined,
            sort: sort ? [sort] : undefined,
        })
            .then((data: PageResponse<UserDto>) => {
                setUsers(data.content);
                setTotalPages(data.totalPages);
            })
            .catch((e: any) => setError(e.message ?? "Ошибка загрузки пользователей"))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        loadUsers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, size, roleFilter, sort]);

    const handleSort = (field: SortField) => {
        setPage(0);
        setSort(prev => {
            if (!prev) return `${field},asc`;
            const [prevField, prevDir] = prev.split(",");
            if (prevField !== field) return `${field},asc`;
            if (prevDir === "asc") return `${field},desc`;
            // было desc по тому же полю → снимаем сортировку
            return null;
        });
    };

    const handleFilterOpen = (e: React.MouseEvent<SVGSVGElement>) => setFilterAnchor(e.currentTarget);
    const handleFilterClose = () => setFilterAnchor(null);

    const handleRoleSelect = (role: UserRole) => {
        setPage(0);
        setRoleFilter(prev => (prev === role ? null : role));
    };

    const handleClearFilter = () => {
        setPage(0);
        setRoleFilter(null);
    };

    const handleChangePage = (_: React.ChangeEvent<unknown>, newPage1Based: number) => {
        setPage(newPage1Based - 1);
    };

    const paginationBlock = !loading && !error && totalPages > 1 && (
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
    );

    // ---------- Mobile ----------
    const mobileList = (
        <Box sx={{px: 2, pt: 4, pb: 2, background: "transparent"}}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1.5}>
                <Typography variant="h5" component="h1" sx={{fontWeight: 700}}>
                    Пользователи
                </Typography>
                <Tooltip title="Создать пользователя">
                    <Button
                        color="primary"
                        variant="contained"
                        size="small"
                        sx={{minWidth: 0, px: 1.5, boxShadow: 1}}
                        onClick={() => navigate("/users/new")}
                    >
                        <AddIcon/>
                    </Button>
                </Tooltip>
            </Stack>

            <Box mb={2} display="flex" alignItems="center">
                <Tooltip title="Фильтр по ролям">
                    <FilterListIcon
                        sx={{
                            cursor: "pointer",
                            color: roleFilter ? "primary.main" : "#888",
                            fontSize: 24,
                            "&:hover": {color: "#000"},
                        }}
                        onClick={handleFilterOpen}
                    />
                </Tooltip>
                <Menu
                    anchorEl={filterAnchor}
                    open={Boolean(filterAnchor)}
                    onClose={handleFilterClose}
                    slotProps={{list: {dense: true}}}
                >
                    {ALL_ROLES.map(role => (
                        <MenuItem
                            key={role}
                            value={role}
                            onClick={() => handleRoleSelect(role)}
                            dense
                        >
                            <Checkbox
                                checked={roleFilter === role}
                                size="small"
                                sx={{mr: 1}}
                            />
                            <ListItemText primary={role}/>
                        </MenuItem>
                    ))}
                    <MenuItem
                        disabled={!roleFilter}
                        onClick={handleClearFilter}
                        sx={{justifyContent: "center", fontSize: 13, opacity: 0.8}}
                    >
                        Сбросить фильтр
                    </MenuItem>
                </Menu>
            </Box>

            {loading && (
                <Box display="flex" justifyContent="center" my={4}>
                    <CircularProgress/>
                </Box>
            )}
            {error && (
                <Alert severity="error" sx={{mb: 2}}>
                    {error}
                </Alert>
            )}

            {!loading && !error && users.length === 0 && (
                <Alert severity="info" sx={{mt: 3}}>
                    Нет пользователей с такими параметрами.
                </Alert>
            )}

            <Stack spacing={1.5}>
                {users.map((u) => (
                    <Paper
                        key={u.id}
                        sx={{
                            px: 2,
                            py: 2,
                            borderRadius: 2,
                            cursor: "pointer",
                            boxShadow: 2,
                            "&:hover": {boxShadow: 6, background: "#F8F9FB"},
                            transition: "box-shadow 0.18s, background 0.18s",
                        }}
                        onClick={() => navigate(`/users/${u.id}`)}
                    >
                        <Typography variant="subtitle1" sx={{fontWeight: 700, mb: 0.3}}>
                            {u.name}
                        </Typography>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{wordBreak: "break-all", mb: 0.3}}
                        >
                            <b>Email:</b>{" "}
                            {u.email ?? <span style={{color: "#ccc"}}>—</span>}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            <b>Роли:</b>{" "}
                            {u.roles.length > 0 ? u.roles.join(", ") : (
                                <span style={{color: "#ccc"}}>—</span>
                            )}
                        </Typography>
                    </Paper>
                ))}
            </Stack>

            {paginationBlock}
        </Box>
    );

    // ---------- Desktop ----------
    const desktopTable = (
        <Card sx={{maxWidth: 960, mx: "auto", mt: 4, p: 2}}>
            <CardContent>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
                    <Typography variant="h5" component="h1">
                        Пользователи
                    </Typography>
                    <Tooltip title="Создать пользователя">
                        <AddIcon
                            onClick={() => navigate("/users/new")}
                            sx={{
                                cursor: "pointer",
                                color: "primary.main",
                                fontSize: 22,
                                "&:hover": {color: "#000"},
                            }}
                        />
                    </Tooltip>
                </Stack>

                {loading && (
                    <Box display="flex" justifyContent="center" my={4}>
                        <CircularProgress/>
                    </Box>
                )}
                {error && (
                    <Alert severity="error" sx={{mb: 2}}>
                        {error}
                    </Alert>
                )}

                {!loading && !error && users.length === 0 && (
                    <Alert severity="info" sx={{mt: 2}}>
                        Нет пользователей с такими параметрами.
                    </Alert>
                )}

                {users.length > 0 && (
                    <>
                        <Table sx={{mt: 2, cursor: "pointer", tableLayout: "fixed"}}>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{width: "35%"}}>
                                        <SortableHeader
                                            label="Имя"
                                            field="name"
                                            currentSort={sort}
                                            onSort={handleSort}
                                        />
                                    </TableCell>
                                    <TableCell sx={{width: "35%"}}>
                                        <SortableHeader
                                            label="Email"
                                            field="email"
                                            currentSort={sort}
                                            onSort={handleSort}
                                        />
                                    </TableCell>
                                    <TableCell sx={{width: "30%"}}>
                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "space-between",
                                                width: "100%",
                                            }}
                                        >
                                            <Box sx={{fontWeight: 400}}>Роли</Box>
                                            <Tooltip title="Фильтр по ролям">
                                                <FilterListIcon
                                                    sx={{
                                                        p: "4px",
                                                        cursor: "pointer",
                                                        color: roleFilter ? "primary.main" : "#888",
                                                        fontSize: 22,
                                                        "&:hover": {color: "#000"},
                                                    }}
                                                    onClick={handleFilterOpen}
                                                />
                                            </Tooltip>
                                            <Menu
                                                anchorEl={filterAnchor}
                                                open={Boolean(filterAnchor)}
                                                onClose={handleFilterClose}
                                                slotProps={{list: {dense: true}}}
                                            >
                                                {ALL_ROLES.map(role => (
                                                    <MenuItem
                                                        key={role}
                                                        value={role}
                                                        onClick={() => handleRoleSelect(role)}
                                                        dense
                                                    >
                                                        <Checkbox
                                                            checked={roleFilter === role}
                                                            size="small"
                                                            sx={{mr: 1}}
                                                        />
                                                        <ListItemText primary={role}/>
                                                    </MenuItem>
                                                ))}
                                                <MenuItem
                                                    disabled={!roleFilter}
                                                    onClick={handleClearFilter}
                                                    sx={{
                                                        justifyContent: "center",
                                                        fontSize: 13,
                                                        opacity: 0.8,
                                                    }}
                                                >
                                                    Сбросить фильтр
                                                </MenuItem>
                                            </Menu>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {users.map((u) => (
                                    <TableRow
                                        key={u.id}
                                        hover
                                        onClick={() => navigate(`/users/${u.id}`)}
                                        sx={{transition: "background 0.15s", cursor: "pointer"}}
                                    >
                                        <TableCell>{u.name}</TableCell>
                                        <TableCell>{u.email}</TableCell>
                                        <TableCell>{u.roles.join(", ")}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                        {paginationBlock}
                    </>
                )}
            </CardContent>
        </Card>
    );

    return isMobile ? mobileList : desktopTable;
}
