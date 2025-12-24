// renderer/usePageContext.tsx
import React, { useContext } from 'react';

export type PageContext = {
    Page: any;
    pageProps?: any;
    urlPathname: string;
    exports: {
        documentProps?: {
            title?: string;
            description?: string;
        };
    };
    session?: any;
};

const Context = React.createContext<PageContext>(undefined as any);

export function PageContextProvider({
                                        pageContext,
                                        children,
                                    }: {
    pageContext: PageContext;
    children: React.ReactNode;
}) {
    return <Context.Provider value={pageContext}>{children}</Context.Provider>;
}

export function usePageContext() {
    const pageContext = useContext(Context);
    return pageContext;
}
