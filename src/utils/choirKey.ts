export const CHOIR_KEY = 'eroc1';

export const withChoirKey = (url: string) => {
    return url.includes('?')
        ? `${url}&choirKey=${CHOIR_KEY}`
        : `${url}?choirKey=${CHOIR_KEY}`;
};