import React, {useEffect, useState} from "react";
import {UserService} from "../api/UserService";
import type {UserDto, UserRole} from "../types/user";
import {useNavigate} from "react-router-dom";
import {
    Alert,
    Box,
    Card,
    CardContent,
    Checkbox,
    CircularProgress,
    ListItemText,
    Menu,
    MenuItem,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Tooltip,
    Typography
} from "@mui/material";
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

    // MULTISELECT фильтр
    const [roleFilter, setRoleFilter] = useState<UserRole[]>([]);
    const [filterAnchor, setFilterAnchor] = useState<null | Element>(null);

    const [sortBy, setSortBy] = useState<"name" | "email" | "roles" | "id">("name");
    const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
    const navigate = useNavigate();

    useEffect(() => {
        UserService.list()
            .then(setUsers)
            .catch((e) => setError(e.message))
            .finally(() => setLoading(false));
    }, []);

    // Новая фильтрация: если роли не выбраны — показываем всех
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

    // Открытие/закрытие фильтра-меню
    const handleFilterOpen = (e: React.MouseEvent<SVGSVGElement>) => setFilterAnchor(e.currentTarget);
    const handleFilterClose = () => setFilterAnchor(null);

    // Логика мультивыбора ролей
    const handleRoleToggle = (role: UserRole) => {
        setRoleFilter(prev =>
            prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role]
        );
    };

    // Очистить все фильтры
    const handleClearFilter = () => setRoleFilter([]);

    function sortByColumn(columnName: "name" | "email" | "roles" | "id" = "name") {
        if (sortBy === columnName) return (sortDir === "asc"
            ? <ArrowDropUpIcon
                sx={{cursor: "pointer", color: "#888", ml: 0.5, fontSize: 22, '&:hover': {color: "#000"}}}
                onClick={() => handleSort(columnName)}
            />
            : <ArrowDropDownIcon
                sx={{cursor: "pointer", color: "#888", ml: 0.5, fontSize: 22, '&:hover': {color: "#000"}}}
                onClick={() => handleSort(columnName)}
            />);

        else return (
            <UnfoldMoreIcon
                sx={{cursor: "pointer", color: "#bbb", ml: 0.5, fontSize: 20, '&:hover': {color: "#000"}}}
                onClick={() => handleSort(columnName)}
            />
        )
    }

    return (
        <Card sx={{maxWidth: 960, mx: "auto", mt: 4, p: 2}}>
            <CardContent>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
                    <Typography variant="h5" component="h1">
                        Пользователи
                    </Typography>
                    <Tooltip title="Создать пользователя">
                        <AddIcon color="primary"
                                 onClick={() => navigate("/users/new")}
                                 sx={{cursor: "pointer", color: "primary.main", fontSize: 22, '&:hover': {color: "#000"}}}
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

                <Table sx={{mt: 2, cursor: "pointer"}}>
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
                                                '&:hover': {color: "#000"}
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
                                    slotProps={{list: {dense: true}}}
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
                                                sx={{mr: 1}}
                                            />
                                            <ListItemText primary={role}/>
                                        </MenuItem>
                                    ))}
                                    <MenuItem
                                        disabled={roleFilter.length === 0}
                                        onClick={handleClearFilter}
                                        sx={{justifyContent: "center", fontSize: 13, opacity: 0.8}}
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
                                sx={{transition: "background 0.15s", cursor: "pointer"}}
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
}
