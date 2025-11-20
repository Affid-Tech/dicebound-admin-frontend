import {Box} from "@mui/material";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import UnfoldMoreIcon from "@mui/icons-material/UnfoldMore";

interface SortableHeaderProps {
    label: string;
    field: string;
    currentSort: string | null;  // "title,asc" | null
    onSort: (field: string) => void;
}

export function SortableHeader({ label, field, currentSort, onSort }: SortableHeaderProps) {
    const active = currentSort?.startsWith(field);
    const direction = active ? currentSort!.split(",")[1] : null;

    return (
        <Box
            onClick={() => onSort(field)}
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                cursor: "pointer",
                userSelect: "none",
                width: "100%",
            }}
        >
            <Box
                sx={{
                    fontWeight: active ? 600 : 400,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    pr: 1,
                }}
            >
                {label}
            </Box>

            <Box sx={{ display: "flex", alignItems: "center" }}>
                {!active && (
                    <UnfoldMoreIcon fontSize="small" sx={{ opacity: 0.3 }} />
                )}
                {active && direction === "asc" && (
                    <ArrowDropUpIcon fontSize="small" />
                )}
                {active && direction === "desc" && (
                    <ArrowDropDownIcon fontSize="small" />
                )}
            </Box>
        </Box>
    );
}
