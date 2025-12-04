import { useState, useEffect, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Spinner } from "react-bootstrap";
import Swal from "sweetalert2";
import type { JSONContent } from "@tiptap/react";

import { TiptapEditor } from "../tiptap-components/TiptapEditor";
import { useSongStore } from "../../store/admin/useSongStore";
import { useSongTypeStore } from "../../store/admin/useSongTypeStore";
import { emptyEditorContent } from "../../utils/editorDefaults";
import type { CreateSongPayload } from "../../types";
import { parseText } from "../../utils/handleTextTipTap";
import { capitalizeWord } from "../../utils";

export const AdminNewSong = () => {
    const navigate = useNavigate();

    const { addSong } = useSongStore();
    const { types, fetchTypes } = useSongTypeStore();

    const [title, setTitle] = useState("");
    const [content, setContent] = useState<JSONContent | null>(emptyEditorContent);
    const [songTypeId, setSongTypeId] = useState("");
    const [composer, setComposer] = useState("");
    const [audioFile, setAudioFile] = useState<File | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        fetchTypes();
    }, []);

    const handleAudioChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const input = e.target as HTMLInputElement;
        const file = input.files?.[0] ?? null;
        setAudioFile(file);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!title || !content || !songTypeId) {
            Swal.fire(
                "Campos requeridos",
                "Título, Contenido y Tipo son obligatorios",
                "warning"
            );
            return;
        }

        if (isSaving) return;
        setIsSaving(true);

        const payload: CreateSongPayload = {
            title,
            content: content as any,
            songTypeId,
            composer,
            ...(audioFile ? { file: audioFile } : {})
        };

        try {
            await addSong(payload);
            Swal.fire("¡Éxito!", "Canto guardado correctamente", "success");
            navigate("/admin/songs");
        } catch (err) {
            console.error(err);
            Swal.fire("Error", "Ocurrió un error inesperado", "error");
        } finally {
            setIsSaving(false);
        }
    };

    const rootTypes = types
        .filter((t) => !t.parentId)
        .sort((a, b) => a.order - b.order);

    const getChildren = (parentId: string) =>
        types
            .filter((t) => t.parentId === parentId)
            .sort((a, b) => a.order - b.order);

    return (
        <article className="m-3 col-md-8 mx-auto">
            <div className="form-canto">
                <h2 className="titulo mb-4">Nuevo Canto</h2>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="title">
                        <Form.Label>Título del Canto</Form.Label>
                        <Form.Control
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Título del canto"
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Texto del Canto</Form.Label>
                        <TiptapEditor
                            content={parseText(content)}
                            onChange={(val: JSONContent) => setContent(val)}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="songType">
                        <Form.Label>Tipo de Canto</Form.Label>
                        <Form.Select
                            value={songTypeId}
                            onChange={(e) => setSongTypeId(e.target.value)}
                        >
                            <option value="">-- Seleccionar Tipo --</option>

                            {rootTypes.map((root) => {
                                const children = getChildren(root.id);

                                if (root.isParent && children.length > 0) {
                                    return (
                                        <optgroup
                                            key={root.id}
                                            label={capitalizeWord(root.name)}
                                        >
                                            {children.map((child) => (
                                                <option key={child.id} value={child.id}>
                                                    {capitalizeWord(child.name)}
                                                </option>
                                            ))}
                                        </optgroup>
                                    );
                                }

                                return (
                                    <option key={root.id} value={root.id}>
                                        {capitalizeWord(root.name)}
                                    </option>
                                );
                            })}
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="composer">
                        <Form.Label>Compositor</Form.Label>
                        <Form.Control
                            type="text"
                            value={composer}
                            onChange={(e) => setComposer(e.target.value)}
                            placeholder="Compositor"
                        />
                    </Form.Group>

                    <Form.Group className="mb-4" controlId="audio">
                        <Form.Label>Audio (opcional)</Form.Label>
                        <Form.Control
                            type="file"
                            accept="audio/*"
                            onChange={handleAudioChange}
                            disabled={isSaving}
                        />
                        <Form.Text muted>
                            Puedes subir un archivo de audio para este canto.
                        </Form.Text>
                    </Form.Group>

                    <div className="text-center">
                        <Button
                            type="submit"
                            className="general_btn me-2"
                            disabled={isSaving}
                        >
                            {isSaving ? (
                                <>
                                    <Spinner
                                        animation="border"
                                        size="sm"
                                        className="me-2"
                                    />
                                    Guardando...
                                </>
                            ) : (
                                "Guardar Canto"
                            )}
                        </Button>
                        <Button
                            variant="secondary"
                            onClick={() => navigate("/admin/songs")}
                            disabled={isSaving}
                        >
                            Cancelar
                        </Button>
                    </div>
                </Form>
            </div>
        </article>
    );
};
