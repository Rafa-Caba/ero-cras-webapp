import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';
import { useAuth } from '../../hooks/useAuth';

import { useThemeGroupsStore } from '../../store/admin/useThemeGroupsStore';
import { ThemeSelectorModal } from './ThemeSelectorModal';
import type { ThemeGroup } from '../../types';
import Swal from 'sweetalert2';

export const UserMenu = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const { grupos, activarGrupo } = useThemeGroupsStore();

    const [mostrarModal, setMostrarModal] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/admin/login');
    };

    const handleSeleccionarTema = async (grupo: ThemeGroup) => {
        try {
            if (!grupo?._id) return console.warn('Grupo inválido');
            await activarGrupo(grupo._id);
            setMostrarModal(false);
            Swal.fire('¡Tema aplicado!', `El tema "${grupo.nombre}" ha sido activado`, 'success');
        } catch (error) {
            console.error('Error al activar tema:', error);
            Swal.fire('Error', 'No se pudo activar el tema. Intenta más tarde.', 'error');
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

                    <Dropdown.Item onClick={() => setMostrarModal(true)}>
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