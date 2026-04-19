import { useEffect, useState } from "react";
import { getApplications } from "../api/applicationsApi";
import type { ApplicationListItem } from "../types/application";

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
      <h1>申請一覧</h1>

      {isLoading && <p>読み込み中...</p>}

      {!isLoading && errorMessage && <p>{errorMessage}</p>}

      {!isLoading && !errorMessage && applications.length === 0 && (
        <p>申請データがありません。</p>
      )}

      {!isLoading && !errorMessage && applications.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>タイトル</th>
              <th>作成日時</th>
              <th>更新日時</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((application) => (
              <tr key={application.id}>
                <td>{application.id}</td>
                <td>{application.title}</td>
                <td>{application.createdAt}</td>
                <td>{application.updatedAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
