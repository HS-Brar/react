import { Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";
import React, { useCallback } from "react";
import CloseIcon from "@mui/icons-material/Close";

export default function Popup(props) {
  const { title, children, openPopup, setOpenPopup, popupWidth, showCloseButton, onClose } = props;

  const handleClose = useCallback(() => {
    setOpenPopup(false);
    if (onClose) {
      onClose();
    }
  }, [setOpenPopup, onClose]);

  return (
    <Dialog open={openPopup} fullWidth maxWidth={popupWidth} onClose={handleClose}>
      <DialogTitle sx={{ backgroundColor: "lightblue", fontWeight: "bold", fontSize: "22px" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          {title}
          {showCloseButton && (
            <IconButton
              aria-label="close"
              onClick={handleClose}
              sx={{ position: "absolute", top: 8, right: 8 }}
            >
              <CloseIcon />
            </IconButton>
          )}
        </div>
      </DialogTitle>
      <DialogContent>{children}</DialogContent>
    </Dialog>
  );
}
