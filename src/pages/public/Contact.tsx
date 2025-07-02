import { useState } from "react";

import ContactSection from "../../components-public/ContactSection";

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
        <ContactSection
            email={email}
            setEmail={setEmail}
            emailMessage={emailMessage}
            setEmailMessage={setEmailMessage}
            handleSubmit={handleSubmit}
        />
    );
}

export default Contact