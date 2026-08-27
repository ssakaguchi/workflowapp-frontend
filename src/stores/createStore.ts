import { useSyncExternalStore } from "react";

type StoreSnapshot<T> = {
  data: T;
  revision: number;
};

type Store<T> = {
  store: StoreSnapshot<T>;
  updateChanges: (nextData: T) => void;
};

/**
 * 汎用ストアを生成する
 * @returns ストアを操作するカスタムフック
 */
export const createStore = <T>(initialData: T): (() => Store<T>) => {
  let data: T = initialData;
  let listeners: (() => void)[] = [];
  let revision = 0;

  let cache: StoreSnapshot<T> = {
    data,
    revision,
  };

  /**
   * 現在のストアのスナップショットを取得する
   * @returns 現在のキャッシュされたストアの状態
   */
  const getSnapshot = (): StoreSnapshot<T> => {
    if (cache.revision !== revision) {
      cache = { data, revision };
    }

    return cache;
  };

  /**
   * リスナーを登録する
   * @param onStoreChange ストア変更時に呼び出されるコールバック
   * @returns 登録解除関数
   */
  const setListeners = (onStoreChange: () => void): (() => void) => {
    listeners = [...listeners, onStoreChange];

    return () => {
      listeners = listeners.filter((listener) => listener !== onStoreChange);
    };
  };

  /** 登録されたリスナーに変更を通知する */
  const notifyListeners = (): void => {
    listeners.forEach((listener) => {
      listener();
    });
  };

  /**
   * ストアのデータを更新し、リスナーに通知する
   * @param nextData 更新後のデータ
   */
  const updateChanges = (nextData: T): void => {
    data = nextData;
    revision += 1;
    notifyListeners();
  };

  /**
   * ストアを操作するカスタムフック
   * @returns 現在のストアと更新関数
   */
  return function useStore(): Store<T> {
    const currentData = useSyncExternalStore(setListeners, getSnapshot);

    return {
      store: currentData,
      updateChanges,
    };
  };
};
