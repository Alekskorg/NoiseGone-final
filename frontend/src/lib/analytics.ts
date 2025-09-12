/**
 * Аналитика-заглушка. В реальном проекте здесь будет интеграция
 * с Vercel Analytics, Plausible, Amplitude и т.д.
 */
type EventName = 
  | 'upload_started'
  | 'record_started'
  | 'process_started'
  | 'process_done'
  | 'process_error'
  | 'download_clicked';

type EventPayload = {
    [key: string]: string | number | boolean | undefined;
};

export const track = (event: EventName, payload?: EventPayload) => {
    if (process.env.NODE_ENV === 'production') {
        // Здесь будет код для отправки события в вашу систему аналитики
    } else {
        console.log(`[Analytics] Event: ${event}`, payload || '');
    }
};
