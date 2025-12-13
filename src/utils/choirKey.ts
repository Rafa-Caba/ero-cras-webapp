export const DEFAULT_CHOIR_KEY = 'eroc1';

const getChoirKeyFromPath = (): string | null => {
    if (typeof window === 'undefined') return null;

    const path = window.location.pathname || '/';
    const match = path.match(/^\/([^/?#]+)/);
    const segment = match && match[1] ? match[1] : '';

    if (!segment || segment === 'admin' || segment === 'auth') {
        return null;
    }

    return segment;
};

export const withChoirKey = (url: string): string => {
    const choirKey = getChoirKeyFromPath() || DEFAULT_CHOIR_KEY;

    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}choirKey=${encodeURIComponent(choirKey)}`;
};
