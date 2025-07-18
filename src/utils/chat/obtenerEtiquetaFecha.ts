import { format, isToday, isYesterday, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

export const obtenerEtiquetaFecha = (fechaISO: string): string => {
    const fecha = parseISO(fechaISO);

    if (isToday(fecha)) return 'Hoy';
    if (isYesterday(fecha)) return 'Ayer';

    return format(fecha, "EEEE d 'de' MMMM yyyy", { locale: es });
};
