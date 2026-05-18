# Layout (matches parent app shape)

```
boilerplate/
├── components.json
├── eslint.config.js
├── index.html
├── package.json
├── public/
├── tailwind.config.ts
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts
└── src/
    ├── App.tsx
    ├── main.tsx
    ├── assets/
    ├── components/
    │   ├── Chatbot/
    │   ├── dashboard/
    │   │   ├── modals/
    │   │   └── tabs/
    │   ├── layout/          # Header, Footer, ScrollToTop, ProtectedRoute
    │   └── ui/              # shadcn / shared UI
    ├── context/             # ThemeProvider, Auth, Chat, etc.
    ├── data/                # static data modules
    ├── hooks/
    ├── lib/                 # clients, utils (e.g. cn, supabase)
    ├── pages/
    ├── routes/              # AppRoutes, lazy page barrel
    ├── styles/              # global.css, variables.css, page CSS
    └── types/
```

Add optional roots as needed: `wrangler.toml`, `SEO.md`, env samples.
