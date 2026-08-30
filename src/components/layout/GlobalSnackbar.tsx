import { Alert, Snackbar } from "@mui/material";

import { useNotificationStore } from "../../stores/notificationStore";

export default function GlobalSnackbar() {
  const { store, updateChanges } = useNotificationStore();
  const notification = store.data;

  const handleClose = () => {
    updateChanges(undefined);
  };

  return (
    <Snackbar
      open={notification !== undefined}
      autoHideDuration={3000}
      onClose={handleClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "center",
      }}
    >
      {notification ? (
        <Alert
          severity={notification.severity}
          onClose={handleClose}
          variant="filled"
        >
          {notification.message}
        </Alert>
      ) : undefined}
    </Snackbar>
  );
}
