import { useEffect, useState } from "react";

import { getApprovers } from "../api/usersApi";
import type { Approver } from "../types/application";

export function useApprovers() {
  const [approvers, setApprovers] = useState<Approver[]>([]);

  useEffect(() => {
    const fetchApprovers = async () => {
      try {
        const response = await getApprovers();
        setApprovers(response);
      } catch (error) {
        console.error("承認者の取得に失敗しました:", error);
      }
    };

    fetchApprovers();
  }, []);

  return approvers;
}
