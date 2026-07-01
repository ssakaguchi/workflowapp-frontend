import { useEffect, useState } from "react";

import { getApprovers } from "../api/usersApi";
import type { Approver } from "../types/application";

export function useApprovers() {
  const [approvers, setApprovers] = useState<Approver[]>([]);
  const [approverError, setApproverError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const fetchApprovers = async () => {
      setApproverError("");

      try {
        const result = await getApprovers();
        if (cancelled) return;

        setApprovers(result);
      } catch {
        if (cancelled) return;

        setApproverError("承認者一覧の取得に失敗しました。");
      }
    };

    fetchApprovers();

    return () => {
      cancelled = true;
    };
  }, []);

  return {
    approvers,
    approverError,
    setApproverError,
  };
}
