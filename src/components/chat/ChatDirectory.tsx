// src/components/chat/ChatDirectory.tsx

import { useMemo, useState } from 'react';

import {
    Avatar,
    Badge,
    Box,
    Chip,
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Popover,
    Typography,
} from '@mui/material';

import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';

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

const getDirectoryUserId = (user: ChatDirectoryUser, fallbackIndex: number): string => {
    return user.id || user._id || `directory-user-${fallbackIndex}`;
};

export const ChatDirectory = ({ allUsers, onlineUsers }: Props) => {
    const [anchorElement, setAnchorElement] = useState<HTMLButtonElement | null>(null);

    const onlineUserIds = useMemo(() => {
        return onlineUsers
            .map((user, index) => getDirectoryUserId(user, index))
            .filter((id) => Boolean(id));
    }, [onlineUsers]);

    const isOpen = Boolean(anchorElement);

    const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorElement(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorElement(null);
    };

    const isOnline = (targetUser: ChatDirectoryUser, fallbackIndex: number) => {
        const targetId = getDirectoryUserId(targetUser, fallbackIndex);

        return onlineUserIds.includes(targetId);
    };

    return (
        <>
            <IconButton
                aria-label="Abrir directorio del chat"
                onClick={handleOpen}
                sx={{
                    color: 'var(--color-primary)',
                    position: 'relative',
                }}
            >
                <GroupsRoundedIcon />

                {onlineUsers.length > 0 && (
                    <Badge
                        badgeContent={onlineUsers.length}
                        color="success"
                        sx={{
                            position: 'absolute',
                            top: 6,
                            right: 6,
                            '& .MuiBadge-badge': {
                                fontSize: '0.62rem',
                                fontWeight: 950,
                            },
                        }}
                    />
                )}
            </IconButton>

            <Popover
                open={isOpen}
                anchorEl={anchorElement}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
                slotProps={{
                    paper: {
                        sx: {
                            width: 330,
                            maxWidth: 'calc(100vw - 24px)',
                            borderRadius: 2,
                            backgroundColor: 'var(--color-card)',
                            color: 'var(--color-text)',
                            border:
                                '1px solid color-mix(in srgb, var(--color-border) 44%, transparent)',
                            boxShadow: '0 18px 54px rgba(15, 23, 42, 0.22)',
                            overflow: 'hidden',
                        },
                    },
                }}
            >
                <Box
                    sx={{
                        px: 1.5,
                        py: 1.25,
                        borderBottom:
                            '1px solid color-mix(in srgb, var(--color-border) 34%, transparent)',
                        backgroundColor:
                            'color-mix(in srgb, var(--color-card) 82%, var(--color-primary) 18%)',
                    }}
                >
                    <Typography
                        sx={{
                            fontWeight: 950,
                            textAlign: 'center',
                        }}
                    >
                        Directorio ({allUsers.length})
                    </Typography>
                </Box>

                <Box
                    sx={{
                        maxHeight: 320,
                        overflowY: 'auto',
                        overflowX: 'hidden',
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none',
                        '&::-webkit-scrollbar': {
                            display: 'none',
                        },
                    }}
                >
                    {allUsers.length === 0 ? (
                        <Typography
                            sx={{
                                p: 2,
                                textAlign: 'center',
                                color: 'var(--color-secondary-text)',
                                fontWeight: 800,
                                fontSize: '0.86rem',
                            }}
                        >
                            No hay usuarios disponibles.
                        </Typography>
                    ) : (
                        <List disablePadding>
                            {allUsers.map((directoryUser, index) => {
                                const online = isOnline(directoryUser, index);
                                const userId = getDirectoryUserId(directoryUser, index);

                                return (
                                    <ListItem
                                        key={userId}
                                        secondaryAction={
                                            <Chip
                                                size="small"
                                                label={online ? 'En línea' : 'Offline'}
                                                color={online ? 'success' : 'default'}
                                                sx={{
                                                    fontWeight: 900,
                                                    minWidth: 76,
                                                }}
                                            />
                                        }
                                        sx={{
                                            pr: 11,
                                            borderBottom:
                                                '1px solid color-mix(in srgb, var(--color-border) 24%, transparent)',
                                        }}
                                    >
                                        <ListItemAvatar>
                                            <Box sx={{ position: 'relative', width: 40 }}>
                                                <Avatar
                                                    src={directoryUser.imageUrl || '/images/default-user.png'}
                                                    alt={directoryUser.name}
                                                    sx={{
                                                        width: 40,
                                                        height: 40,
                                                        bgcolor: 'var(--color-primary)',
                                                        color: 'var(--color-button-text)',
                                                        fontWeight: 950,
                                                    }}
                                                >
                                                    {directoryUser.name.slice(0, 1).toUpperCase()}
                                                </Avatar>

                                                <Box
                                                    title={online ? 'En línea' : 'Desconectado'}
                                                    sx={{
                                                        position: 'absolute',
                                                        right: 1,
                                                        bottom: 1,
                                                        width: 10,
                                                        height: 10,
                                                        borderRadius: '50%',
                                                        backgroundColor: online ? '#22c55e' : '#9ca3af',
                                                        border: '2px solid var(--color-card)',
                                                    }}
                                                />
                                            </Box>
                                        </ListItemAvatar>

                                        <ListItemText
                                            primary={directoryUser.name}
                                            secondary={`@${directoryUser.username}`}
                                            slotProps={{
                                                primary: {
                                                    sx: {
                                                        color: 'var(--color-text)',
                                                        fontWeight: 950,
                                                        lineHeight: 1.1,
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap',
                                                    },
                                                },
                                                secondary: {
                                                    sx: {
                                                        color: 'var(--color-secondary-text)',
                                                        fontWeight: 750,
                                                        fontSize: '0.76rem',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap',
                                                    },
                                                },
                                            }}
                                        />
                                    </ListItem>
                                );
                            })}
                        </List>
                    )}
                </Box>
            </Popover>
        </>
    );
};