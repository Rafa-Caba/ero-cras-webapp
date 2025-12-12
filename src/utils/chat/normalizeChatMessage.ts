import type {
    ChatMessage,
    MessageType,
    ChatUserSummary,
    ReplyPreview,
    MessageReaction
} from '../../types/chat';

const extractTextFromTiptap = (content: any): string => {
    if (!content) return '';

    if (typeof content === 'string') return content;

    if (typeof content !== 'object') return '';

    let text = '';

    const traverse = (nodes: any[]) => {
        if (!Array.isArray(nodes)) return;

        nodes.forEach((node) => {
            if (node.type === 'text' && typeof node.text === 'string') {
                text += node.text;
            } else if (node.type === 'hardBreak') {
                text += '\n';
            } else if (Array.isArray(node.content)) {
                traverse(node.content);
            }
        });
    };

    if (Array.isArray(content.content)) {
        traverse(content.content);
    }

    return text.trim();
};

const normalizeReplyTo = (rawReply: any): ReplyPreview | null => {
    if (!rawReply) return null;
    if (typeof rawReply !== 'object') return null;

    const id = (rawReply.id ?? rawReply._id ?? '').toString();

    const username =
        rawReply.username ||
        rawReply.author?.username ||
        rawReply.author?.name ||
        'Usuario';

    let textPreview: string | undefined = rawReply.textPreview;

    if (!textPreview) {
        // Fall back to content if available
        const content = rawReply.content ?? rawReply.contenido;
        textPreview = extractTextFromTiptap(content);
    }

    return {
        id,
        username,
        textPreview: textPreview ?? ''
    };
};

const normalizeReactions = (rawReactions: any): MessageReaction[] => {
    if (!Array.isArray(rawReactions)) return [];

    return rawReactions.map((r: any) => {
        const rawUser = r.user ?? r.usuario;

        let user: ChatUserSummary | string = '';
        let username: string | undefined = r.username;

        if (rawUser && typeof rawUser === 'object') {
            const id = (rawUser.id ?? rawUser._id ?? '').toString();
            user = {
                id,
                name: rawUser.name || 'Usuario',
                username: rawUser.username || 'usuario',
                imageUrl: rawUser.imageUrl || ''
            };
            if (!username) {
                username = rawUser.username || rawUser.name || id;
            }
        } else if (typeof rawUser === 'string') {
            user = rawUser;
            if (!username) username = rawUser;
        }

        return {
            emoji: r.emoji || '',
            user,
            username
        };
    });
};

export const normalizeChatMessage = (raw: any): ChatMessage => {
    const base = raw ?? {};

    const rawAuthor: any = base.author || base.user || {};
    const author: ChatUserSummary = {
        id: (rawAuthor.id || rawAuthor._id || '').toString(),
        name: rawAuthor.name || 'Usuario',
        username: rawAuthor.username || 'usuario',
        imageUrl: rawAuthor.imageUrl || ''
    };

    const id = (base.id ?? base._id ?? '').toString();
    const choirId = (base.choirId ?? '').toString();
    const createdAt: string = base.createdAt ?? new Date().toISOString();
    const updatedAt: string = base.updatedAt ?? createdAt;

    const replyTo = normalizeReplyTo(base.replyTo);
    const reactions = normalizeReactions(base.reactions);

    return {
        id,
        choirId,
        author,
        content: base.content,
        type: (base.type ?? 'TEXT') as MessageType,

        fileUrl: base.fileUrl ?? '',
        filename: base.filename ?? '',
        imageUrl: base.imageUrl,
        audioUrl: base.audioUrl,
        imagePublicId: base.imagePublicId,

        reactions,
        replyTo,

        createdAt,
        updatedAt
    };
};
