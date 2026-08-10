import { Button, Container, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import ApproverSelectBox from "../components/users/ApproverSelectBox";
import { useApprovers } from "../hooks/useApprovers";
import useCreateApplication from "../hooks/useCreateApplication";

export default function ApplicationCreatePage() {
  const navigate = useNavigate();
  const { data: approvers = [], isError: isApproversError } = useApprovers();
  const [approverValidationError, setApproverValidationError] = useState("");
  const approverFetchError = isApproversError
    ? "承認者一覧の取得に失敗しました。"
    : "";
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [titleError, setTitleError] = useState("");
  const [contentError, setContentError] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [selectedApproverUserId, setSelectedApproverUserId] = useState<
    number | undefined
  >(undefined);

  const createApplicationMutation = useCreateApplication();

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
      setApproverValidationError("承認者を選択してください。");
      hasError = true;
    }

    const approverUserId = selectedApproverUserId;

    if (hasError || approverUserId === undefined) {
      return;
    }

    try {
      await createApplicationMutation.mutateAsync({
        title: title.trim(),
        content: content.trim(),
        approverUserId,
      });

      navigate(`/applications`);
    } catch {
      setErrorMessage("申請の作成に失敗しました。");
    }
  };

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
          disabled={createApplicationMutation.isPending}
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
            disabled={createApplicationMutation.isPending}
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
            disabled={createApplicationMutation.isPending}
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
              setApproverValidationError("");
            }}
            approverError={approverFetchError || approverValidationError}
            disabled={createApplicationMutation.isPending}
          />
          <Button
            type="submit"
            variant="contained"
            disabled={createApplicationMutation.isPending}
          >
            {createApplicationMutation.isPending ? "申請中..." : "申請"}
          </Button>
        </Stack>
      </form>
    </Container>
  );
}
