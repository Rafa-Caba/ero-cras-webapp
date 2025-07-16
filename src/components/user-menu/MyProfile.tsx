import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useLogsStore } from "../../store/admin/useLogsStore";
import { Spinner } from "react-bootstrap";
import { capitalizarPalabra } from "../../utils";

export const MyProfile = () => {
    const { user } = useAuth();
    const { logsPorUsuario, fetchLogsPorUsuario, cargando } = useLogsStore();

    useEffect(() => {
        if (user?._id) {
            fetchLogsPorUsuario(user._id);
        }
    }, [user?._id]);

    return (
        <div className="my-profile mt-1">
            <div className="d-flex flex-row justify-content-between">
                <h2>📄 Mi Perfil</h2>
                <Link to="/admin" className="btn general_btn mb-4">Ir al Inicio</Link>
            </div>

            <div className="d-flex align-items-center gap-3 my-3">
                <img
                    src={user?.fotoPerfilUrl || '/default-avatar.png'}
                    alt="Foto de perfil"
                    className="rounded-circle border"
                    style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                />
                <div>
                    <h4>{user?.nombre}</h4>
                    <p className="text-muted">@{user?.username}</p>
                </div>
            </div>

            <hr />

            <h5>📌 Información general</h5>
            <ul>
                <li><strong>Email:</strong> {user?.correo}</li>
                <li><strong>Rol:</strong> {user?.rol ? capitalizarPalabra(user.rol) : 'No disponible'}</li>
                <li>
                    <strong>🎨 Tema Personalizado:</strong>{' '}
                    {user?.themePersonal ? (
                        <span>{typeof user.themePersonal === 'object' ? user.themePersonal.nombre : 'ID: ' + user.themePersonal}</span>
                    ) : (
                        'No seleccionado'
                    )}
                </li>
                <li>
                    <strong>🕓 Último acceso:</strong>{' '}
                    {user?.ultimoAcceso
                        ? new Date(user.ultimoAcceso).toLocaleString('es-MX', {
                            dateStyle: 'medium',
                            timeStyle: 'short'
                        })
                        : 'No registrado'}
                </li>
            </ul>

            <hr />

            <h5>🕓 Actividad reciente</h5>
            {cargando ? (
                <div className="text-center my-3">
                    <Spinner animation="border" />
                </div>
            ) : logsPorUsuario.length === 0 ? (
                <p className="text-muted">No se encontraron actividades recientes.</p>
            ) : (
                <ul className="list-group mb-4">
                    {Array.isArray(logsPorUsuario) &&
                        logsPorUsuario.slice(0, 5).map(log => (
                            <li key={log._id} className="list-group-item">
                                <strong className="text-primary">{capitalizarPalabra(log.accion)}</strong> en{' '}
                                <em>{capitalizarPalabra(log.coleccion)}</em>{' '}
                                {log.referenciaId && (
                                    <span className="text-muted"> (ID: {log.referenciaId})</span>
                                )}
                                <br />
                                <small className="text-muted">
                                    {new Date(log.createdAt).toLocaleString('es-MX', {
                                        dateStyle: 'medium',
                                        timeStyle: 'short'
                                    })}
                                </small>
                            </li>
                        ))}
                </ul>
            )}
        </div>
    );
};