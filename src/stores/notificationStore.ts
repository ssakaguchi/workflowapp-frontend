import { createStore } from "./createStore";

export type AppNotification = {
  message: string;
  severity: "success" | "info" | "warning" | "error";
};

export const useNotificationStore = createStore<AppNotification | undefined>(
  undefined,
);
