export const isServer = () => typeof window === 'undefined';
export const isBrowser = () => typeof window !== 'undefined';
