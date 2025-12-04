import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Form, Spinner } from "react-bootstrap";
import Swal from "sweetalert2";
import type { JSONContent } from "@tiptap/react";

import { TiptapEditor } from "../tiptap-components/TiptapEditor";
import { useSongStore } from "../../store/admin/useSongStore";
import { useSongTypeStore } from "../../store/admin/useSongTypeStore";
import { emptyEditorContent } from "../../utils/editorDefaults";
import { parseText } from "../../utils/handleTextTipTap";
import type { CreateSongPayload } from "../../types/song";
import { capitalizeWord } from "../../utils";

export const AdminEditSong = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const { getSong, editSong } = useSongStore();
    const { types, fetchTypes } = useSongTypeStore();

    const [title, setTitle] = useState("");
    const [content, setContent] = useState<JSONContent | null>(emptyEditorContent);
    const [songTypeId, setSongTypeId] = useState("");
    const [composer, setComposer] = useState("");
    const [audioFile, setAudioFile] = useState<File | null>(null);
    const [currentAudioUrl, setCurrentAudioUrl] = useState<string>("");
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            if (!id) return;

            await fetchTypes();

            const data = await getSong(id);

            if (data) {
                setTitle(data.title);
                setContent(parseText(data.content));
                setComposer(data.composer || "");
                setCurrentAudioUrl(data.audioUrl || "");

                let typeId = data.songTypeId || "";
                if (!typeId && (data as any).songTypeName) {
                    const matchingType = types.find(
                        (t) => t.name === (data as any).songTypeName
                    );
                    if (matchingType) typeId = matchingType.id;
                }

                setSongTypeId(typeId);
            }
        };

        loadData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const handleAudioChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const input = e.target as HTMLInputElement;
        const file = input.files?.[0] ?? null;
        setAudioFile(file);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!id) return;

        if (isSaving) return;
        setIsSaving(true);

        const payload: Partial<CreateSongPayload> = {
            title,
            content: content as any,
            songTypeId,
            composer,
            ...(audioFile ? { file: audioFile } : {})
        };

        try {
            await editSong(id, payload);
            Swal.fire("Guardado", "El canto ha sido actualizado", "success");
            navigate(`/admin/song/${id}`);
        } catch (err) {
            console.error(err);
            Swal.fire("Error", "No se pudo actualizar el canto", "error");
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
                <h2 className="titulo mb-3">Editar Canto</h2>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="my-3">
                        <Form.Label>Título</Form.Label>
                        <Form.Control
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Título"
                            disabled={isSaving}
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
                            disabled={isSaving}
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

                    <Form.Group className="mb-3">
                        <Form.Label>Compositor</Form.Label>
                        <Form.Control
                            type="text"
                            value={composer}
                            onChange={(e) => setComposer(e.target.value)}
                            placeholder="Compositor"
                            disabled={isSaving}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="audioEdit">
                        <Form.Label>Audio (opcional)</Form.Label>
                        <Form.Control
                            type="file"
                            accept="audio/*"
                            onChange={handleAudioChange}
                            disabled={isSaving}
                        />
                        {currentAudioUrl && (
                            <Form.Text className="d-block mt-1" muted>
                                Ya hay un audio guardado. Si subes un nuevo archivo, lo
                                reemplazará.
                            </Form.Text>
                        )}
                    </Form.Group>

                    <div className="text-center">
                        <Button
                            type="submit"
                            className="btn general_btn me-2"
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
                                "Modificar Canto"
                            )}
                        </Button>
                        <Button
                            variant="secondary"
                            onClick={() => navigate(`/admin/song/${id}`)}
                            disabled={isSaving}
                        >
                            Volver
                        </Button>
                    </div>
                </Form>
            </div>
        </article>
    );
};
