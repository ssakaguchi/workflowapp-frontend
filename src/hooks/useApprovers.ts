import { useEffect, useState } from "react";

import { getApprovers } from "../api/usersApi";
import type { Approver } from "../types/application";

export function useApprovers() {
  const [approvers, setApprovers] = useState<Approver[]>([]);
  const [approverError, setApproverError] = useState("");

  useEffect(() => {
    const fetchApprovers = async () => {
      try {
        const result = await getApprovers();
        setApprovers(result);
      } catch {
        setApproverError("承認者一覧の取得に失敗しました。");
      }
    };

    fetchApprovers();
  }, []);

  return {
    approvers,
    approverError,
    setApproverError,
  };
}
