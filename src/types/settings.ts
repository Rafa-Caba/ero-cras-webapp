import type { JSONContent } from '@tiptap/react';

export interface Setting {
    _id: string;
    tituloWeb: string;
    socialLinks: {
        facebook: string;
        instagram: string;
        youtube: string;
        whatsapp: string;
        correo: string;
    };
    leyendasInicio: {
        principal: string;
        secundaria: string;
    };
    historiaNosotros: JSONContent;
    telefonoContacto: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface SettingsUpdateResponse {
    ok: boolean;
    mensaje: string;
    settingActualizado?: Setting;
}
