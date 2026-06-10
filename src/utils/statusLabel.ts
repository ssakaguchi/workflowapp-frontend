export const statusLabel = (status: string): string => {
  switch (status) {
    case "Pending":
      return "申請中";
    case "Approved":
      return "承認済み";
    case "Rejected":
      return "却下";
    default:
      return status;
  }
};
