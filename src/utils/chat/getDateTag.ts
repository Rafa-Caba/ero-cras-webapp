import { format, isToday, isYesterday, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

export const getDateTag = (dateISO: string): string => {
    const fecha = parseISO(dateISO);

    if (isToday(fecha)) return 'Hoy';
    if (isYesterday(fecha)) return 'Ayer';

    return format(fecha, "EEEE d 'de' MMMM yyyy", { locale: es });
};
