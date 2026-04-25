import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getApplicationById, updateApplication } from "../api/applicationsApi";

export default function ApplicationEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [saveErrorMessage, setSaveErrorMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchApplication = async () => {
      if (!id) {
        setErrorMessage("申請IDが指定されていません。");
        setIsLoading(false);
        return;
      }

      const applicationId = Number(id);

      if (Number.isNaN(applicationId)) {
        setErrorMessage("申請IDが不正です。");
        setIsLoading(false);
        return;
      }

      try {
        const application = await getApplicationById(applicationId);
        setTitle(application.title);
        setContent(application.content);
      } catch (error) {
        setErrorMessage("申請の詳細を取得できませんでした。");
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplication();
  }, [id]);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaveErrorMessage("");

    if (!id) {
      setSaveErrorMessage("申請IDが指定されていません。");
      return;
    }

    const applicationId = Number(id);

    if (Number.isNaN(applicationId)) {
      setSaveErrorMessage("申請IDが不正です。");
      return;
    }

    if (!title.trim()) {
      setSaveErrorMessage("タイトルは入力してください。");
      return;
    }

    if (!content.trim()) {
      setSaveErrorMessage("内容は入力してください。");
      return;
    }

    try {
      setIsSaving(true);

      await updateApplication(applicationId, {
        title: title.trim(),
        content: content.trim(),
      });

      navigate(`/applications/${applicationId}`);
    } catch (error) {
      setSaveErrorMessage("申請の更新に失敗しました。");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <h2>申請編集画面</h2>
      <div style={{ marginBottom: "16px" }}>
        <button
          type="button"
          onClick={() => navigate("/applications")}
          style={{ marginLeft: "8px" }}
        >
          一覧へ戻る
        </button>
        {id && (
          <button type="button" onClick={() => navigate(`/applications/${id}`)}>
            詳細へ戻る
          </button>
        )}
      </div>
      {isLoading && <p>読み込み中...</p>}

      {!isLoading && errorMessage && <p>{errorMessage}</p>}

      {!isLoading && !errorMessage && (
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "12px" }}>
            <label htmlFor="title" style={{ display: "block" }}>
              タイトル
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{ width: "100%" }}
              disabled={isSaving}
            />
          </div>

          <div style={{ marginBottom: "12px" }}>
            <label htmlFor="content" style={{ display: "block" }}>
              内容
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={8}
              style={{ width: "100%", height: "100px" }}
              disabled={isSaving}
            />
          </div>

          {saveErrorMessage && <p>{saveErrorMessage}</p>}

          <button type="submit" disabled={isSaving}>
            {isSaving ? "保存中..." : "保存"}
          </button>
        </form>
      )}
    </div>
  );
}
