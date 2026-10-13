import type { IconType } from 'react-icons';
import {
  FaArrowLeft,
  FaArrowRight,
  FaInstagram,
  FaLink,
  FaLinkedinIn,
  FaShareAlt,
  FaSpotify,
  FaTwitch,
  FaTwitter,
  FaWhatsapp,
  FaYoutube,
} from 'react-icons/fa';

const icons = {
  'arrow-left': FaArrowLeft,
  'arrow-right': FaArrowRight,
  instagram: FaInstagram,
  link: FaLink,
  linkedin: FaLinkedinIn,
  share: FaShareAlt,
  spotify: FaSpotify,
  twitch: FaTwitch,
  twitter: FaTwitter,
  whatsapp: FaWhatsapp,
  youtube: FaYoutube,
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
