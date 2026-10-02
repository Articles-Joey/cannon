"use client";
import Switch from "@mui/material/Switch";

export default function ArticlesSwitch({
    setChecked,
    checked,
    readOnly,
    ...props
}) {
    return (
        <Switch
            {...props}
            checked={Boolean(checked)}
            readOnly={readOnly}
            onChange={(_, value) => {
                if (!readOnly) setChecked?.(value);
            }}
        />
    );
}
