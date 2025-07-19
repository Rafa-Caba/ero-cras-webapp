import { motion } from 'framer-motion';

interface ReaccionItemProps {
    emoji: string;
    cantidad: number;
    yaReacciono: boolean;
    onClick: () => void;
    title?: string;
}

export const ReaccionItem = ({ emoji, cantidad, onClick, title }: ReaccionItemProps) => (
    <motion.button
        type="button"
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 300 }}
        className={`btn btn-sm btn-light bg-light rounded-pill py-1 px-2 d-flex align-items-center btn-reaccion`}
        onClick={onClick}
        title={title}
    >
        <span className="me-1">{emoji}</span>
        <small>{cantidad}</small>
    </motion.button>
);
