import { Button, Container, Stack, TextField, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import useApplicationDetail from "../hooks/useApplicationDetail";
import useUpdateApplication from "../hooks/useUpdateApplication";

export default function ApplicationEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [saveErrorMessage, setSaveErrorMessage] = useState("");
  const updateApplicationMutation = useUpdateApplication();
  const isSaving = updateApplicationMutation.isPending;
  const { application, isLoading, errorMessage } = useApplicationDetail(id);
  const initializedApplicationId = useRef<number | null>(null);

  useEffect(() => {
    if (!application || initializedApplicationId.current === application.id) {
      return;
    }

    setTitle(application.title);
    setContent(application.content);
    initializedApplicationId.current = application.id;
  }, [application]);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaveErrorMessage("");

    if (!id) {
      setSaveErrorMessage("申請IDが指定されていません。");
      return;
    }

    const applicationId = Number(id);

    if (!application) {
      setSaveErrorMessage("申請IDが不正です。");
      return;
    }

    if (Number.isNaN(applicationId)) {
      setSaveErrorMessage("申請IDが不正です。");
      return;
    }

    if (!title.trim()) {
      setSaveErrorMessage("タイトルを入力してください。");
      return;
    }

    if (!content.trim()) {
      setSaveErrorMessage("内容を入力してください。");
      return;
    }

    try {
      await updateApplicationMutation.mutateAsync({
        applicationId: application.id,
        request: {
          title: title.trim(),
          content: content.trim(),
        },
      });

      navigate(`/applications/${applicationId}`);
    } catch {
      setSaveErrorMessage("申請の更新に失敗しました。");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h5" component="h1" gutterBottom>
        申請編集画面
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
        >
          一覧へ戻る
        </Button>
        {id && (
          <Button
            type="button"
            variant="outlined"
            onClick={() => navigate(`/applications/${id}`)}
          >
            詳細へ戻る
          </Button>
        )}
      </Stack>

      {isLoading && <p>読み込み中...</p>}

      {!isLoading && errorMessage && <p>{errorMessage}</p>}

      {!isLoading && !errorMessage && (
        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              label="タイトル"
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isSaving}
              fullWidth
            />

            <TextField
              label="内容"
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              multiline
              rows={5}
              fullWidth
              disabled={isSaving}
            />

            {saveErrorMessage && (
              <Typography color="error">{saveErrorMessage}</Typography>
            )}
            <Button variant="contained" type="submit" disabled={isSaving}>
              {isSaving ? "保存中..." : "保存"}
            </Button>
          </Stack>
        </form>
      )}
    </Container>
  );
}
