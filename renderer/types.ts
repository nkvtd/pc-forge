export type PageProps = Record<string, unknown>;

declare global {
    namespace Vike {
        interface PageContext {
            pageProps?: PageProps;
        }
    }
}
