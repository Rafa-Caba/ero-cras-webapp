// src/components/chat/ItemReaction.tsx

import { motion } from 'framer-motion';

import {
    Box,
} from '@mui/material';

interface ItemReactionProps {
    emoji: string;
    cantidad: number;
    yaReacciono: boolean;
    onClick: () => void;
    title?: string;
}

export const ItemReaction = ({
    emoji,
    cantidad,
    yaReacciono,
    onClick,
    title,
}: ItemReactionProps) => {
    return (
        <Box
            component={motion.button}
            type="button"
            whileHover={{ scale: 1.12 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300 }}
            onClick={onClick}
            title={title}
            sx={{
                border: '1px solid color-mix(in srgb, var(--color-border) 38%, transparent)',
                borderRadius: 999,
                py: 0.35,
                px: 0.85,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.45,
                cursor: 'pointer',
                backgroundColor: yaReacciono
                    ? 'color-mix(in srgb, var(--color-primary) 22%, var(--color-card) 78%)'
                    : 'color-mix(in srgb, var(--color-card) 90%, var(--color-primary) 10%)',
                color: 'var(--color-text)',
                fontWeight: 950,
                lineHeight: 1,
                boxShadow: yaReacciono
                    ? '0 8px 18px rgba(15, 23, 42, 0.12)'
                    : 'none',
            }}
        >
            <Box component="span">{emoji}</Box>
            <Box
                component="small"
                sx={{
                    fontWeight: 950,
                    fontSize: '0.72rem',
                }}
            >
                {cantidad}
            </Box>
        </Box>
    );
};