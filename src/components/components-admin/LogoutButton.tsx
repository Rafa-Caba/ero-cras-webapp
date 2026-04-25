// src/components/components-admin/LogoutButton.tsx

import { useNavigate } from 'react-router-dom';

import {
    Box,
    Button,
} from '@mui/material';

import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';

import { useAuth } from '../../context/AuthContext';

const LogoutButton = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/auth/login');
    };

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                mt: 0,
            }}
        >
            <Button
                type="button"
                variant="contained"
                onClick={handleLogout}
                endIcon={<LogoutRoundedIcon />}
                sx={{
                    borderRadius: 1.5,
                    px: 2.5,
                    py: 0.7,
                    fontWeight: 900,
                }}
            >
                Cerrar Sesión
            </Button>
        </Box>
    );
};

export default LogoutButton