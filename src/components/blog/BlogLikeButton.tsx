// src/components/blog/BlogLikeButton.tsx

import { useState } from 'react';
import Swal from 'sweetalert2';

import {
    Button,
    CircularProgress,
} from '@mui/material';

import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';

import { useBlogStore } from '../../store/admin/useBlogStore';

interface Props {
    postId: string;
    initialLikes: number;
    initialLikesUsers: string[];
    currentUserId: string | undefined;
}

export const BlogLikeButton = ({
    postId,
    initialLikes,
    initialLikesUsers,
    currentUserId,
}: Props) => {
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

        if (loading) {
            return;
        }

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
        } catch {
            setLiked(previousLiked);
            setLikes(previousLikes);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button
            type="button"
            variant={liked ? 'contained' : 'outlined'}
            onClick={handleLike}
            disabled={loading}
            startIcon={
                loading ? (
                    <CircularProgress size={18} />
                ) : liked ? (
                    <FavoriteRoundedIcon />
                ) : (
                    <FavoriteBorderRoundedIcon />
                )
            }
            sx={{
                minWidth: 160,
                borderRadius: 1.5,
                px: 2.5,
                py: 0.9,
                fontWeight: 950,
                color: liked ? 'var(--color-button-text)' : 'var(--color-primary)',
                backgroundColor: liked ? 'var(--color-button)' : 'transparent',
                borderColor: 'var(--color-primary)',
                opacity: loading ? 0.72 : 1,
                '&:hover': {
                    backgroundColor: liked
                        ? 'var(--color-accent)'
                        : 'color-mix(in srgb, var(--color-primary) 10%, transparent)',
                    borderColor: 'var(--color-accent)',
                },
            }}
        >
            {liked ? `Te gusta (${likes})` : `Me gusta (${likes})`}
        </Button>
    );
};