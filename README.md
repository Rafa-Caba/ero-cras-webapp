# Erocras React App

This project is a React + TypeScript migration of an existing PHP/JS website and admin panel. The structure supports both **public** and **admin** sections, each with its own layout and components for better separation and maintainability.

---

## 📦 Project Structure

```
src/
├── App.tsx               # Main routing logic
├── main.tsx              # React entry point
├── layouts/              # Layout wrappers
│   ├── admin/
│   │   └── AdminLayout.tsx
│   └── public/
│       └── PublicLayout.tsx
├── components-admin/     # Reusable components for Admin UI
│   ├── Sidebar.tsx
│   └── Topbar.tsx
├── components-public/    # Reusable components for Public UI
│   ├── Header.tsx
│   └── Footer.tsx
├── pages/
│   ├── admin/             # Admin pages
│   │   ├── Dashboard.tsx
│   │   └── Users.tsx
│   ├── public/            # Public-facing pages
│   │   ├── Home.tsx
│   │   ├── Contact.tsx
│   │   ├── Miembros.tsx
│   │   ├── MisaErocras.tsx
│   │   └── Nosotros.tsx
│   └── Login.tsx          # Admin login page
public/
└── index.html            # App container
```

---

## 🚀 Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Run the development server

```bash
npm run dev
```

### 3. Build for production

```bash
npm run build
```

---

## 🔧 Technologies Used

- React
- TypeScript
- Vite
- React Router DOM

---

## 🧪 Linting Setup

This project is ready to support ESLint with React and TypeScript.
You can customize it by enabling stricter rules or using tools like:

- [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x)
- [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom)

### Example `eslint.config.js` snippet:

```js
import reactX from 'eslint-plugin-react-x';
import reactDom from 'eslint-plugin-react-dom';

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      reactX.configs['recommended-typescript'],
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
]);
```

---

## 🛠 Development Notes

- Public and admin sections are **separated** for modularity.
- Each section uses its own layout and component folders.
- Authentication handling is pending — currently, the `/admin` route is unprotected.

---

## ✍️ Author

Rafael Cabanillas

---

## ✅ To Do

- Implement authentication and route protection.
- Add real data fetching.
- Migrate content from legacy PHP views.
- Add unit and integration tests.
