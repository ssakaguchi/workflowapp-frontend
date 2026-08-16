import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Container, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import ApproverSelectBox from "../components/users/ApproverSelectBox";
import { useApprovers } from "../hooks/useApprovers";
import useCreateApplication from "../hooks/useCreateApplication";
import {
  type ApplicationCreateFormValues,
  applicationCreateSchema,
} from "../schemas/applicationCreateSchema";

export default function ApplicationCreatePage() {
  const navigate = useNavigate();
  const { data: approvers = [], isError: isApproversError } = useApprovers();
  const [errorMessage, setErrorMessage] = useState("");
  const approverFetchError = isApproversError
    ? "承認者一覧の取得に失敗しました。"
    : "";
  const createApplicationMutation = useCreateApplication();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ApplicationCreateFormValues>({
    resolver: zodResolver(applicationCreateSchema),
    defaultValues: {
      title: "",
      content: "",
      approverUserId: undefined,
    },
  });

  const onSubmit = async (values: ApplicationCreateFormValues) => {
    setErrorMessage("");

    try {
      await createApplicationMutation.mutateAsync(values);
      navigate(`/applications`);
    } catch {
      setErrorMessage("申請の作成に失敗しました。");
    }
  };

  const onInvalid = () => {
    setErrorMessage("");
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

      <form onSubmit={handleSubmit(onSubmit, onInvalid)} noValidate>
        <div style={{ marginBottom: "12px" }}>
          <TextField
            id="title"
            label="タイトル"
            type="text"
            {...register("title")}
            fullWidth
            disabled={createApplicationMutation.isPending}
            error={Boolean(errors.title)}
            helperText={errors.title?.message}
          />
        </div>

        <Stack spacing={2}>
          <TextField
            id="content"
            label="内容"
            {...register("content")}
            multiline
            rows={8}
            fullWidth
            disabled={createApplicationMutation.isPending}
            error={Boolean(errors.content)}
            helperText={errors.content?.message}
          />

          {errorMessage && <p role="alert">{errorMessage}</p>}

          {/* 承認者選択のセレクトボックスコンポーネント */}
          <Controller
            name="approverUserId"
            control={control}
            render={({ field, fieldState }) => (
              <ApproverSelectBox
                approvers={approvers}
                selectedApproverUserId={field.value}
                setSelectedApproverUserId={field.onChange}
                approverError={
                  approverFetchError || fieldState.error?.message || ""
                }
                disabled={createApplicationMutation.isPending}
              />
            )}
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
