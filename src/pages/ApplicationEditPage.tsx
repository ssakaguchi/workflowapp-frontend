import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Container, Stack, TextField, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

import useApplicationDetail from "../hooks/useApplicationDetail";
import useUpdateApplication from "../hooks/useUpdateApplication";
import {
  type ApplicationEditFormValues,
  applicationEditSchema,
} from "../schemas/applicationEditSchema";

export default function ApplicationEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [saveErrorMessage, setSaveErrorMessage] = useState("");
  const updateApplicationMutation = useUpdateApplication();
  const isSaving = updateApplicationMutation.isPending;
  const { application, isLoading, errorMessage } = useApplicationDetail(id);
  const initializedApplicationId = useRef<number | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ApplicationEditFormValues>({
    resolver: zodResolver(applicationEditSchema),
    defaultValues: {
      title: "",
      content: "",
    },
  });

  useEffect(() => {
    if (!application || initializedApplicationId.current === application.id) {
      return;
    }

    reset({
      title: application.title,
      content: application.content,
    });

    initializedApplicationId.current = application.id;
  }, [application, reset]);

  const onSubmit = async (values: ApplicationEditFormValues) => {
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

    if (!application) {
      setSaveErrorMessage(
        "申請の詳細を取得できていません。再読み込みしてください。",
      );
      return;
    }

    try {
      await updateApplicationMutation.mutateAsync({
        applicationId,
        request: values,
      });

      navigate(`/applications/${applicationId}`);
    } catch {
      setSaveErrorMessage("申請の更新に失敗しました。");
    }
  };

  const onInvalid = () => {
    setSaveErrorMessage("");
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
        <form onSubmit={handleSubmit(onSubmit, onInvalid)} noValidate>
          <Stack spacing={2}>
            <TextField
              label="タイトル"
              id="title"
              type="text"
              {...register("title")}
              disabled={isSaving}
              fullWidth
              error={Boolean(errors.title)}
              helperText={errors.title?.message}
            />

            <TextField
              label="内容"
              id="content"
              {...register("content")}
              multiline
              rows={5}
              fullWidth
              disabled={isSaving}
              error={Boolean(errors.content)}
              helperText={errors.content?.message}
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
