import { useEffect, useState } from "react";
import { getApplications } from "../api/applicationsApi";
import type { ApplicationListItem } from "../types/application";
import { ApplicationListTable } from "../components/applications/ApplicationListTable";

export function ApplicationListPage() {
  const [applications, setApplications] = useState<ApplicationListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await getApplications();
        setApplications(response);
      } catch (error) {
        setErrorMessage("申請一覧の取得に失敗しました。");
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplications();
  }, []);

  return (
    <div>
      <h2>申請一覧</h2>

      {isLoading && <p>読み込み中...</p>}

      {!isLoading && errorMessage && <p>{errorMessage}</p>}

      {!isLoading && !errorMessage && applications.length === 0 && (
        <p>申請データがありません。</p>
      )}

      {!isLoading && !errorMessage && applications.length > 0 && (
        <ApplicationListTable applications={applications} />
      )}
    </div>
  );
}
