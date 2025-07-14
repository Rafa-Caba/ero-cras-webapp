import { useState } from "react";
import { Link } from "react-router-dom";
import { Image } from "react-bootstrap";
import type { AxiosResponse } from 'axios';
import Swal from "sweetalert2";
import api from "../../api/axios";
import { useAuth } from "../../hooks/useAuth";
import { AdminFooter } from "../../components-admin/AdminFooter";
import type { Usuario } from "../../types";

interface LoginResponse {
    token: string;
    refreshToken: string;
    usuario: Usuario;
}

const AdminLogin = () => {
    const { login } = useAuth();

    const [usuarioForm, setUsuarioForm] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const res: AxiosResponse<LoginResponse> = await api.post('/login', {
                usernameOrEmail: usuarioForm,
                password
            });

            const { token, refreshToken, usuario } = res.data;

            // ✅ Aquí sí llamamos la función del contexto
            login(usuario, token, refreshToken);

        } catch (error) {
            Swal.fire('Error', 'Usuario o contraseña incorrectos', 'error');
        }
    };

    return (
        <div>
            <header className="layout-header">
                <div className="titulo-nav px-0 col-12 d-flex flex-column">
                    <div className="titulo mx-5 text-black d-flex flex-column flex-md-row justify-content-md-between align-items-md-center">
                        <div className="titulo text-center text-md-start d-flex flex-column flex-md-row justify-content-between mt-3 w-100">
                            <h2 className="">Ero Cras Oficial - Admin</h2>
                            <Link className="btn general_btn mt-3 mt-md-0 mb-md-2 fw-bold fs-6 fs-md-5" to="/">Ir al Inicio</Link>
                        </div>
                    </div>
                </div>
            </header>

            <main className="layout-main primary-color-container" style={{ minHeight: '80vh' }}>
                <div className="mt-5 my-mb-5 mx-auto col-12 col-md-8 d-flex flex-column align-items-center justify-content-center">
                    <Image
                        src={'/images/erocrasLogo.png'}
                        roundedCircle
                        height={50}
                        width={50}
                        alt={`Ero Cras Official`}
                        style={{
                            objectFit: 'cover',
                            width: '150px',
                            height: '150px',
                            minWidth: '150px',
                            minHeight: '150px',
                            border: '3px solid purple',
                            margin: '.3rem'
                        }}
                        className="text-center"
                    />
                    <article className="mt-5 my-mb-5 mx-auto w-50 d-flex flex-column align-items-center justify-content-center">
                        <h2 className="titulo">Iniciar Sesión</h2>
                        <form className="w-100 mt-4" onSubmit={handleLogin}>
                            <input
                                className="mb-3 form-control"
                                type="text"
                                name="usuario"
                                placeholder="Usuario"
                                value={usuarioForm}
                                onChange={(e) => setUsuarioForm(e.target.value)}
                                required
                            />
                            <input
                                className="mb-3 form-control"
                                type="password"
                                name="password"
                                placeholder="Contraseña"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />

                            <button type="submit" className="form-control btn login_btn">
                                Login
                            </button>

                            {error && <p className="text-danger text-center">{error}</p>}
                        </form>

                        <p>
                            ¿ No tienes cuenta ?
                            <Link className="derecha" to="/admin/registrate">
                                Regístrate
                            </Link>
                        </p>
                    </article>
                </div>
            </main>

            <AdminFooter />
        </div>
    );
};

export default AdminLogin;
