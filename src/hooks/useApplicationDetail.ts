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
    let cancelled = false;

    const fetchApplication = async () => {
      setIsLoading(true);
      setErrorMessage("");
      setApplication(null);

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
        if (cancelled) return;

        setApplication(response);
      } catch {
        if (cancelled) return;

        setErrorMessage("申請の詳細を取得できませんでした。");
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    fetchApplication();

    return () => {
      cancelled = true;
    };
  }, [id]);

  return {
    application,
    isLoading,
    errorMessage,
    setApplication,
  };
}
