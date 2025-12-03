import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Form } from 'react-bootstrap';
import Swal from 'sweetalert2';
import type { JSONContent } from '@tiptap/react';

import { TiptapEditor } from '../tiptap-components/TiptapEditor';
import { useSongStore } from '../../store/admin/useSongStore';
import { useSongTypeStore } from '../../store/admin/useSongTypeStore';
import { emptyEditorContent } from '../../utils/editorDefaults';
import { parseText } from '../../utils/handleTextTipTap';

import type { CreateSongPayload } from '../../types/song';
import { capitalizeWord } from '../../utils';

export const AdminEditSong = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const { getSong, editSong } = useSongStore();
    const { types, fetchTypes } = useSongTypeStore();

    const [title, setTitle] = useState("");
    const [content, setContent] = useState<JSONContent | null>(emptyEditorContent);
    const [songTypeId, setSongTypeId] = useState("");
    const [composer, setComposer] = useState("");

    useEffect(() => {
        const loadData = async () => {
            if (!id) return;

            await fetchTypes();

            const data = await getSong(id);

            if (data) {
                setTitle(data.title);
                setContent(parseText(data.content));
                setComposer(data.composer || "");

                let typeId = data.songTypeId || "";
                if (!typeId && data.songTypeName) {
                    const matchingType = types.find(t => t.name === data.songTypeName);
                    if (matchingType) typeId = matchingType.id;
                }

                setSongTypeId(typeId);
            }
        };

        loadData();
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!id) return;

        const payload: Partial<CreateSongPayload> = {
            title,
            content: content as any,
            songTypeId,
            composer
        };

        try {
            await editSong(id, payload);
            Swal.fire("Guardado", "El canto ha sido actualizado", "success");
            navigate(`/admin/song/${id}`);
        } catch (err) {
            console.error(err);
            Swal.fire("Error", "No se pudo actualizar el canto", "error");
        }
    };

    const rootTypes = types.filter(t => !t.parentId).sort((a, b) => a.order - b.order);
    const getChildren = (parentId: string) => types.filter(t => t.parentId === parentId).sort((a, b) => a.order - b.order);

    return (
        <article className="m-3 col-md-8 mx-auto">
            <div className="form-canto">
                <h2 className="titulo">Editar Canto</h2>
                <Form onSubmit={handleSubmit}>

                    <Form.Group className="my-3">
                        <Form.Label>Titulo</Form.Label>
                        <Form.Control
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Título"
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Texto del Canto</Form.Label>
                        <TiptapEditor
                            content={content}
                            onChange={(val: JSONContent) => setContent(val)}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Tipo de Canto</Form.Label>
                        <Form.Select
                            value={songTypeId}
                            onChange={(e) => setSongTypeId(e.target.value)}
                        >
                            <option value="">-- Seleccionar Tipo --</option>

                            {rootTypes.map(root => {
                                const children = getChildren(root.id);

                                if (root.isParent && children.length > 0) {
                                    return (
                                        <optgroup key={root.id} label={capitalizeWord(root.name)}>
                                            {children.map(child => (
                                                <option key={child.id} value={child.id}>
                                                    {capitalizeWord(child.name)}
                                                </option>
                                            ))}
                                        </optgroup>
                                    );
                                } else {
                                    return (
                                        <option key={root.id} value={root.id}>
                                            {capitalizeWord(root.name)}
                                        </option>
                                    );
                                }
                            })}
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Compositor</Form.Label>
                        <Form.Control
                            type="text"
                            value={composer}
                            onChange={(e) => setComposer(e.target.value)}
                            placeholder="Compositor"
                        />
                    </Form.Group>

                    <div className='text-center'>
                        <Button type="submit" className="btn general_btn me-2">Modificar Canto</Button>
                        <Button variant="secondary" onClick={() => navigate(`/admin/song/${id}`)}>Volver</Button>
                    </div>
                </Form>
            </div>
        </article>
    );
};