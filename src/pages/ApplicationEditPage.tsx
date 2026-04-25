import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getApplicationById } from "../api/applicationsApi";

export default function ApplicationEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

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

  return (
    <div>
      <h2>申請編集画面</h2>
      {/* <p>申請ID: {id}</p> */}
      <div style={{ marginBottom: "16px" }}>
        <button
          type="button"
          onClick={() => navigate("/applications")}
          style={{ marginLeft: "8px" }}
        >
          一覧へ戻る
        </button>
        {id && <button type="button">詳細へ戻る</button>}

        {isLoading && <p>読み込み中...</p>}

        {!isLoading && errorMessage && <p>{errorMessage}</p>}

        {!isLoading && !errorMessage && (
          <form>
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
              />
            </div>

            <button type="submit" disabled>
              保存
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
