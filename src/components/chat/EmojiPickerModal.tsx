// src/components/chat/EmojiPickerModal.tsx

import EmojiPicker, { type EmojiClickData } from 'emoji-picker-react';

import {
    Box,
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
} from '@mui/material';

import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import EmojiEmotionsRoundedIcon from '@mui/icons-material/EmojiEmotionsRounded';

interface Props {
    show: boolean;
    onClose: () => void;
    onSelect: (emoji: string) => void;
}

export const EmojiPickerModal = ({ show, onClose, onSelect }: Props) => {
    const handleEmojiClick = (emojiData: EmojiClickData) => {
        onSelect(emojiData.emoji);
        onClose();
    };

    return (
        <Dialog
            open={show}
            onClose={onClose}
            fullWidth
            maxWidth="sm"
            scroll="paper"
            slotProps={{
                paper: {
                    sx: {
                        borderRadius: 2,
                        backgroundColor: 'var(--color-card)',
                        color: 'var(--color-text)',
                        border: '1px solid color-mix(in srgb, var(--color-border) 46%, transparent)',
                        boxShadow: '0 22px 70px rgba(15, 23, 42, 0.22)',
                        overflow: 'hidden',
                    },
                },
            }}
        >
            <DialogTitle
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 1,
                    fontWeight: 950,
                    borderBottom: '1px solid color-mix(in srgb, var(--color-border) 36%, transparent)',
                }}
            >
                <Box
                    component="span"
                    sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 1,
                    }}
                >
                    <EmojiEmotionsRoundedIcon sx={{ color: 'var(--color-primary)' }} />
                    Selecciona un emoji
                </Box>

                <IconButton
                    aria-label="Cerrar selector de emoji"
                    onClick={onClose}
                    sx={{ color: 'var(--color-text)' }}
                >
                    <CloseRoundedIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent
                sx={{
                    p: 2,
                    backgroundColor: 'var(--color-card)',
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                    '&::-webkit-scrollbar': {
                        display: 'none',
                    },
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        '& .EmojiPickerReact': {
                            width: '100% !important',
                            maxWidth: '100%',
                        },
                    }}
                >
                    <EmojiPicker
                        onEmojiClick={handleEmojiClick}
                        width="100%"
                        height={400}
                        lazyLoadEmojis
                        skinTonesDisabled={false}
                        searchDisabled={false}
                        previewConfig={{ showPreview: false }}
                    />
                </Box>
            </DialogContent>
        </Dialog>
    );
};