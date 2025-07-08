
interface Props {
    email: string;
    setEmail: React.Dispatch<React.SetStateAction<string>>;
    emailMessage: string;
    setEmailMessage: React.Dispatch<React.SetStateAction<string>>;
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export const ContactSection = ({ email, setEmail, emailMessage, setEmailMessage, handleSubmit }: Props) => {
    return (
        <section className="layout-content d-flex flex-column align-items-center order-0 order-md-1">
            <p className="text-center fs-2">Contacto</p>

            <div className="form mb-3 col-md-8">
                <form onSubmit={handleSubmit}>
                    <div className="mb-2">
                        <label className="form-label" htmlFor="correo">Correo Electrónico</label>
                        <input
                            type="email"
                            className="form-control"
                            id="email_address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            aria-describedby="ayuda-correo"
                            required
                        />
                        <div id="ayuda_email_address" className="form-text">
                            Te enviaremos un mensaje de confirmación
                        </div>
                    </div>

                    <div className="mb-3">
                        <label className="form-label" htmlFor="mensaje">Mensaje</label>
                        <textarea
                            className="form-control"
                            id="email_message"
                            value={emailMessage}
                            onChange={(e) => setEmailMessage(e.target.value)}
                            rows={4}
                            required
                        ></textarea>
                    </div>

                    <button type="submit" className="btn general_btn" disabled={!email || !emailMessage}>
                        Enviar mensaje
                    </button>
                </form>
            </div>
        </section>
    );
};