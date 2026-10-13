import { useEffect, useRef, useState } from 'react';
import Button from './Button';
import type { IconName } from './Icon';

interface Props {
  title: string;
  url: string;
  description: string;
}

export default function Share({ title, url, description }: Props) {
  const [canCopy, setCanCopy] = useState(false);
  const [canShare, setCanShare] = useState(false);
  const [copyLabel, setCopyLabel] = useState('Copiar link');
  const [status, setStatus] = useState('');
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setCanCopy(typeof navigator.clipboard?.writeText === 'function');
    setCanShare(typeof navigator.share === 'function');
    return () => {
      if (resetTimer.current) clearTimeout(resetTimer.current);
    };
  }, []);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopyLabel('Link copiado');
      setStatus('Link copiado');
    } catch {
      setCopyLabel('Não foi possível copiar');
      setStatus('Não foi possível copiar o link');
    }
    if (resetTimer.current) clearTimeout(resetTimer.current);
    resetTimer.current = setTimeout(() => setCopyLabel('Copiar link'), 2000);
  }

  async function nativeShare() {
    try {
      await navigator.share({ title, text: description, url });
    } catch (error) {
      if (!(error instanceof DOMException && error.name === 'AbortError')) {
        setStatus('Não foi possível compartilhar este conteúdo');
      }
    }
  }

  const encodedUrl = encodeURIComponent(url);
  const encodedText = encodeURIComponent(`${title} — ${description}`);
  const links = [
    { label: 'Twitter', href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`, icon: 'twitter' },
    { label: 'LinkedIn', href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`, icon: 'linkedin' },
    { label: 'WhatsApp', href: `https://api.whatsapp.com/send?text=${encodedText}%20${encodedUrl}`, icon: 'whatsapp' },
  ] satisfies { label: string; href: string; icon: IconName }[];

  return (
    <section className="share" aria-labelledby="share-title">
      <h2 className="share__title" id="share-title">Compartilhe</h2>
      <div className="share__actions">
        {canCopy && <Button variant="white" className="share__action" type="button" onClick={copyLink} icon="link">{copyLabel}</Button>}
        {canShare && <Button variant="white" className="share__action" type="button" onClick={nativeShare} icon="share">Compartilhar</Button>}
        {links.map(({ label, href, icon }) => (
          <Button key={label} as="a" variant="white" className="share__action" href={href} target="_blank" rel="noopener" aria-label={`Compartilhar no ${label}`} icon={icon}>{label}</Button>
        ))}
      </div>
      <p className="sr-only" role="status" aria-live="polite">{status}</p>
    </section>
  );
}
