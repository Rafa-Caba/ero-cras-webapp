// src/layouts/public/PublicLayout.tsx

import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { Link as RouterLink, Outlet, useLocation, useNavigate } from 'react-router-dom';

import {
    AppBar,
    Avatar,
    Box,
    BottomNavigation,
    BottomNavigationAction,
    Button,
    Divider,
    Drawer,
    IconButton,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Paper,
    Toolbar,
    Typography,
    useMediaQuery,
} from '@mui/material';
import type { Theme } from '@mui/material/styles';

import AdminPanelSettingsRoundedIcon from '@mui/icons-material/AdminPanelSettingsRounded';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import ContactMailRoundedIcon from '@mui/icons-material/ContactMailRounded';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import MusicNoteRoundedIcon from '@mui/icons-material/MusicNoteRounded';

import { Footer } from '../../components/components-public/Footer';
import { useGalleryStore, useSettingsStore } from '../../store/public';
import { MuiAppThemeProvider } from '../../theme/mui/MuiAppThemeProvider';

interface PublicNavigationItem {
    label: string;
    path: string;
    icon: ReactNode;
}

const drawerWidth = 292;
const bottomNavHeight = 74;
const sideRailWidth = 170;

const reservedPublicSegments = ['members', 'songs', 'about', 'contact', 'blog', 'admin', 'auth'];

const getCompactTitle = (title: string) => {
    const words = title
        .replace(/[^a-zA-ZÀ-ÿ0-9\s]/g, ' ')
        .split(' ')
        .map((word) => word.trim())
        .filter(Boolean);

    if (words.length === 0) {
        return 'EC';
    }

    return words
        .slice(0, 4)
        .map((word) => word.charAt(0).toUpperCase())
        .join('');
};

const PublicLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const { settings, fetchSettings } = useSettingsStore();
    const { images, fetchGallery } = useGalleryStore();

    const isDesktop = useMediaQuery('(min-width:900px)');
    const showSideRails = useMediaQuery('(min-width:1200px)');

    const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

    useEffect(() => {
        void fetchSettings();
        void fetchGallery();
    }, [fetchGallery, fetchSettings]);

    useEffect(() => {
        if (settings?.webTitle) {
            document.title = settings.webTitle;
        } else {
            document.title = 'Ero Cras Oficial';
        }

        const logoImage = images.find((image) => image.imageLogo);
        const favicon = document.querySelector("link[rel='icon']") as HTMLLinkElement | null;

        if (favicon && logoImage) {
            favicon.href = logoImage.imageUrl || '/images/erocrasLogo.png';
        }
    }, [settings, images]);

    const fromAdmin = new URLSearchParams(location.search).get('fromAdmin') === 'true';

    const firstPathSegment = location.pathname.match(/^\/([^/?#]+)/)?.[1] || null;
    const choirKey =
        firstPathSegment && !reservedPublicSegments.includes(firstPathSegment)
            ? firstPathSegment
            : null;

    const basePath = choirKey ? `/${choirKey}` : '';
    const homePath = choirKey ? `/${choirKey}` : '/';

    const publicTitle = `${settings?.webTitle || 'Ero Cras'} Oficial`;
    const compactTitle = getCompactTitle(publicTitle);

    const logoImage = images.find((image) => image.imageLogo);
    const leftMenuImage = images.find((image) => image.imageLeftMenu);
    const rightMenuImage = images.find((image) => image.imageRightMenu);

    const navigationItems = useMemo<PublicNavigationItem[]>(() => {
        return [
            {
                label: 'Inicio',
                path: homePath,
                icon: <HomeRoundedIcon />,
            },
            {
                label: 'Miembros',
                path: `${basePath}/members`,
                icon: <GroupsRoundedIcon />,
            },
            {
                label: 'Cantos',
                path: `${basePath}/songs`,
                icon: <MusicNoteRoundedIcon />,
            },
            {
                label: 'Nosotros',
                path: `${basePath}/about`,
                icon: <InfoRoundedIcon />,
            },
            {
                label: 'Contacto',
                path: `${basePath}/contact`,
                icon: <ContactMailRoundedIcon />,
            },
        ];
    }, [basePath, homePath]);

    const buildPublicPath = (path: string) => {
        if (!fromAdmin) {
            return path;
        }

        const separator = path.includes('?') ? '&' : '?';
        return `${path}${separator}fromAdmin=true`;
    };

    const isActive = (path: string) => {
        if (path === homePath) {
            return location.pathname === homePath || location.pathname === '/';
        }

        return location.pathname === path || location.pathname.startsWith(`${path}/`);
    };

    const bottomNavigationValue = navigationItems.find((item) => isActive(item.path))?.path || homePath;

    const handleNavigate = (path: string) => {
        navigate(buildPublicPath(path));
        setMobileDrawerOpen(false);
    };

    const drawerPaperSx = {
        width: drawerWidth,
        background:
            'linear-gradient(180deg, color-mix(in srgb, var(--color-card) 96%, var(--color-primary) 4%) 0%, var(--color-card) 100%)',
        color: 'var(--color-text)',
        borderRight: '1px solid var(--color-border)',
        boxShadow: '0 16px 48px rgba(15, 23, 42, 0.12)',
    };

    const renderDrawerContent = () => (
        <Box
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
            }}
        >
            <Toolbar
                sx={{
                    minHeight: '72px !important',
                    px: 2,
                    gap: 1.5,
                    borderBottom: '1px solid var(--color-border)',
                }}
            >
                <Avatar
                    src={logoImage?.imageUrl}
                    alt={publicTitle}
                    sx={{
                        width: 44,
                        height: 44,
                        bgcolor: 'var(--color-primary)',
                        color: 'var(--color-button-text)',
                        fontWeight: 900,
                    }}
                >
                    {compactTitle}
                </Avatar>

                <Box sx={{ minWidth: 0, flex: 1 }}>
                    <Typography
                        variant="subtitle1"
                        sx={{
                            fontWeight: 950,
                            lineHeight: 1.1,
                            color: 'var(--color-text)',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                        }}
                    >
                        {publicTitle}
                    </Typography>

                    <Typography
                        variant="caption"
                        sx={{
                            display: 'block',
                            color: 'var(--color-secondary-text)',
                            fontWeight: 700,
                        }}
                    >
                        Navegación pública
                    </Typography>
                </Box>

                <IconButton
                    aria-label="Cerrar menú"
                    onClick={() => setMobileDrawerOpen(false)}
                    sx={{ color: 'var(--color-text)' }}
                >
                    <CloseRoundedIcon />
                </IconButton>
            </Toolbar>

            <Box sx={{ flex: 1, overflowY: 'auto', px: 1.25, py: 1.5 }}>
                <List disablePadding>
                    {navigationItems.map((item) => {
                        const selected = isActive(item.path);

                        return (
                            <ListItemButton
                                key={item.path}
                                selected={selected}
                                onClick={() => handleNavigate(item.path)}
                                sx={{
                                    mb: 0.6,
                                    borderRadius: 1.5,
                                    minHeight: 48,
                                    color: selected ? 'var(--color-button-text)' : 'var(--color-text)',
                                    backgroundColor: selected ? 'var(--color-button)' : 'transparent',
                                    '&:hover': {
                                        backgroundColor: selected
                                            ? 'var(--color-button)'
                                            : 'color-mix(in srgb, var(--color-button) 14%, transparent)',
                                        transform: 'translateX(2px)',
                                    },
                                    '&.Mui-selected': {
                                        backgroundColor: 'var(--color-button)',
                                    },
                                    '&.Mui-selected:hover': {
                                        backgroundColor: 'var(--color-button)',
                                    },
                                    transition: 'all 0.18s ease',
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        minWidth: 38,
                                        color: selected ? 'var(--color-button-text)' : 'var(--color-primary)',
                                    }}
                                >
                                    {item.icon}
                                </ListItemIcon>

                                <ListItemText
                                    primary={
                                        <Typography
                                            component="span"
                                            sx={{
                                                fontSize: '0.94rem',
                                                fontWeight: selected ? 900 : 700,
                                            }}
                                        >
                                            {item.label}
                                        </Typography>
                                    }
                                />
                            </ListItemButton>
                        );
                    })}
                </List>

                <Divider sx={{ my: 2, borderColor: 'var(--color-border)' }} />

                {fromAdmin ? (
                    <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<ArrowBackRoundedIcon />}
                        onClick={() => {
                            navigate('/admin', { replace: true });
                            setMobileDrawerOpen(false);
                        }}
                        sx={{
                            borderRadius: 1.5,
                            color: 'var(--color-primary)',
                            borderColor: 'var(--color-primary)',
                            fontWeight: 900,
                        }}
                    >
                        Volver al Admin
                    </Button>
                ) : (
                    <Button
                        fullWidth
                        variant="contained"
                        startIcon={<AdminPanelSettingsRoundedIcon />}
                        onClick={() => {
                            navigate('/admin');
                            setMobileDrawerOpen(false);
                        }}
                        sx={{
                            borderRadius: 1.5,
                            backgroundColor: 'var(--color-button)',
                            color: 'var(--color-button-text)',
                            fontWeight: 900,
                            '&:hover': {
                                backgroundColor: 'color-mix(in srgb, var(--color-button) 86%, #000 14%)',
                            },
                        }}
                    >
                        Ir al Admin
                    </Button>
                )}
            </Box>
        </Box>
    );

    return (
        <MuiAppThemeProvider>
            <Box
                className="public-mui-shell"
                sx={{
                    minHeight: '100vh',
                    width: '100%',
                    overflowX: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    background:
                        'linear-gradient(135deg, color-mix(in srgb, var(--color-background) 94%, var(--color-primary) 6%) 0%, var(--color-background) 60%, color-mix(in srgb, var(--color-background) 92%, var(--color-accent) 8%) 100%)',
                    color: 'var(--color-text)',
                }}
            >
                <AppBar
                    position="sticky"
                    elevation={0}
                    sx={{
                        background:
                            'linear-gradient(90deg, color-mix(in srgb, var(--color-primary) 92%, #000 8%) 0%, var(--color-primary) 55%, var(--color-accent) 100%)',
                        color: 'var(--color-button-text)',
                        borderBottom: '1px solid color-mix(in srgb, var(--color-border) 60%, transparent)',
                        boxShadow: '0 8px 24px rgba(15, 23, 42, 0.12)',
                    }}
                >
                    <Toolbar
                        sx={{
                            minHeight: {
                                xs: '72px !important',
                                md: '68px !important',
                            },
                            gap: 1.25,
                            px: {
                                xs: 1.5,
                                sm: 2,
                                md: 3,
                            },
                        }}
                    >
                        {!isDesktop && (
                            <IconButton
                                aria-label="Abrir menú"
                                onClick={() => setMobileDrawerOpen(true)}
                                sx={{
                                    color: 'var(--color-button-text)',
                                    border: '1px solid color-mix(in srgb, var(--color-button-text) 35%, transparent)',
                                    borderRadius: 1.5,
                                }}
                            >
                                <MenuRoundedIcon />
                            </IconButton>
                        )}

                        <Avatar
                            src={logoImage?.imageUrl}
                            alt={publicTitle}
                            sx={{
                                width: { xs: 40, md: 46 },
                                height: { xs: 40, md: 46 },
                                bgcolor: 'rgba(255, 255, 255, 0.18)',
                                color: 'var(--color-button-text)',
                                fontWeight: 950,
                                border: '1px solid rgba(255, 255, 255, 0.28)',
                            }}
                        >
                            {compactTitle}
                        </Avatar>

                        <Box sx={{ minWidth: 0, flex: 1 }}>
                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: 950,
                                    lineHeight: 1.1,
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                }}
                            >
                                {publicTitle}
                            </Typography>
                        </Box>

                        {isDesktop && fromAdmin && (
                            <Button
                                variant="outlined"
                                startIcon={<ArrowBackRoundedIcon />}
                                onClick={() => navigate('/admin', { replace: true })}
                                sx={{
                                    borderRadius: 1.5,
                                    color: 'var(--color-button-text)',
                                    borderColor: 'rgba(255, 255, 255, 0.42)',
                                    fontWeight: 900,
                                    '&:hover': {
                                        borderColor: 'rgba(255, 255, 255, 0.72)',
                                        backgroundColor: 'rgba(255, 255, 255, 0.14)',
                                    },
                                }}
                            >
                                Volver al Admin
                            </Button>
                        )}

                        {isDesktop && !fromAdmin && (
                            <Button
                                variant="outlined"
                                startIcon={<AdminPanelSettingsRoundedIcon />}
                                onClick={() => navigate('/admin')}
                                sx={{
                                    borderRadius: 1.5,
                                    color: 'var(--color-button-text)',
                                    borderColor: 'rgba(255, 255, 255, 0.42)',
                                    fontWeight: 900,
                                    '&:hover': {
                                        borderColor: 'rgba(255, 255, 255, 0.72)',
                                        backgroundColor: 'rgba(255, 255, 255, 0.14)',
                                    },
                                }}
                            >
                                Admin
                            </Button>
                        )}

                        {!isDesktop && fromAdmin && (
                            <Button
                                variant="outlined"
                                size="small"
                                startIcon={<ArrowBackRoundedIcon />}
                                onClick={() => navigate('/admin', { replace: true })}
                                sx={{
                                    borderRadius: 1.5,
                                    color: 'var(--color-button-text)',
                                    borderColor: 'rgba(255, 255, 255, 0.42)',
                                    fontWeight: 900,
                                    minWidth: 'auto',
                                    '& .MuiButton-startIcon': {
                                        mr: { xs: 0, sm: 0.75 },
                                    },
                                }}
                            >
                                <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
                                    Admin
                                </Box>
                            </Button>
                        )}
                    </Toolbar>

                    {isDesktop && (
                        <Box
                            component="nav"
                            aria-label="Navegación pública"
                            sx={{
                                width: '100%',
                                px: 0,
                                py: 0,
                                backgroundColor: 'color-mix(in srgb, var(--color-card) 82%, transparent)',
                                borderTop: '1px solid color-mix(in srgb, var(--color-border) 55%, transparent)',
                                borderBottom: '1px solid color-mix(in srgb, var(--color-border) 75%, transparent)',
                                backdropFilter: 'blur(12px)',
                            }}
                        >
                            <Box
                                sx={{
                                    width: '100%',
                                    display: 'grid',
                                    gridTemplateColumns: `repeat(${navigationItems.length}, minmax(0, 1fr))`,
                                    alignItems: 'stretch',
                                }}
                            >
                                {navigationItems.map((item) => {
                                    const selected = isActive(item.path);

                                    return (
                                        <Button
                                            key={item.path}
                                            component={RouterLink}
                                            to={buildPublicPath(item.path)}
                                            sx={{
                                                minHeight: 50,
                                                borderRadius: 0,
                                                color: selected ? 'var(--color-button-text)' : 'var(--color-text)',
                                                backgroundColor: selected ? 'var(--color-button)' : 'transparent',
                                                fontWeight: selected ? 950 : 800,
                                                '&:last-of-type': {
                                                    borderRight: 'none',
                                                },
                                                '&:hover': {
                                                    color: 'var(--color-button-text)',
                                                    backgroundColor: 'var(--color-accent)',
                                                },
                                            }}
                                        >
                                            {item.label}
                                        </Button>
                                    );
                                })}
                            </Box>
                        </Box>
                    )}
                </AppBar>

                <Drawer
                    variant="temporary"
                    open={mobileDrawerOpen}
                    onClose={() => setMobileDrawerOpen(false)}
                    ModalProps={{
                        keepMounted: true,
                    }}
                    slotProps={{
                        paper: {
                            sx: drawerPaperSx,
                        },
                    }}
                    sx={{
                        display: { xs: 'block', md: 'none' },
                    }}
                >
                    {renderDrawerContent()}
                </Drawer>

                <Box
                    component="main"
                    sx={{
                        width: '100%',
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        px: {
                            xs: 0,
                            sm: 1,
                            md: 1.5,
                            xl: 2,
                        },
                        pt: {
                            xs: 1.25,
                            md: 2,
                        },
                        pb: {
                            xs: `${bottomNavHeight + 18}px`,
                            md: 2,
                        },
                    }}
                >
                    <Box
                        sx={{
                            width: '100%',
                            maxWidth: '1840px',
                            mx: 'auto',
                            flex: 1,
                            display: 'grid',
                            gridTemplateColumns: {
                                xs: '1fr',
                                xl: showSideRails ? `${sideRailWidth}px minmax(0, 1fr) ${sideRailWidth}px` : '1fr',
                            },
                            gap: {
                                xs: 0,
                                xl: 1.5,
                            },
                            alignItems: 'stretch',
                        }}
                    >
                        {showSideRails && (
                            <Paper
                                elevation={0}
                                sx={{
                                    display: { xs: 'none', xl: 'block' },
                                    alignSelf: 'start',
                                    p: 1,
                                    borderRadius: 1.5,
                                    backgroundColor: 'color-mix(in srgb, var(--color-card) 84%, transparent)',
                                    border: '1px solid var(--color-border)',
                                    color: 'var(--color-text)',
                                    boxShadow: '0 10px 28px rgba(15, 23, 42, 0.06)',
                                    overflow: 'hidden',
                                }}
                            >
                                {leftMenuImage && (
                                    <Box
                                        component="img"
                                        src={leftMenuImage.imageUrl}
                                        alt={leftMenuImage.title || 'Imagen lateral izquierda'}
                                        sx={{
                                            width: '100%',
                                            maxHeight: 110,
                                            objectFit: 'cover',
                                            display: 'block',
                                            borderRadius: 1,
                                        }}
                                    />
                                )}
                            </Paper>
                        )}

                        <Paper
                            elevation={0}
                            sx={{
                                width: '100%',
                                minWidth: 0,
                                minHeight: {
                                    xs: '72vh',
                                    md: '100%',
                                },
                                display: 'flex',
                                flexDirection: 'column',
                                p: {
                                    xs: 1,
                                    sm: 1.25,
                                    md: 1.5,
                                },
                                borderRadius: {
                                    xs: 0,
                                    sm: 1.5,
                                },
                                backgroundColor: 'color-mix(in srgb, var(--color-card) 76%, transparent)',
                                border: {
                                    xs: 'none',
                                    sm: '1px solid color-mix(in srgb, var(--color-border) 88%, transparent)',
                                },
                                color: 'var(--color-text)',
                                boxShadow: {
                                    xs: 'none',
                                    sm: '0 12px 42px rgba(15, 23, 42, 0.07)',
                                },
                                overflow: 'hidden',
                                '& > *': {
                                    flex: 1,
                                    minHeight: 0,
                                },
                                '& section': {
                                    minHeight: '100%',
                                },
                                '& section > .MuiPaper-root': {
                                    minHeight: '100%',
                                },
                            }}
                        >
                            <Outlet />
                        </Paper>

                        {showSideRails && (
                            <Paper
                                elevation={0}
                                sx={{
                                    display: { xs: 'none', xl: 'block' },
                                    alignSelf: 'start',
                                    p: 1,
                                    borderRadius: 1.5,
                                    backgroundColor: 'color-mix(in srgb, var(--color-card) 84%, transparent)',
                                    border: '1px solid var(--color-border)',
                                    color: 'var(--color-text)',
                                    boxShadow: '0 10px 28px rgba(15, 23, 42, 0.06)',
                                    overflow: 'hidden',
                                }}
                            >
                                {rightMenuImage && (
                                    <Box
                                        component="img"
                                        src={rightMenuImage.imageUrl}
                                        alt={rightMenuImage.title || 'Imagen lateral derecha'}
                                        sx={{
                                            width: '100%',
                                            maxHeight: 110,
                                            objectFit: 'cover',
                                            display: 'block',
                                            borderRadius: 1,
                                        }}
                                    />
                                )}
                            </Paper>
                        )}
                    </Box>
                </Box>

                {!isDesktop && (
                    <Paper
                        elevation={10}
                        sx={{
                            position: 'fixed',
                            left: 10,
                            right: 10,
                            bottom: 10,
                            zIndex: (theme: Theme) => theme.zIndex.appBar + 1,
                            borderRadius: 1.5,
                            overflow: 'hidden',
                            backgroundColor: 'var(--color-card)',
                            border: '1px solid var(--color-border)',
                            boxShadow: '0 14px 40px rgba(15, 23, 42, 0.22)',
                        }}
                    >
                        <BottomNavigation
                            value={bottomNavigationValue}
                            onChange={(_event, newValue: string) => handleNavigate(newValue)}
                            showLabels
                            sx={{
                                height: bottomNavHeight,
                                backgroundColor: 'var(--color-card)',
                                '& .MuiBottomNavigationAction-root': {
                                    color: 'var(--color-secondary-text)',
                                    minWidth: 0,
                                    px: 0.25,
                                },
                                '& .Mui-selected': {
                                    color: 'var(--color-primary)',
                                },
                                '& .MuiBottomNavigationAction-label': {
                                    fontSize: '0.68rem',
                                    fontWeight: 800,
                                },
                            }}
                        >
                            {navigationItems.map((item) => (
                                <BottomNavigationAction
                                    key={item.path}
                                    label={item.label}
                                    value={item.path}
                                    icon={item.icon}
                                />
                            ))}
                        </BottomNavigation>
                    </Paper>
                )}

                <Box
                    sx={{
                        mt: 'auto',
                        pb: {
                            xs: `${bottomNavHeight + 8}px`,
                            md: 0,
                        },
                    }}
                >
                    <Footer />
                </Box>
            </Box>
        </MuiAppThemeProvider>
    );
};

export default PublicLayout;