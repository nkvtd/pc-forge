declare module '@emotion/server/create-instance' {
    import { EmotionCache } from '@emotion/cache';

    export interface EmotionServer {
        extractCriticalToChunks: (html: string) => { styles: any[]; html: string };
        constructStyleTagsFromChunks: (chunks: any) => string;
    }

    export default function createEmotionServer(cache: EmotionCache): EmotionServer;
}
