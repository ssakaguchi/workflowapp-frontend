import { useEffect, useState } from "react";
import { deleteApplication, getApplications } from "../api/applicationsApi";
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

  const handleDelete = async (id: number) => {
    // エラーメッセージをリセット
    setErrorMessage("");

    // 削除の確認
    const confirmed = window.confirm("本当に削除しますか？");

    if (!confirmed) {
      return;
    }

    // idが数値でない場合は処理を中断
    if (!Number.isFinite(id)) {
      setErrorMessage("削除対象の申請IDが不正です。");
      return;
    }

    try {
      await deleteApplication(id);

      setApplications((current) => current.filter((app) => app.id !== id));
    } catch (error) {
      setErrorMessage("申請の削除に失敗しました。");
    }
  };

  return (
    <div>
      <h2>申請一覧</h2>

      {isLoading && <p>読み込み中...</p>}

      {!isLoading && errorMessage && <p>{errorMessage}</p>}

      {!isLoading && !errorMessage && applications.length === 0 && (
        <p>申請データがありません。</p>
      )}

      {!isLoading && applications.length > 0 && (
        <ApplicationListTable
          applications={applications}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
