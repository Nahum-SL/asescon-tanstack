// Cambios clave:
// ✅ createRootRouteWithContext<RouterContext>() en vez de createRootRoute()
// ✅ beforeLoad llama getMeFn — se ejecuta en el servidor en CADA request
// ✅ component: RootComponent registrado correctamente
// ✅ shellComponent: RootDocument para el HTML shell del SSR

import {
  HeadContent,
  Scripts,
  Outlet,
  createRootRouteWithContext,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { TanStackDevtools } from "@tanstack/react-devtools";
import type { RouterContext } from "#/router";
import { getMeFn } from "#/server/auth";

import Header from "../components/Header";
import Footer from "../components/Footer";
import appCss from "../styles.css?url";

const THEME_INIT_SCRIPT = `(function(){try{var stored=window.localStorage.getItem('theme');var mode=(stored==='light'||stored==='dark'||stored==='auto')?stored:'auto';var prefersDark=window.matchMedia('(prefers-color-scheme: dark)').matches;var resolved=mode==='auto'?(prefersDark?'dark':'light'):mode;var root=document.documentElement;root.classList.remove('light','dark');root.classList.add(resolved);if(mode==='auto'){root.removeAttribute('data-theme')}else{root.setAttribute('data-theme',mode)}root.style.colorScheme=resolved;}catch(e){}})();`;

export const Route = createRootRouteWithContext<RouterContext>()({
  // ✅ beforeLoad corre en el servidor antes de renderizar
  // El valor que retorna se MERGE con el contexto del router
  beforeLoad: async () => {
    const user = await getMeFn();
    return {
      auth: { user },
    };
  },

  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "ASESCON" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),

  // shellComponent = el HTML que envuelve todo (solo se renderiza en el servidor)
  shellComponent: RootDocument,
  // component = el árbol React dentro del shell
  component: RootComponent,
});

function RootComponent() {
  return (
    <>
      <Header />
      <Outlet /> 
      <Footer />
      <TanStackDevtools
        config={{ position: "bottom-right" }}
        plugins={[
          {
            name: "Tanstack Router",
            render: <TanStackRouterDevtoolsPanel />,
          },
        ]}
      />
    </>
  );
}

function RootDocument({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <HeadContent />
      </head>
      <body className="font-sans antialiased wrap-anywhere selection:bg-[rgba(79,184,178,0.24)]">
        {children}
        <Scripts />
      </body>
    </html>
  );
}
