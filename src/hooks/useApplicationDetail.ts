import { useQuery } from "@tanstack/react-query";

import { getApplicationById } from "../api/applicationsApi";
import { applicationQueryKeys } from "../queries/applicationQueryKeys";

// 申請IDを解析する関数
function parseApplicationId(id: string | undefined): number | null {
  if (!id) {
    return null;
  }

  const applicationId = Number(id);

  if (!Number.isInteger(applicationId) || applicationId <= 0) {
    return null;
  }

  return applicationId;
}

export default function useApplicationDetail(id: string | undefined) {
  const applicationId = parseApplicationId(id);
  const query = useQuery({
    queryKey: applicationQueryKeys.detail(applicationId ?? 0),
    queryFn: () => getApplicationById(applicationId!),
    enabled: applicationId !== null,
  });

  let errorMessage = "";

  if (!id) {
    errorMessage = "申請IDが見つかりません。";
  } else if (applicationId === null) {
    errorMessage = "申請IDが不正です。";
  } else if (query.isError) {
    errorMessage = "申請の詳細を取得できませんでした。";
  }

  return {
    application: query.data,
    isLoading: query.isLoading,
    errorMessage,
  };
}
