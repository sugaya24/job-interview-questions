import useSWR from 'swr';

export const useQuestions = () => {
  const fetcher = (url: RequestInfo) => fetch(url).then((res) => res.json());
  const { data, error, mutate } = useSWR(`/api/questions`, fetcher);
  return {
    data,
    mutate,
    error,
  };
};
