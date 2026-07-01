import { useEffect, useState } from "react";

import { getApplicationById } from "../api/applicationsApi";
import type { ApplicationDetail } from "../types/application";

export default function useApplicationDetail(id: string | undefined) {
  const [application, setApplication] = useState<ApplicationDetail | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchApplication = async () => {
      if (!id) {
        setErrorMessage("申請IDが見つかりません。");
        setIsLoading(false);
        return;
      }

      const applicationId = Number(id);

      if (isNaN(applicationId)) {
        setErrorMessage("申請IDが不正です。");
        setIsLoading(false);
        return;
      }

      try {
        const response = await getApplicationById(applicationId);
        setApplication(response);
      } catch {
        setErrorMessage("申請の詳細を取得できませんでした。");
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplication();
  }, [id]);

  return {
    application,
    isLoading,
    errorMessage,
    setApplication,
  };
}
