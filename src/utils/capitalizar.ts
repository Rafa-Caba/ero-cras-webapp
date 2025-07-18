
export const capitalizarPalabra = (palabra: string) => {
    if (!palabra) return '';
    return palabra.charAt(0).toUpperCase() + palabra.slice(1).toLowerCase();
};

// Returns first name + first initial capitalized
export const formatearNombre = (nombreCompleto: string): string => {
    if (!nombreCompleto) return '';

    const partes = nombreCompleto.trim().split(' '); // divide por espacios

    const primerNombre = partes[0];
    const inicialSegundo = partes[1]?.charAt(0).toUpperCase() || '';

    return `${primerNombre} ${inicialSegundo ? inicialSegundo + '.' : ''}`;
};