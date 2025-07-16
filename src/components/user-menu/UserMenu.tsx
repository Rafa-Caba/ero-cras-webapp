import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';
import { useAuth } from '../../hooks/useAuth';

import { useThemeGroupsStore } from '../../store/admin/useThemeGroupsStore';
import { ThemeSelectorModal } from './ThemeSelectorModal';
import type { ThemeGroup } from '../../types';
import Swal from 'sweetalert2';
import { useUsuariosStore } from '../../store/admin/useUsuariosStore';

export const UserMenu = () => {
    const navigate = useNavigate();
    const { user, updateUser, logout } = useAuth();
    const { actualizarTemaPersonal } = useUsuariosStore();
    const { grupos } = useThemeGroupsStore();

    const [mostrarModal, setMostrarModal] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/admin/login');
    };

    const handleSeleccionarTema = async (grupo: ThemeGroup) => {
        try {
            if (!grupo?._id || !user?._id) return;

            const actualizado = await actualizarTemaPersonal(user._id, grupo._id);

            if (!actualizado) {
                Swal.fire('Error', 'No se pudo guardar el tema. Intenta más tarde.', 'error');
                return;
            }

            updateUser(actualizado);

            setMostrarModal(false);
            Swal.fire('¡Tema aplicado!', `Se ha guardado tu preferencia de tema`, 'success');
        } catch (error) {
            console.error('Error al guardar tema personal:', error);
            Swal.fire('Error', 'No se pudo guardar el tema. Intenta más tarde.', 'error');
        }
    };

    return (
        <>
            <Dropdown align="end">
                <Dropdown.Toggle
                    variant="light"
                    id="dropdown-user"
                    className="rounded-circle p-0 border-0 d-flex align-items-center justify-content-center"
                    style={{ width: '42px', height: '42px', overflow: 'hidden' }}
                >
                    <img
                        src={user?.fotoPerfilUrl || '/default-avatar.png'}
                        alt="Perfil"
                        className="rounded-circle"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                </Dropdown.Toggle>

                <Dropdown.Menu>
                    <Dropdown.Header>👋 ¡Hola, {user?.nombre?.split(' ')[0]}!</Dropdown.Header>

                    <Dropdown.Item onClick={() => navigate('/admin')}>
                        Ir a Inicio
                    </Dropdown.Item>

                    <Dropdown.Item onClick={() => navigate('/admin/settings-user')}>
                        👤 Ajustes de usuario
                    </Dropdown.Item>

                    <Dropdown.Item onClick={() => navigate('/admin/mi-perfil')}>
                        📄 Ver mi perfil
                    </Dropdown.Item>

                    <Dropdown.Item
                        onClick={() => {
                            if (user?._id) {
                                setMostrarModal(true);
                            } else {
                                Swal.fire('Usuario no disponible', 'No se puede cambiar el tema en este momento.', 'warning');
                            }
                        }}
                    >
                        🎨 Cambiar tema del admin
                    </Dropdown.Item>

                    <Dropdown.Item onClick={() => navigate('/admin/public-test')}>
                        🧪 Entorno de pruebas
                    </Dropdown.Item>

                    <Dropdown.Divider />

                    <Dropdown.Item onClick={handleLogout} className="text-danger">
                        🚪 Cerrar sesión
                    </Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>

            {/* Modal para seleccionar tema */}
            <ThemeSelectorModal
                show={mostrarModal}
                onClose={() => setMostrarModal(false)}
                themeGroups={grupos}
                onSelect={handleSeleccionarTema}
            />
        </>
    );
};