export const ANALYTICS_EVENT_NAME = 'ui_interaction';

const CONSENT_STORAGE_KEY = 'gamefoss-consent-v1';

type Gtag = (
  command: 'event',
  eventName: string,
  parameters: { interaction_name: string; link_url?: string },
) => void;

declare global {
  interface Window {
    gtag?: Gtag;
  }
}

function hasAnalyticsConsent(): boolean {
  try {
    const choice = JSON.parse(localStorage.getItem(CONSENT_STORAGE_KEY) || 'null');
    return choice?.analytics === true;
  } catch {
    return false;
  }
}

function getTrackedElement(target: EventTarget | null): HTMLElement | null {
  return target instanceof Element ? target.closest<HTMLElement>('[data-ga]') : null;
}

export function initAnalyticsTracking(documentRef: Document = document): () => void {
  const handleClick = (event: Event) => {
    if (!hasAnalyticsConsent() || !window.gtag) return;

    const trackedElement = getTrackedElement(event.target);
    const interactionName = trackedElement?.dataset.ga?.trim();
    if (!trackedElement || !interactionName) return;

    const link = trackedElement.closest<HTMLAnchorElement>('a[href]');
    window.gtag('event', ANALYTICS_EVENT_NAME, {
      interaction_name: interactionName,
      ...(link ? { link_url: link.href } : {}),
    });
  };

  documentRef.addEventListener('click', handleClick);
  return () => documentRef.removeEventListener('click', handleClick);
}
