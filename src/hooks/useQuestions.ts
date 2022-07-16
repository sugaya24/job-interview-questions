import useSWR from 'swr';

export const useQuestions = (pageIndex: string) => {
  const fetcher = (url: RequestInfo) => fetch(url).then((res) => res.json());
  const { data, error, mutate } = useSWR(
    `/api/questions?page=${pageIndex}`,
    fetcher,
  );
  return {
    data,
    mutate,
    error,
  };
};
