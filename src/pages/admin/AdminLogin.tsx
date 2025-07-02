import { useState } from "react";
import { Link } from "react-router-dom";
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

            // console.log({
            //     token, refreshToken, usuario
            // })

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
                        <div className="titulo text-center text-md-start mt-3">
                            <h1 className="d-none d-md-block">Ero Cras Oficial - Admin</h1>
                            <h1 className="d-block d-md-none">Ero Cras Oficial<br />Admin</h1>
                        </div>
                    </div>
                </div>
            </header>

            <main className="layout-main" style={{ minHeight: '80vh' }}>
                <div className="my-5 mx-auto col-12 col-md-8 d-flex align-items-center justify-content-center">
                    <article className="my-5 mx-auto w-50 d-flex flex-column align-items-center justify-content-center">
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
