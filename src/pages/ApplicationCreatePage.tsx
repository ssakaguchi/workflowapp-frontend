import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createApplication } from "../api/applicationsApi";

export default function ApplicationCreatePage() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [titleError, setTitleError] = useState("");
  const [contentError, setContentError] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setTitleError("");
    setContentError("");
    setErrorMessage("");

    let hasError = false;

    if (!title.trim()) {
      setTitleError("タイトルを入力してください。");
      hasError = true;
    }

    if (!content.trim()) {
      setContentError("内容を入力してください。");
      hasError = true;
    }

    if (hasError) {
      return;
    }

    try {
      setIsSubmitting(true);

      await createApplication({
        title: title.trim(),
        content: content.trim(),
      });

      navigate(`/applications`);
    } catch (error) {
      setErrorMessage("申請の作成に失敗しました。");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h2>申請作成画面</h2>
      <div style={{ marginBottom: "16px" }}>
        <button
          type="button"
          onClick={() => navigate("/applications")}
          style={{ marginLeft: "8px" }}
        >
          一覧へ戻る
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "12px" }}>
          <label htmlFor="title" style={{ display: "block" }}>
            タイトル
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setTitleError("");
            }}
            style={{ width: "100%" }}
            disabled={isSubmitting}
            aria-invalid={!!titleError}
            aria-describedby={titleError ? "title-error" : undefined}
          />
          {titleError && <p id="title-error">{titleError}</p>}
        </div>

        <div style={{ marginBottom: "12px" }}>
          <label htmlFor="content" style={{ display: "block" }}>
            内容
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              setContentError("");
            }}
            rows={8}
            style={{ width: "100%", height: "100px" }}
            disabled={isSubmitting}
            aria-invalid={!!contentError}
            aria-describedby={contentError ? "content-error" : undefined}
          />
          {contentError && <p id="content-error">{contentError}</p>}
        </div>

        {errorMessage && <p role="alert">{errorMessage}</p>}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "申請中..." : "申請"}
        </button>
      </form>
    </div>
  );
}
