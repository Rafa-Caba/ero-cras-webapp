// src/components/chat/ChatReactions.tsx

import {
    Box,
} from '@mui/material';

import { useChatStore } from '../../store/admin/useChatStore';
import { ItemReaction } from './ItemReaction';
import type { MessageReaction } from '../../types/chat';
import { useAuth } from '../../context/AuthContext';

interface Props {
    messageId: string;
    reactions: MessageReaction[];
}

interface ReactionUserLike {
    id?: string;
    _id?: string;
}

const getReactionUserId = (reaction: MessageReaction): string => {
    if (typeof reaction.user === 'string') {
        return reaction.user;
    }

    const userObject = reaction.user as ReactionUserLike;

    return userObject.id || userObject._id || '';
};

export const ChatReactions = ({ messageId, reactions }: Props) => {
    const { user } = useAuth();
    const reactToMessage = useChatStore((state) => state.reactToMessage);

    const handleReactionClick = async (emoji: string) => {
        if (!user?.id) {
            return;
        }

        await reactToMessage(messageId, emoji);
    };

    const grouped = reactions.reduce<Record<string, string[]>>((accumulator, reaction) => {
        const emoji = reaction.emoji;
        const userId = getReactionUserId(reaction);

        accumulator[emoji] = accumulator[emoji] || [];
        accumulator[emoji].push(userId);

        return accumulator;
    }, {});

    return (
        <Box
            sx={{
                display: 'flex',
                gap: 0.75,
                mt: 0.5,
                flexWrap: 'wrap',
            }}
        >
            {Object.entries(grouped).map(([emoji, userIds]) => {
                const hasReacted = userIds.includes(user?.id || '');

                return (
                    <ItemReaction
                        key={emoji}
                        emoji={emoji}
                        cantidad={userIds.length}
                        yaReacciono={hasReacted}
                        onClick={() => handleReactionClick(emoji)}
                        title={userIds.length > 1 ? `${userIds.length} reacciones` : '1 reacción'}
                    />
                );
            })}
        </Box>
    );
};