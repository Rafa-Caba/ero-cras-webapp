import type { JSONContent } from '@tiptap/react';

export interface Canto {
    _id?: string;
    titulo: string;
    texto: JSONContent;
    tipo: string;
    compositor: string;
}