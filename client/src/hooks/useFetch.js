import { useEffect, useState } from "react";

export default function useFetch(fetcher, dependencies = []) {
  const [state, setState] = useState({ data: null, loading: true, error: null });

  useEffect(() => {
    let active = true;

    async function run() {
      setState((current) => ({ ...current, loading: true }));
      try {
        const data = await fetcher();
        if (active) setState({ data, loading: false, error: null });
      } catch (error) {
        if (active) setState({ data: null, loading: false, error });
      }
    }

    run();
    return () => {
      active = false;
    };
  }, dependencies);

  return state;
}
