import { Question } from '@/common';
import useSWR from 'swr';

export const useQuestion = (id: string) => {
  const fetcher = (url: RequestInfo) => fetch(url).then((res) => res.json());
  const { data, error, mutate } = useSWR<{
    success: boolean;
    question: Question & { createdAt: Date; updatedAt: Date };
  }>(id ? `/api/questions/${id}` : null, fetcher);
  return {
    data,
    error,
    mutate,
    isLoading: !error && !data,
  };
};
