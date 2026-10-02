"use client";

import { useId, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import {
    Box,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
} from "@mui/material";
import ArticlesButton from "./Button";

export default function ArticlesModal({
    show = true,
    setShow,
    action,
    actionText,
    closeAction,
    closeText,
    title,
    children,
    backdrop,
    disableClose,
    disableAction,
    className,
    modalClassName,
    centered,
    scrollable,
    size,
    actionVariant,
}) {
    const [showModal, setShowModal] = useState(true);
    const titleId = useId();

    return (
        <Dialog
            className={modalClassName}
            aria-labelledby={titleId}
            maxWidth={size || "md"}
            fullWidth
            open={Boolean(show && showModal)}
            scroll={scrollable === false ? "body" : "paper"}
            hideBackdrop={backdrop === false}
            disableEscapeKeyDown={disableClose}
            onClose={(_, reason) => {
                if (
                    disableClose ||
                    (backdrop === "static" && reason === "backdropClick")
                )
                    return;
                setShowModal(false);
            }}
            slotProps={{
                transition: { onExited: () => setShow(false) },
                paper:
                    centered === false
                        ? { sx: { alignSelf: "flex-start", mt: 4 } }
                        : undefined,
            }}
        >
            <DialogTitle id={titleId} sx={{ pr: disableClose ? 3 : 7 }}>
                {title || "Info"}
                {!disableClose && (
                    <IconButton
                        aria-label="Close dialog"
                        onClick={() => setShowModal(false)}
                        sx={{ position: "absolute", right: 8, top: 8 }}
                    >
                        <CloseIcon />
                    </IconButton>
                )}
            </DialogTitle>
            <DialogContent className={className}>
                {children || "..."}
            </DialogContent>
            <DialogActions sx={{ justifyContent: "space-between" }}>
                {!action && <Box />}
                <Box>
                    {(!disableClose || closeAction) && (
                        <ArticlesButton
                            variant="outline-dark"
                            onClick={() =>
                                closeAction
                                    ? closeAction()
                                    : setShowModal(false)
                            }
                        >
                            {closeText || "Close"}
                        </ArticlesButton>
                    )}
                </Box>
                {action && (
                    <ArticlesButton
                        variant={actionVariant || "articles"}
                        disabled={disableAction}
                        onClick={() => action(setShowModal)}
                    >
                        {actionText || "Continue"}
                    </ArticlesButton>
                )}
            </DialogActions>
        </Dialog>
    );
}
