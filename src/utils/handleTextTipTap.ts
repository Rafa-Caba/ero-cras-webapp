import { type Dispatch, type SetStateAction } from 'react';
import type { JSONContent } from '@tiptap/react';

export function createHandleTextoChange<T extends object>(
    setState: React.Dispatch<React.SetStateAction<T | null>>,
    key: keyof T
) {
    return (value: any) => {
        setState((prev) => {
            if (!prev) {
                return { [key]: value } as T;
            }
            return {
                ...prev,
                [key]: value
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


export const parseTexto = (texto: any): JSONContent => {
    if (typeof texto === 'string') {
        try {
            const parsed = JSON.parse(texto);
            if (isValidTipTapContent(parsed)) return parsed;
        } catch {
            return { type: 'doc', content: [] };
        }
    }
    return isValidTipTapContent(texto) ? texto : { type: 'doc', content: [] };
};


export const isValidTipTapContent = (json: any): json is JSONContent => {
    return json && typeof json === 'object' && json.type === 'doc' && Array.isArray(json.content);
};