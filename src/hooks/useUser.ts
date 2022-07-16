import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const useUser = (uid: string) => {
  const { data, error } = useSWR(uid ? `/api/users/${uid}` : null, fetcher);
  return {
    data: data,
    error: error,
  };
};
