import type { IconType } from 'react-icons';
import {
  FaArrowLeft,
  FaArrowRight,
  FaApple,
  FaCookieBite,
  FaExternalLinkAlt,
  FaHeadphones,
  FaHeart,
  FaHome,
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
  FaRegHeart,
} from 'react-icons/fa';
import { SiCastbox } from 'react-icons/si';
import { BsStarFill } from "react-icons/bs";

const icons = {
  'arrow-left': FaArrowLeft,
  'arrow-right': FaArrowRight,
  apple: FaApple,
  castbox: SiCastbox,
  cookie: FaCookieBite,
  'external-link': FaExternalLinkAlt,
  headphones: FaHeadphones,
  heart: FaHeart,
  'heart-outline': FaRegHeart,
  home: FaHome,
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
  star: BsStarFill,
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
