import { useParams } from 'react-router-dom';

import AdminSingleCanto from "../../components/cantos/AdminSingleCanto";

export const Canto = () => {
    const { id } = useParams<{ id: string }>();

    return (
        <AdminSingleCanto cantoId={id ? id : ''} />
    )
}