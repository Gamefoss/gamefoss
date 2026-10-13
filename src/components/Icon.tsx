import type { IconType } from 'react-icons';
import {
  FaArrowLeft,
  FaArrowRight,
  FaApple,
  FaCookieBite,
  FaExternalLinkAlt,
  FaInstagram,
  FaLink,
  FaLinkedinIn,
  FaSearch,
  FaShareAlt,
  FaRss,
  FaSpotify,
  FaTwitch,
  FaTwitter,
  FaWhatsapp,
  FaYoutube,
  FaPlay,
} from 'react-icons/fa';
import { SiCastbox } from 'react-icons/si';

const icons = {
  'arrow-left': FaArrowLeft,
  'arrow-right': FaArrowRight,
  apple: FaApple,
  castbox: SiCastbox,
  cookie: FaCookieBite,
  'external-link': FaExternalLinkAlt,
  instagram: FaInstagram,
  link: FaLink,
  linkedin: FaLinkedinIn,
  search: FaSearch,
  share: FaShareAlt,
  rss: FaRss,
  spotify: FaSpotify,
  twitch: FaTwitch,
  twitter: FaTwitter,
  whatsapp: FaWhatsapp,
  youtube: FaYoutube,
  play: FaPlay,
} satisfies Record<string, IconType>;

export type IconName = keyof typeof icons;

interface Props {
  name: IconName;
  label?: string;
  className?: string;
}

export default function Icon({ name, label, className }: Props) {
  const Component = icons[name];

  return (
    <Component
      className={className}
      aria-hidden={label ? undefined : true}
      aria-label={label}
      role={label ? 'img' : undefined}
      focusable="false"
    />
  );
}
