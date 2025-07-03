

interface Member {
    name: string;
    instrument: string;
    image: string;
    alt: string;
}

interface Props {
    members: Member[];
}

const MiembrosSection = ({ members }: Props) => {
    return (
        <div className="miembros w-100">
            <p className="text-center mb-1 fw-bolder fs-2">Integrantes</p>
            <div className="tarjetas w-100 d-flex flex-row flex-wrap justify-content-center">
                {members.map((member, idx) => (
                    <div className="contenedor_tarjeta" key={idx}>
                        <figure className="position-relative m-0">
                            <img className="frontal d-block" src={member.image} alt={member.alt} />
                            <figcaption className="trasera">
                                <h2 className="titulo fs-3">{member.name}</h2>
                                <hr />
                                <p className="fs-4 lh-sm">{member.instrument}</p>
                            </figcaption>
                        </figure>
                        <p className="text-center fw-bolder">{member.name}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MiembrosSection;
