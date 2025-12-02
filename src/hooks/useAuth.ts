// import { useContext } from 'react';
// import { AuthContext } from '../context/AuthContext';

// export const useAuth = () => {
//     const context = useContext(AuthContext);
//     if (!context) throw new Error('useAuth must be used within an AuthProvider');

//     const { user } = context;

//     // 🛡️ Role Helpers
//     // ADMIN: God mode (Settings, Logs, Users, plus all content)
//     const isAdmin = user?.role === 'ADMIN';
    
//     // EDITOR: Can Create/Edit/Delete content (Songs, Gallery, etc.) + Admin
//     const canEdit = user?.role === 'ADMIN' || user?.role === 'EDITOR';

//     return { ...context, isAdmin, canEdit };
// };