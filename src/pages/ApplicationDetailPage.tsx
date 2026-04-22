import { useParams } from "react-router-dom";
import type { ApplicationDetail } from "../types/application";
import { useEffect, useState } from "react";
import { getApplicationById } from "../api/applicationsApi";

export default function ApplicationDetailPage() {
  const { id } = useParams();
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
      } catch (error) {
        setErrorMessage("申請の詳細を取得できませんでした。");
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplication();
  }, [id]);

  return (
    <div>
      <h2>申請詳細画面</h2>
      {isLoading && <p>読み込み中...</p>}

      {!isLoading && errorMessage && <p>{errorMessage}</p>}

      {!isLoading && !errorMessage && application && (
        <div>
          <p>
            <strong>ID:</strong> {application.id}
          </p>
          <p>
            <strong>タイトル:</strong> {application.title}
          </p>
          <p>
            <strong>内容:</strong> {application.content}
          </p>
          <p>
            <strong>作成日時:</strong> {application.createdAt}
          </p>
          <p>
            <strong>更新日時:</strong> {application.updatedAt}
          </p>
        </div>
      )}
    </div>
  );
}
