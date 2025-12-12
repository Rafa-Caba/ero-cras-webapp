import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Image } from "react-bootstrap";
import Swal from "sweetalert2";
import { useAuth } from "../../context/AuthContext";
import { AdminFooter } from "../../components/components-admin/AdminFooter";

export const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (e: FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            await login({ username, password });
            navigate('/admin');
        } catch (err: any) {
            const msg = err.response?.data?.message || 'Credenciales incorrectas';
            Swal.fire('Error', msg, 'error');
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="primary-color-container">
            <header className="layout-header">
                <div className="titulo-nav px-0 col-12 d-flex flex-column">
                    <div className="titulo mx-5 text-black d-flex flex-column flex-md-row justify-content-md-between align-items-md-center">
                        <div className="titulo text-center text-md-start d-flex flex-column flex-md-row justify-content-between mt-3 w-100">
                            <h2 className="">Ero Cras Oficial - Admin</h2>
                        </div>
                    </div>
                </div>
            </header>

            <main className="layout-main primary-color-container" style={{ minHeight: '83vh' }}>
                <div className="mt-5 my-mb-5 mx-auto col-12 col-md-8 d-flex flex-column align-items-center justify-content-center">
                    <Image
                        src={'/images/erocrasLogo.png'}
                        roundedCircle
                        height={150}
                        width={150}
                        alt={`Ero Cras Official`}
                        style={{ objectFit: 'cover', border: '3px solid purple', margin: '.3rem' }}
                        className="text-center"
                    />
                    <article className="mt-5 my-mb-5 mx-auto w-50 d-flex flex-column align-items-center justify-content-center">
                        <h2 className="titulo">Iniciar Sesión</h2>
                        <form className="w-100 mt-4" onSubmit={handleLogin}>
                            <input
                                className="mb-3 form-control"
                                type="text"
                                name="username"
                                placeholder="Usuario o Correo"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                disabled={loading}
                            />
                            <input
                                className="mb-3 form-control"
                                type="password"
                                name="password"
                                placeholder="Contraseña"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                disabled={loading}
                            />

                            <button type="submit" className="form-control btn login_btn" disabled={loading}>
                                {loading ? 'Cargando...' : 'Login'}
                            </button>

                            {error && <p className="text-danger text-center mt-2">{error}</p>}
                        </form>

                        <p className="mt-3">
                            ¿No tienes cuenta?
                            <Link className="derecha ms-1" to="/auth/register">
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