import { ParsedUrlQuery, encode } from 'querystring';
import useSWRInfinite from 'swr/infinite';

export const useQuestions = (query?: ParsedUrlQuery) => {
  const q = new URLSearchParams(encode(query)).toString();
  const fetcher = (url: RequestInfo) => fetch(url).then((res) => res.json());
  const { data, error, mutate, size, setSize } = useSWRInfinite(
    (index) => `/api/questions?page=${index + 1}&=${q}`,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateFirstPage: false,
    },
  );
  return {
    data,
    mutate,
    error,
    size,
    setSize,
  };
};
