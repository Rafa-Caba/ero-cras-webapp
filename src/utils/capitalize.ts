export const capitalizeWord = (word: string) => {
    if (!word) return '';
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
};

export const formatName = (fullName: string): string => {
    if (!fullName) return '';

    const parts = fullName.trim().split(' ');

    const firstName = parts[0];
    const secondInitial = parts[1]?.charAt(0).toUpperCase() || '';

    return `${firstName} ${secondInitial ? secondInitial + '.' : ''}`;
};