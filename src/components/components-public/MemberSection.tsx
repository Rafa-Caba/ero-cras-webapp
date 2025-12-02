import { useEffect } from "react";
import { Spinner } from "react-bootstrap";
import { useMemberStore } from "../../store/public/useMemberStore";

const MemberSection = () => {
    const { members, loading, fetchMembers } = useMemberStore();

    useEffect(() => {
        fetchMembers();
    }, []);

    if (loading) return <Spinner animation="border" role="status" className="d-block mx-auto my-5" />;

    return (
        <div className="miembros w-100">
            <p className="text-center mb-1 fw-bolder fs-2">Integrantes</p>
            <div className="tarjetas w-100 d-flex flex-row flex-wrap justify-content-center">
                {members?.length > 0 ? (
                    members.map((member) => (
                        <div className="contenedor_tarjeta" key={member.id}>
                            <figure className="position-relative m-0">
                                <img
                                    className="frontal d-block"
                                    src={member.imageUrl || '/images/default-user.png'}
                                    style={{
                                        width: 180,
                                        height: '100%'
                                    }}
                                    alt={member.name}
                                />
                                <figcaption className="trasera">
                                    <h2 className="titulo fs-3 mb-1 text-center">{member.name}</h2>
                                    <hr className="my-2" />
                                    <p className="fs-4 lh-sm mb-1">{member.instrument}</p>
                                    <p className="fs-4 lh-sm mb-0">
                                        {member.voice && 'Voz'}
                                    </p>
                                </figcaption>
                            </figure>
                            <p className="text-center fw-bolder">{member.name}</p>
                        </div>
                    ))
                ) : (
                    <p className="text-center w-100">No hay miembros por mostrar.</p>
                )}
            </div>
        </div>
    );
};

export default MemberSection;