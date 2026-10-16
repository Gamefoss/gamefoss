import type { IconType } from 'react-icons';
import {
  FaArrowLeft,
  FaArrowRight,
  FaApple,
  FaCookieBite,
  FaEnvelope,
  FaExternalLinkAlt,
  FaGithub,
  FaGhost,
  FaGamepad,
  FaHeadphones,
  FaHeart,
  FaHome,
  FaInstagram,
  FaLink,
  FaLinkedinIn,
  FaMinus,
  FaNewspaper,
  FaSearch,
  FaShareAlt,
  FaRss,
  FaSpotify,
  FaTwitch,
  FaTwitter,
  FaUsers,
  FaWhatsapp,
  FaYoutube,
  FaPlay,
  FaRegHeart,
} from 'react-icons/fa';
import { SiCastbox } from 'react-icons/si';
import { SiBluesky } from 'react-icons/si';
import { BsStarFill } from "react-icons/bs";

const icons = {
  'arrow-left': FaArrowLeft,
  'arrow-right': FaArrowRight,
  apple: FaApple,
  castbox: SiCastbox,
  cookie: FaCookieBite,
  email: FaEnvelope,
  'external-link': FaExternalLinkAlt,
  github: FaGithub,
  ghost: FaGhost,
  gamepad: FaGamepad,
  headphones: FaHeadphones,
  heart: FaHeart,
  'heart-outline': FaRegHeart,
  home: FaHome,
  instagram: FaInstagram,
  link: FaLink,
  linkedin: FaLinkedinIn,
  minus: FaMinus,
  newspaper: FaNewspaper,
  bluesky: SiBluesky,
  search: FaSearch,
  share: FaShareAlt,
  rss: FaRss,
  spotify: FaSpotify,
  twitch: FaTwitch,
  twitter: FaTwitter,
  users: FaUsers,
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
