import type { ChatMessage } from '../../types/chat';
import { ChatBubble } from './ChatBubble';

interface Props {
    groupedMessages: Record<string, ChatMessage[]>;
    isOwnMessage: (id: string) => boolean;
    setExpandedImage: (url: string) => void;
    onPreviewClick: (
        type: 'image' | 'file' | 'audio' | 'video',
        url: string,
        name?: string
    ) => void;
    onReply: (message: ChatMessage) => void;
}

export const AdminChatBubbles = ({
    groupedMessages,
    isOwnMessage,
    setExpandedImage,
    onPreviewClick,
    onReply
}: Props) => {
    const dates = Object.entries(groupedMessages);

    if (dates.length === 0) {
        return (
            <div className="d-flex justify-content-center">
                <p>No hay mensajes</p>
            </div>
        );
    }

    return (
        <>
            {dates.map(([date, msgsOfDay]) => (
                <div key={date}>
                    <div className="relative my-3 text-center">
                        <hr className="border-t border-gray-300" />
                        <span className="absolute left-1/2 -translate-x-1/2 -top-3 dark:bg-gray-900 px-3 text-theme-color fw-bold text-sm">
                            {date}
                        </span>
                    </div>

                    {msgsOfDay.map((msg, i) => {
                        if (!msg || !(msg as any).author) {
                            console.warn('Skipping invalid chat message in AdminChatBubbles:', msg);
                            return null;
                        }

                        const previous = i > 0 ? msgsOfDay[i - 1] : undefined;

                        return (
                            <ChatBubble
                                key={msg.id || i}
                                msg={msg}
                                previous={previous}
                                isOwn={isOwnMessage(msg.author.id)}
                                onImageClick={setExpandedImage}
                                onAvatarClick={setExpandedImage}
                                onPreviewClick={onPreviewClick}
                                onReply={onReply}
                            />
                        );
                    })}
                </div>
            ))}
        </>
    );
};
