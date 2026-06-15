import { Button, Container, Stack, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { createApplication } from "../api/applicationsApi";
import { getApprovers } from "../api/usersApi";
import ApproverSelectBox from "../components/users/ApproverSelectBox";
import type { Approver } from "../types/application";

export default function ApplicationCreatePage() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [titleError, setTitleError] = useState("");
  const [contentError, setContentError] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [approvers, setApprovers] = useState<Approver[]>([]);
  const [selectedApproverUserId, setSelectedApproverUserId] = useState<
    number | undefined
  >(undefined);
  const [approverError, setApproverError] = useState("");

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

    if (!selectedApproverUserId) {
      setApproverError("承認者を選択してください。");
      hasError = true;
    }

    const approverUserId = selectedApproverUserId;

    if (hasError || approverUserId === undefined) {
      return;
    }

    try {
      setIsSubmitting(true);

      await createApplication({
        title: title.trim(),
        content: content.trim(),
        approverUserId,
      });

      navigate(`/applications`);
    } catch {
      setErrorMessage("申請の作成に失敗しました。");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 承認者の一覧を取得してセレクトボックスに表示するための処理
  useEffect(() => {
    const fetchApprovers = async () => {
      try {
        const result = await getApprovers();
        setApprovers(result);
      } catch {
        setApproverError("承認者一覧の取得に失敗しました。");
      }
    };

    fetchApprovers();
  }, []);

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h5" component="h1" gutterBottom>
        申請作成画面
      </Typography>
      <Stack
        direction="row"
        spacing={1}
        sx={{ mb: 2 }}
        justifyContent="flex-end"
      >
        <Button
          type="button"
          variant="outlined"
          onClick={() => navigate("/applications")}
          sx={{ ml: 1 }}
          disabled={isSubmitting}
        >
          一覧へ戻る
        </Button>
      </Stack>

      <form onSubmit={handleSubmit} noValidate>
        <div style={{ marginBottom: "12px" }}>
          <TextField
            id="title"
            label="タイトル"
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setTitleError("");
            }}
            fullWidth
            disabled={isSubmitting}
            aria-invalid={!!titleError}
            aria-describedby={titleError ? "title-error" : undefined}
          />
          {titleError && <p id="title-error">{titleError}</p>}
        </div>

        <Stack spacing={2}>
          <TextField
            id="content"
            label="内容"
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              setContentError("");
            }}
            multiline
            rows={8}
            fullWidth
            disabled={isSubmitting}
            aria-invalid={!!contentError}
            aria-describedby={contentError ? "content-error" : undefined}
          />
          {contentError && <p id="content-error">{contentError}</p>}

          {errorMessage && <p role="alert">{errorMessage}</p>}

          {/* 承認者選択のセレクトボックスコンポーネント */}
          <ApproverSelectBox
            approvers={approvers}
            selectedApproverUserId={selectedApproverUserId}
            setSelectedApproverUserId={(userId) => {
              setSelectedApproverUserId(userId);
              setApproverError("");
            }}
            approverError={approverError}
          />
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            {isSubmitting ? "申請中..." : "申請"}
          </Button>
        </Stack>
      </form>
    </Container>
  );
}
