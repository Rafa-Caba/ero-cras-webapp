import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';
import Swal from 'sweetalert2';

import { useThemeStore } from '../../store/admin/useThemeStore';
import { useUsersStore } from '../../store/admin/useUsersStore';
import { ThemeSelectorModal } from './ThemeSelectorModal';
import { applyThemeToDocument } from '../../utils/applyThemeToDocument';
import type { Theme } from '../../types/theme';
import { useAuth } from '../../context/AuthContext';

export const UserMenu = () => {
    const navigate = useNavigate();
    const { user, updateUser, logout } = useAuth();

    const { updateMyTheme } = useUsersStore();
    const { themes, fetchThemes } = useThemeStore();

    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetchThemes();
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/auth/login');
    };

    const handleSelectTheme = async (theme: Theme) => {
        try {
            if (!theme.id || !user?.id) return;

            const updatedUser = await updateMyTheme(theme.id);

            updateUser(updatedUser);

            applyThemeToDocument(theme);

            setShowModal(false);
            Swal.fire('¡Tema aplicado!', `Se ha guardado tu preferencia.`, 'success');
        } catch (error) {
            console.error('Error applying theme:', error);
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
                        src={user?.imageUrl || '/default-avatar.png'}
                        alt="Perfil"
                        className="rounded-circle"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                </Dropdown.Toggle>

                <Dropdown.Menu>
                    <Dropdown.Header>👋 ¡Hola, {user?.name?.split(' ')[0]}!</Dropdown.Header>

                    <Dropdown.Item onClick={() => navigate('/admin')}>
                        Ir a Inicio
                    </Dropdown.Item>

                    <Dropdown.Item onClick={() => navigate('/admin/edit-profile')}>
                        👤 Ajustes de usuario
                    </Dropdown.Item>

                    <Dropdown.Item onClick={() => navigate('/admin/profile')}>
                        📄 Ver mi perfil
                    </Dropdown.Item>

                    <Dropdown.Item
                        onClick={() => {
                            if (user?.id) setShowModal(true);
                            else Swal.fire('Aviso', 'Usuario no disponible.', 'warning');
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

            <ThemeSelectorModal
                show={showModal}
                onClose={() => setShowModal(false)}
                themes={themes}
                onSelect={handleSelectTheme}
            />
        </>
    );
};