import useSWRInfinite from 'swr/infinite';

export const useQuestions = (tags?: string[] | undefined) => {
  const fetcher = (url: RequestInfo) => fetch(url).then((res) => res.json());
  const { data, error, mutate, size, setSize } = useSWRInfinite(
    (index) =>
      tags
        ? `/api/questions?page=${index + 1}&` +
          new URLSearchParams(tags.map((tag) => ['tag', tag])).toString()
        : `/api/questions?page=${index + 1}`,
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
