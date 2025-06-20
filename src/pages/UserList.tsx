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
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import UnfoldMoreIcon from "@mui/icons-material/UnfoldMore";
import FilterListIcon from "@mui/icons-material/FilterList";

const ALL_ROLES: UserRole[] = ["PLAYER", "DUNGEON_MASTER", "ADMIN"];

export default function UserList() {
    const [users, setUsers] = useState<UserDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [roleFilter, setRoleFilter] = useState<UserRole[]>([]);
    const [filterAnchor, setFilterAnchor] = useState<null | Element>(null);

    const [sortBy, setSortBy] = useState<"name" | "email" | "roles" | "id">("name");
    const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
    const navigate = useNavigate();

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    useEffect(() => {
        UserService.list()
            .then(setUsers)
            .catch((e) => setError(e.message))
            .finally(() => setLoading(false));
    }, []);

    const filteredUsers =
        roleFilter.length === 0
            ? users
            : users.filter((u) => roleFilter.some((role) => u.roles.includes(role)));

    const sortedUsers = [...filteredUsers].sort((a, b) => {
        const getValue = (u: UserDto) =>
            sortBy === "roles"
                ? u.roles.join(", ")
                : (u[sortBy] ?? "");
        const aVal = getValue(a).toString().toLowerCase();
        const bVal = getValue(b).toString().toLowerCase();
        if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
        if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
        return 0;
    });

    const handleSort = (column: typeof sortBy) => {
        if (sortBy === column) setSortDir(d => d === "asc" ? "desc" : "asc");
        else {
            setSortBy(column);
            setSortDir("asc");
        }
    };

    const handleFilterOpen = (e: React.MouseEvent<SVGSVGElement>) => setFilterAnchor(e.currentTarget);
    const handleFilterClose = () => setFilterAnchor(null);

    const handleRoleToggle = (role: UserRole) => {
        setRoleFilter(prev =>
            prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role]
        );
    };

    const handleClearFilter = () => setRoleFilter([]);

    function sortByColumn(columnName: "name" | "email" | "roles" | "id" = "name") {
        if (sortBy === columnName) return (sortDir === "asc"
            ? <ArrowDropUpIcon
                sx={{ cursor: "pointer", color: "#888", ml: 0.5, fontSize: 22, '&:hover': { color: "#000" } }}
                onClick={() => handleSort(columnName)}
            />
            : <ArrowDropDownIcon
                sx={{ cursor: "pointer", color: "#888", ml: 0.5, fontSize: 22, '&:hover': { color: "#000" } }}
                onClick={() => handleSort(columnName)}
            />);

        else return (
            <UnfoldMoreIcon
                sx={{ cursor: "pointer", color: "#bbb", ml: 0.5, fontSize: 20, '&:hover': { color: "#000" } }}
                onClick={() => handleSort(columnName)}
            />
        )
    }

    // Render for mobile
    const mobileList = (
        <Box sx={{ px: 2, pt: 4, pb: 2, background: "transparent" }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1.5}>
                <Typography variant="h5" component="h1" sx={{ fontWeight: 700 }}>
                    Пользователи
                </Typography>
                <Tooltip title="Создать пользователя">
                    <Button
                        color="primary"
                        variant="contained"
                        size="small"
                        sx={{ minWidth: 0, px: 1.5, boxShadow: 1 }}
                        onClick={() => navigate("/users/new")}
                    >
                        <AddIcon />
                    </Button>
                </Tooltip>
            </Stack>
            <Box mb={2} display="flex" alignItems="center">
                <Tooltip title="Фильтр по ролям">
                    <FilterListIcon
                        sx={{
                            cursor: "pointer",
                            color: roleFilter.length > 0 ? "primary.main" : "#888",
                            fontSize: 24,
                            '&:hover': { color: "#000" }
                        }}
                        onClick={handleFilterOpen}
                    />
                </Tooltip>
                <Menu
                    anchorEl={filterAnchor}
                    open={Boolean(filterAnchor)}
                    onClose={handleFilterClose}
                    slotProps={{ list: { dense: true } }}
                >
                    {ALL_ROLES.map(role => (
                        <MenuItem
                            key={role}
                            value={role}
                            onClick={() => handleRoleToggle(role)}
                            dense
                        >
                            <Checkbox
                                checked={roleFilter.includes(role)}
                                size="small"
                                sx={{ mr: 1 }}
                            />
                            <ListItemText primary={role} />
                        </MenuItem>
                    ))}
                    <MenuItem
                        disabled={roleFilter.length === 0}
                        onClick={handleClearFilter}
                        sx={{ justifyContent: "center", fontSize: 13, opacity: 0.8 }}
                    >
                        Сбросить фильтр
                    </MenuItem>
                </Menu>
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

            {!loading && !error && sortedUsers.length === 0 && (
                <Alert severity="info" sx={{ mt: 3 }}>
                    Нет пользователей с такими параметрами.
                </Alert>
            )}

            <Stack spacing={1.5}>
                {sortedUsers.map((u) => (
                    <Paper
                        key={u.id}
                        sx={{
                            px: 2, py: 2, borderRadius: 2, cursor: "pointer",
                            boxShadow: 2,
                            '&:hover': { boxShadow: 6, background: "#F8F9FB" },
                            transition: "box-shadow 0.18s, background 0.18s"
                        }}
                        onClick={() => navigate(`/users/${u.id}`)}
                    >
                        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.3 }}>
                            {u.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ wordBreak: "break-all", mb: 0.3 }}>
                            <b>Email:</b> {u.email ?? <span style={{ color: "#ccc" }}>—</span>}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            <b>Роли:</b> {u.roles.length > 0 ? u.roles.join(", ") : <span style={{ color: "#ccc" }}>—</span>}
                        </Typography>
                    </Paper>
                ))}
            </Stack>
        </Box>

    );

    // Render for desktop
    const desktopTable = (
        <Card sx={{ maxWidth: 960, mx: "auto", mt: 4, p: 2 }}>
            <CardContent>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
                    <Typography variant="h5" component="h1">
                        Пользователи
                    </Typography>
                    <Tooltip title="Создать пользователя">
                        <AddIcon color="primary"
                                 onClick={() => navigate("/users/new")}
                                 sx={{ cursor: "pointer", color: "primary.main", fontSize: 22, '&:hover': { color: "#000" } }}
                        />
                    </Tooltip>
                </Stack>

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

                <Table sx={{ mt: 2, cursor: "pointer" }}>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <Box display="flex" alignItems="center">
                                    Имя
                                    {sortByColumn("name")}
                                </Box>
                            </TableCell>
                            <TableCell>
                                <Box display="flex" alignItems="center">
                                    Email
                                    {sortByColumn("email")}
                                </Box>
                            </TableCell>
                            <TableCell>
                                <Box display="flex" alignItems="center" gap={1}>
                                    Роли
                                    <Tooltip title="Фильтр по ролям">
                                        <FilterListIcon
                                            sx={{
                                                p: "4px",
                                                cursor: "pointer",
                                                color: roleFilter.length > 0 ? "primary.main" : "#888",
                                                ml: 0.5,
                                                fontSize: 22,
                                                '&:hover': { color: "#000" }
                                            }}
                                            onClick={handleFilterOpen}
                                        />
                                    </Tooltip>
                                    {sortByColumn("roles")}
                                </Box>
                                <Menu
                                    anchorEl={filterAnchor}
                                    open={Boolean(filterAnchor)}
                                    onClose={handleFilterClose}
                                    slotProps={{ list: { dense: true } }}
                                >
                                    {ALL_ROLES.map(role => (
                                        <MenuItem
                                            key={role}
                                            value={role}
                                            onClick={() => handleRoleToggle(role)}
                                            dense
                                        >
                                            <Checkbox
                                                checked={roleFilter.includes(role)}
                                                size="small"
                                                sx={{ mr: 1 }}
                                            />
                                            <ListItemText primary={role} />
                                        </MenuItem>
                                    ))}
                                    <MenuItem
                                        disabled={roleFilter.length === 0}
                                        onClick={handleClearFilter}
                                        sx={{ justifyContent: "center", fontSize: 13, opacity: 0.8 }}
                                    >
                                        Сбросить фильтр
                                    </MenuItem>
                                </Menu>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sortedUsers.map((u) => (
                            <TableRow
                                key={u.id}
                                hover
                                onClick={() => navigate(`/users/${u.id}`)}
                                sx={{ transition: "background 0.15s", cursor: "pointer" }}
                            >
                                <TableCell>{u.name}</TableCell>
                                <TableCell>{u.email}</TableCell>
                                <TableCell>{u.roles.join(", ")}</TableCell>
                            </TableRow>
                        ))}
                        {!loading && sortedUsers.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={4} align="center">
                                    Нет пользователей с такими параметрами.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );

    return isMobile ? mobileList : desktopTable;
}
