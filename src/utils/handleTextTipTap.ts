import { type Dispatch, type SetStateAction } from 'react';

export function createHandleTextoChange<T extends object>(
    setState: React.Dispatch<React.SetStateAction<T | null>>,
    campo: keyof T
) {
    return (nuevoTexto: any) => {
        setState(prev => {
            if (!prev) return prev; // protege si aún es null
            return {
                ...prev,
                [campo]: nuevoTexto
            };
        });
    };
}

/**
 * Crea una función para actualizar parcial y de forma segura un formData (evitando null).
 */
export const createUpdateFormData = <T>() => {
    return (setFormData: Dispatch<SetStateAction<T | null>>) =>
        (changes: Partial<T>) => {
            setFormData(prev => (prev ? { ...prev, ...changes } : prev));
        };
};

/**
 * Extrae texto plano desde un JSONContent de TipTap (para previews o truncado).
 */
export const getTextFromTipTapJSON = (json: any, maxLength = 60): string => {
    const extractText = (node: any): string => {
        if (!node) return '';
        if (node.type === 'text') return node.text || '';
        if (!node.content) return '';
        return node.content.map(extractText).join('');
    };

    const text = extractText(json);
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
};
