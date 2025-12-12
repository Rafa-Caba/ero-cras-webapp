import { useEffect } from "react";
import { Spinner } from "react-bootstrap";
import { capitalizeWord } from "../../utils/capitalize";
import { useAuth } from "../../context/AuthContext";
import { useLogStore } from "../../store/admin/useLogStore";

export const MyProfile = () => {
    const { user } = useAuth();
    const { userLogs, fetchUserLogs, loading } = useLogStore();

    useEffect(() => {
        if (user?.id) {
            fetchUserLogs(user.id);
        }
    }, [user?.id]);

    return (
        <div className="my-profile mt-1">
            <div className="d-flex flex-row justify-content-between">
                <h2>📄 Mi Perfil</h2>
            </div>

            <div className="d-flex align-items-center gap-3 my-3">
                <img
                    src={user?.imageUrl || '/default-avatar.png'}
                    alt="Foto de perfil"
                    className="rounded-circle border"
                    style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                />
                <div>
                    <h4>{user?.name}</h4>
                    <p className="text-muted">@{user?.username}</p>
                </div>
            </div>

            <hr />

            <h5>📌 Información general</h5>
            <ul>
                <li><strong>Email:</strong> {user?.email}</li>
                <li><strong>Rol:</strong> {user?.role ? capitalizeWord(user.role) : 'No disponible'}</li>
                <li>
                    <strong>Instrumento:</strong>{' '}
                    {user?.instrumentLabel || user?.instrument || 'No especificado'}
                </li>
                <li>
                    <strong>Voz:</strong>{' '}
                    {user?.voice ? 'Sí' : 'No'}
                </li>
                <li>
                    <strong>🕓 Último acceso:</strong>{' '}
                    {user?.updatedAt
                        ? new Date(user.updatedAt).toLocaleString('es-MX', {
                            dateStyle: 'medium',
                            timeStyle: 'short'
                        })
                        : 'No registrado'}
                </li>
            </ul>

            <hr />

            <h5>🕓 Actividad reciente</h5>
            {loading ? (
                <div className="text-center my-3">
                    <Spinner animation="border" />
                </div>
            ) : userLogs.length === 0 ? (
                <p className="text-muted">No se encontraron actividades recientes.</p>
            ) : (
                <ul className="list-group mb-4">
                    {Array.isArray(userLogs) &&
                        userLogs.slice(0, 5).map(log => (
                            <li key={log.id} className="list-group-item">
                                <strong className="text-primary">{capitalizeWord(log.action)}</strong> en{' '}
                                <em>{capitalizeWord(log.collectionName)}</em>{' '}
                                {log.referenceId && (
                                    <span className="text-muted"> (ID: {log.referenceId})</span>
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