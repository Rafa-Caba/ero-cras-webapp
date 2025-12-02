import { useChatStore } from '../../store/admin/useChatStore';
import { ItemReaction } from './ItemReaction';
import type { MessageReaction } from '../../types/chat';
import { useAuth } from '../../context/AuthContext';

interface Props {
    messageId: string;
    reactions: MessageReaction[];
}

export const ChatReactions = ({ messageId, reactions }: Props) => {
    const { user } = useAuth();
    const reactToMessage = useChatStore((state) => state.reactToMessage);

    const handleReactionClick = async (emoji: string) => {
        if (!user?.id) return;
        await reactToMessage(messageId, emoji);
    };

    const grouped = reactions.reduce<Record<string, string[]>>((acc, reaction) => {
        const emoji = reaction.emoji;
        const userId = typeof reaction.user === 'string' ? reaction.user : reaction.user.id || (reaction.user as any)._id;

        acc[emoji] = acc[emoji] || [];
        acc[emoji].push(userId);
        return acc;
    }, {});

    return (
        <div className="d-flex gap-2 mt-1 flex-wrap">
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
        </div>
    );
};