import { motion } from 'framer-motion';

interface Props {
    emoji: string;
    side?: 'left' | 'right';
}

export const EmojiFloat = ({ emoji, side = 'left' }: Props) => {
    return (
        <motion.div
            initial={{ scale: 0, opacity: 0, y: 0 }}
            animate={{ scale: 2.5, opacity: 1, y: -120 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            className="emoji-flotante"
            style={{
                position: 'absolute',
                bottom: '0',
                left: side === 'left' ? '0' : 'auto',
                right: side === 'right' ? '0' : 'auto',
                fontSize: '2rem',
                pointerEvents: 'none',
                zIndex: 99,
            }}
        >
            {emoji}
        </motion.div>
    );
};
