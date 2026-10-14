/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_SITE_URL?: string;
  readonly PUBLIC_BASE_PATH?: string;
  readonly PUBLIC_GTAG_ID?: string;
  readonly PUBLIC_ADSENSE_CLIENT?: string;
  readonly PUBLIC_ADSENSE_SLOT?: string;
  readonly PUBLIC_CONTACT_EMAIL?: string;
  readonly PUBLIC_GOOGLE_SITE_VERIFICATION?: string;
  readonly DEPLOY_ENV?: 'development' | 'production';
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
