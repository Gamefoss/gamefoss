import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';
import Icon, { type IconName } from './Icon';

type Variant = 'primary' | 'ghost' | 'accent' | 'white';

interface SharedProps {
  variant?: Variant;
  iconPosition?: 'left' | 'right';
  className?: string;
}

type ContentProps = {
  children: ReactNode;
  icon?: IconName;
  iconOnly?: false;
} | {
  children?: never;
  icon: IconName;
  iconOnly: true;
  'aria-label': string;
};

type LinkProps = SharedProps & ContentProps & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'children'> & {
  as: 'a';
  href: string;
};

type NativeButtonProps = SharedProps & ContentProps & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & {
  as?: 'button';
};

export type ButtonProps = LinkProps | NativeButtonProps;

export default function Button(props: ButtonProps) {
  const {
    children,
    variant = 'primary',
    icon,
    iconOnly = false,
    iconPosition = 'left',
    className,
  } = props;
  const classes = ['button', variant !== 'primary' && `button--${variant}`, iconOnly && 'button--icon-only', className].filter(Boolean).join(' ');
  const content = <>{icon && (iconOnly || iconPosition === 'left') && <Icon name={icon} />}{!iconOnly && <span>{children}</span>}{icon && !iconOnly && iconPosition === 'right' && <Icon name={icon} />}</>;

  if (props.as === 'a') {
    const { as: _as, variant: _variant, icon: _icon, iconOnly: _iconOnly, iconPosition: _iconPosition, className: _className, children: _children, ...anchorProps } = props;
    return <a {...anchorProps} className={classes}>{content}</a>;
  }

  const { as: _as, variant: _variant, icon: _icon, iconOnly: _iconOnly, iconPosition: _iconPosition, className: _className, children: _children, ...buttonProps } = props;
  return <button {...buttonProps} className={classes}>{content}</button>;
}
