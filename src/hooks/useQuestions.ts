import useSWRInfinite from 'swr/infinite';

export const useQuestions = () => {
  const fetcher = (url: RequestInfo) => fetch(url).then((res) => res.json());
  const { data, error, mutate, size, setSize } = useSWRInfinite(
    (index) => `/api/questions?page=${index + 1}`,
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
