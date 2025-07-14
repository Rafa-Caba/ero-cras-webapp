
export const capitalizarPalabra = (palabra: string) => {
    if (!palabra) return '';
    return palabra.charAt(0).toUpperCase() + palabra.slice(1).toLowerCase();
};