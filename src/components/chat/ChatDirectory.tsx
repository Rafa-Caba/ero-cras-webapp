import { OverlayTrigger, Popover, Image, Badge } from 'react-bootstrap';
import { FaUsers } from 'react-icons/fa';

export interface ChatDirectoryUser {
    id?: string;
    _id?: string;
    name: string;
    username: string;
    imageUrl?: string;
}

interface Props {
    allUsers: ChatDirectoryUser[];
    onlineUsers: ChatDirectoryUser[];
}

export const ChatDirectory = ({ allUsers, onlineUsers }: Props) => {

    const isOnline = (targetUser: ChatDirectoryUser) => {
        const targetId = targetUser.id || targetUser._id;
        if (!targetId) return false;

        return onlineUsers.some(u => (u.id === targetId) || (u._id === targetId));
    };

    const popover = (
        <Popover id="directory-popover" className="shadow border-0">
            <Popover.Header as="h3" className="chat-container-color fw-bold text-center border-bottom">
                Directorio ({allUsers.length})
            </Popover.Header>
            <Popover.Body className="p-0" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {allUsers.length === 0 ? (
                    <div className="p-3 text-center text-muted small">
                        No hay usuarios disponibles.
                    </div>
                ) : (
                    <ul className="list-group list-group-flush">
                        {allUsers.map((user, index) => {
                            const online = isOnline(user);
                            const userId = user.id || user._id || index; // Fallback key

                            return (
                                <li key={userId} className="list-group-item d-flex align-items-center justify-content-between px-3 py-2 border-bottom-0">
                                    <div className="d-flex align-items-center">
                                        <div className="position-relative">
                                            <Image
                                                src={user.imageUrl || '/images/default-user.png'}
                                                roundedCircle
                                                width={36}
                                                height={36}
                                                style={{ objectFit: 'cover' }}
                                                alt={user.name}
                                            />
                                            <span
                                                className="position-absolute bottom-0 end-0 border border-white rounded-circle"
                                                style={{
                                                    width: '10px',
                                                    height: '10px',
                                                    backgroundColor: online ? '#28a745' : '#ccc' // Green vs Gray
                                                }}
                                                title={online ? 'En Línea' : 'Desconectado'}
                                            />
                                        </div>
                                        <div className="ms-2 d-flex flex-column" style={{ lineHeight: '1.2' }}>
                                            <span className="fw-bold small text-dark">{user.name}</span>
                                            <span className="text-muted" style={{ fontSize: '0.7rem' }}>@{user.username}</span>
                                        </div>
                                    </div>
                                    <Badge
                                        bg={online ? 'success' : 'secondary'}
                                        className="ms-2 fw-normal"
                                        style={{ fontSize: '0.65rem', minWidth: '70px' }}
                                    >
                                        {online ? 'En Línea' : 'Offline'}
                                    </Badge>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </Popover.Body>
        </Popover>
    );

    return (
        <OverlayTrigger
            trigger={['hover', 'focus']}
            placement="bottom"
            overlay={popover}
            delay={{ show: 100, hide: 300 }}
        >
            <div
                className="d-flex align-items-center ms-3 position-relative"
                style={{ cursor: 'pointer', color: '#555' }}
            >
                <FaUsers size={24} className="text-theme-color" />

                {/* Online Count Badge */}
                {onlineUsers.length > 0 && (
                    <span
                        className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-success border border-white"
                        style={{ fontSize: '0.6em', padding: '0.25em 0.4em' }}
                    >
                        {onlineUsers.length}
                    </span>
                )}
            </div>
        </OverlayTrigger>
    );
};