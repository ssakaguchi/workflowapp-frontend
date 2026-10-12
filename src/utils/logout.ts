import { queryClient } from "../lib/queryClient";
import { applicationDraftStorage } from "./applicationDraftStorage";
import { applicationListViewStorage } from "./applicationListViewStorage";
import { applicationSearchTermStorage } from "./applicationSearchTermStorage";
import { applicationStatusFilterStorage } from "./applicationStatusFilterStorage";
import { removeToken } from "./auth";
import { roleStorage } from "./roleStorage";

// ログアウト処理を行う関数
export const logout = () => {
  removeToken();
  roleStorage.remove();

  applicationDraftStorage.remove();
  applicationListViewStorage.remove();
  applicationSearchTermStorage.remove();
  applicationStatusFilterStorage.remove();

  queryClient.clear();
};
