import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const LogoutButton = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/admin/login');
    };

    return (
        <div className='d-flex justify-content-center mt-3'>
            <button onClick={handleLogout} className="btn general_btn py-1 px-3">
                Cerrar Sesión
            </button>
        </div>
    );
};

export default LogoutButton;
