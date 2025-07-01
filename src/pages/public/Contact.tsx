import { useState } from "react";

import ContactSection from "../../components-public/ContactSection"
import SidebarLeft from "../../components-public/SidebarLeft"
import SidebarRight from "../../components-public/SidebarRight"


const Contact = () => {

    const [email, setEmail] = useState('');
    const [emailMessage, setEmailMessage] = useState('');

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!email || !emailMessage) {
            alert('Por favor completa ambos campos.');
            return;
        }

        // Aquí podrías hacer algo con los datos
        console.log('Correo: ', email);
        console.log('Mensaje: ', emailMessage);
    };

    return (
        <main className="main row d-flex">
            <SidebarLeft />
            <section className="center col-12 col-md-8 mt-5 d-flex flex-column align-items-center order-0 order-md-1">
                <ContactSection
                    email={email}
                    setEmail={setEmail}
                    emailMessage={emailMessage}
                    setEmailMessage={setEmailMessage}
                    handleSubmit={handleSubmit}
                />
            </section>
            <SidebarRight />
        </main>
    )
}

export default Contact