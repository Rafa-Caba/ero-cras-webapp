import MiembrosSection from "../../components-public/MiembrosSection"

interface Member {
    name: string;
    instrument: string;
    image: string;
    alt: string;
}

const miembros: Member[] = [
    { name: 'Rafael Cabanillas', instrument: 'Guitarra y voz', image: '/images_members/rafa.jpg', alt: 'Rafael' },
    { name: 'Carito Dominguez', instrument: 'Voz', image: '/images_members/carito.jpg', alt: 'Carito' },
    { name: 'Lupita Dominguez', instrument: 'Voz y pandero', image: '/images_members/lupe.png', alt: 'Lupita' },
    { name: 'Mariana Herrera', instrument: 'Voz', image: '/images_members/mariana.png', alt: 'Mariana' },
    { name: 'Angel Dominguez', instrument: 'Guitarra y voz', image: '/images_members/angelito.png', alt: 'Angelito' },
    { name: 'Daniela Marquez', instrument: 'Mandolina y voz', image: '/images_members/daniela.png', alt: 'Daniela' },
    { name: 'Alan Piña', instrument: 'Guitarra y voz', image: '/images_members/alan-2.png', alt: 'Alan' },
    { name: 'María Cisneros', instrument: 'Mandolina y Voz', image: '/images_members/maria.jpg', alt: 'María' },
    { name: 'Daniel Glez', instrument: 'Voz', image: '/images_members/daniel.png', alt: 'Daniel' },
    { name: 'Antonio Arias', instrument: 'Mandolina y voz', image: '/images_members/tonito.png', alt: 'Tonito' },
];

const Miembros = () => {
    return (
        <MiembrosSection members={miembros} />
    )
}

export default Miembros