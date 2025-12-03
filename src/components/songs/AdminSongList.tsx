import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Accordion, Spinner } from 'react-bootstrap';
import { TiptapViewer } from '../tiptap-components/TiptapViewer';
import { useSongStore } from '../../store/admin/useSongStore';
import { useSongTypeStore } from '../../store/admin/useSongTypeStore';
import type { Song } from '../../types';
import { parseText } from '../../utils/handleTextTipTap';
import { capitalizeWord } from '../../utils';
import { useAuth } from '../../context/AuthContext';

export const AdminSongList = () => {
    const { songs, loading, fetchSongs } = useSongStore();
    const { types, fetchTypes } = useSongTypeStore();
    const { canEdit } = useAuth();

    useEffect(() => {
        const loadData = async () => {
            try {
                await Promise.all([fetchTypes(), fetchSongs()]);
            } catch (error) {
                console.error('Error loading songs:', error);
            }
        };
        loadData();
    }, []);

    const rootTypes = types
        .filter(t => !t.parentId)
        .sort((a, b) => a.order - b.order);

    const getChildTypes = (parentId: string) => {
        return types
            .filter(t => t.parentId === parentId)
            .sort((a, b) => a.order - b.order);
    };

    const getSongsByType = (typeName: string) => {
        return songs.filter(s => s.songTypeName === typeName);
    };

    const existingTypeNames = types.map(t => t.name);
    const uncategorizedSongs = songs.filter(s => !existingTypeNames.includes(s.songTypeName));

    const SongListRenderer = ({ songList }: { songList: Song[] }) => {
        if (songList.length === 0) {
            return <p className="text-muted small my-2">No hay cantos en esta categoría.</p>;
        }

        return (
            <>
                {songList.map((song) => (
                    <Accordion key={song.id} className="accordion-custom mb-2">
                        <Accordion.Item eventKey={String(song.id)}>
                            <Accordion.Header className="small-header">
                                <span className="fw-bold">{song.title}</span>
                            </Accordion.Header>
                            <Accordion.Body className='px-2 px-md-3'>
                                <div>
                                    <p className='pb-0 pb-md-2'>
                                        <Link
                                            className="fw-bolder fs-5 text-decoration-none text-theme-color"
                                            to={`/admin/song/${song.id}`}
                                        >
                                            - {song.title} -
                                        </Link>
                                    </p>
                                    <div className="border rounded py-3 py-md-5 px-1 px-md-3 bg-light">
                                        <TiptapViewer content={parseText(song.content)} />
                                    </div>
                                </div>
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>
                ))}
            </>
        );
    };

    return (
        <div className="d-flex flex-column justify-content-center px-2 px-md-5 mb-0">
            <div className="d-flex flex-column align-items-center w-100 my-2">
                <p className="fw-bold m-0 fs-1">Cantos</p>
                <div className="botones mb-1">
                    {canEdit && <Link to="/admin/songs/new" className="btn general_btn me-2">Nuevo Canto</Link>}
                </div>
            </div>

            <div className="cantos-contenedor pe-0 mb-2">
                {!loading ? (
                    <Accordion alwaysOpen className='accordion-custom' id="accordionMain">

                        {rootTypes.map((root) => {
                            const childTypes = getChildTypes(root.id);
                            const rootSongs = getSongsByType(root.name);

                            return (
                                <Accordion.Item eventKey={root.id} key={root.id}>
                                    <Accordion.Header>
                                        {root.isParent ? `📂 ${capitalizeWord(root.name)}` : capitalizeWord(root.name)}
                                    </Accordion.Header>
                                    <Accordion.Body className={root.isParent ? "bg-light p-2 p-md-3" : ""}>

                                        {root.isParent && childTypes.length > 0 && (
                                            <Accordion alwaysOpen className="accordion-custom mb-3">
                                                {childTypes.map(child => (
                                                    <Accordion.Item eventKey={child.id} key={child.id}>
                                                        <Accordion.Header>
                                                            {capitalizeWord(child.name)}
                                                        </Accordion.Header>
                                                        <Accordion.Body className='p-2 p-md-3'>
                                                            <SongListRenderer songList={getSongsByType(child.name)} />
                                                        </Accordion.Body>
                                                    </Accordion.Item>
                                                ))}
                                            </Accordion>
                                        )}

                                        {rootSongs.length > 0 && (
                                            <div className={root.isParent ? "mt-3 border-top p-2" : ""}>
                                                {root.isParent && <p className="text-muted small">Cantos directos en esta carpeta:</p>}
                                                <SongListRenderer songList={rootSongs} />
                                            </div>
                                        )}

                                        {root.isParent && childTypes.length === 0 && rootSongs.length === 0 && (
                                            <p className="text-muted text-center">Carpeta vacía</p>
                                        )}
                                    </Accordion.Body>
                                </Accordion.Item>
                            );
                        })}

                        {uncategorizedSongs.length > 0 && (
                            <Accordion.Item eventKey="no-type">
                                <Accordion.Header className="text-danger">⚠️ Sin tipo de Canto</Accordion.Header>
                                <Accordion.Body className='p-0 p-md-3'>
                                    <SongListRenderer songList={uncategorizedSongs} />
                                </Accordion.Body>
                            </Accordion.Item>
                        )}
                    </Accordion>
                ) : (
                    <div className="cantos-contenedor text-center mt-3">
                        <Spinner animation="border" role="status" />
                    </div>
                )}
            </div>
        </div>
    );
};