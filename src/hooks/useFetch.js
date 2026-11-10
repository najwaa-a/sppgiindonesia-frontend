import { useCallback, useEffect, useState } from "react";

export function useFetch(fetcher, deps = []) {
  const [state, setState] = useState({ key: null, data: null, loading: true, error: null });
  const [tick, setTick] = useState(0);
  const requestKey = JSON.stringify([...deps, tick]);

  useEffect(() => {
    const controller = new AbortController();
    fetcher(controller.signal)
      .then((data) => setState({ key: requestKey, data, loading: false, error: null }))
      .catch((error) => {
        if (error.name !== "AbortError") {
          setState({ key: requestKey, data: null, loading: false, error: error.message });
        }
      });
    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, tick]);

  const retry = useCallback(() => setTick((current) => current + 1), []);
  const isCurrentRequest = state.key === requestKey;
  return {
    data: isCurrentRequest ? state.data : null,
    loading: !isCurrentRequest || state.loading,
    error: isCurrentRequest ? state.error : null,
    retry,
  };
}
