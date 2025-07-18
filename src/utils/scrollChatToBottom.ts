
export const scrollChatToBottom = (container: HTMLDivElement | null) => {
    if (!container) return;

    const imagenes = container.querySelectorAll('img');

    if (imagenes.length === 0) {
        container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
        return;
    }

    let cargadas = 0;
    let seHizoScroll = false;

    const contar = () => {
        cargadas++;
        if (cargadas === imagenes.length && !seHizoScroll) {
            seHizoScroll = true;
            container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
        }
    };

    imagenes.forEach((img) => {
        if (img.complete) {
            contar();
        } else {
            img.addEventListener('load', contar, { once: true });
            img.addEventListener('error', contar, { once: true });
        }
    });

    // Backup scroll por si alguna imagen nunca carga (timeout de 3 segundos)
    setTimeout(() => {
        if (!seHizoScroll) {
            container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
        }
    }, 5000);
};
