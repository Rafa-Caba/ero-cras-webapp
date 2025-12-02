import { useState } from 'react';
import { Button } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { useBlogStore } from '../../store/admin/useBlogStore';

interface Props {
    postId: string;
    initialLikes: number;
    initialLikesUsers: string[];
    currentUserId: string | undefined;
}

export const BlogLikeButton = ({ postId, initialLikes, initialLikesUsers, currentUserId }: Props) => {
    const { toggleLike } = useBlogStore();

    const safeInitialLikes = Math.max(0, initialLikes);
    const isInitiallyLiked = initialLikesUsers.includes(currentUserId || '');

    const [likes, setLikes] = useState(safeInitialLikes);
    const [liked, setLiked] = useState(isInitiallyLiked);
    const [loading, setLoading] = useState(false);

    const handleLike = async () => {
        if (!currentUserId) {
            Swal.fire('Aviso', 'Debes iniciar sesión', 'info');
            return;
        }

        if (loading) return;

        const previousLiked = liked;
        const previousLikes = likes;

        const newLikedState = !previousLiked;
        const newLikesCount = newLikedState
            ? previousLikes + 1
            : Math.max(0, previousLikes - 1);

        setLiked(newLikedState);
        setLikes(newLikesCount);
        setLoading(true);

        try {
            await toggleLike(postId);
        } catch (error) {
            console.error("Like failed", error);
            setLiked(previousLiked);
            setLikes(previousLikes);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button
            className="me-2 transition-all duration-200"
            style={{
                backgroundColor: liked ? '#7d2181' : 'transparent',
                borderColor: '#7d2181',
                color: liked ? '#fff' : '#7d2181',
                minWidth: '140px',
                opacity: loading ? 0.7 : 1
            }}
            onClick={handleLike}
        >
            {liked ? `❤️ Te gusta (${likes})` : `🤍 Me gusta (${likes})`}
        </Button>
    );
};