# Meatec - Frontend

## Overview

This is the frontend application for the Meatec task management system. Built with React 19, TypeScript, and Vite, it provides a modern, responsive user interface for managing tasks.

## Technology Stack

- **React 19**: Latest version of the React library
- **TypeScript**: For type-safe code
- **Vite**: Fast build tool and development server
- **Redux Toolkit**: State management
- **React Router Dom v7**: Navigation and routing
- **TailwindCSS**: Utility-first CSS framework
- **Radix UI**: Accessible UI components
- **React Hook Form**: Form handling and validation
- **Zod**: Schema validation
- **Axios**: HTTP client for API requests

## Project Structure

```
frontend/
├── public/            # Static assets
├── src/
│   ├── api/           # API integration modules
│   ├── components/    # React components
│   │   ├── auth/      # Authentication components
│   │   ├── layout/    # Layout components
│   │   ├── tasks/     # Task-related components
│   │   └── ui/        # UI components (buttons, inputs, etc.)
│   ├── hooks/         # Custom React hooks
│   ├── lib/           # Utility functions
│   ├── pages/         # Page components
│   └── store/         # Redux store configuration
│       └── slices/    # Redux slices
├── App.tsx            # Main application component
└── main.tsx           # Entry point
```

## Getting Started

### Prerequisites

- Node.js (Latest LTS version recommended)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/SaranshBangar/meatec.git
cd meatec/frontend

# Install dependencies
npm install
# or
yarn install
```

### Development

```bash
# Start development server
npm run dev
# or
yarn dev
```

This will start the development server at http://localhost:5173 (default).

### Building for Production

```bash
# Build for production
npm run build
# or
yarn build

# Preview production build
npm run preview
# or
yarn preview
```

## Features

- User authentication (login/register)
- Task management (create, view, edit, delete)
- User profile management
- Responsive design for desktop and mobile devices
- Dark/light theme toggle

## Architecture

The application uses a modern React architecture with:

- Functional components with hooks
- Redux for global state management
- React Router for navigation
- Custom hooks for reusable logic
- Component-based UI design

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ["./tsconfig.node.json", "./tsconfig.app.json"],
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    "react-x": reactX,
    "react-dom": reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs["recommended-typescript"].rules,
    ...reactDom.configs.recommended.rules,
  },
});
```
