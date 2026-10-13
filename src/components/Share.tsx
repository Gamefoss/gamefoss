import { useEffect, useRef, useState } from 'react';
import Icon, { type IconName } from './Icon';

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
        setStatus('Não foi possível compartilhar o artigo');
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
      <div className="share__heading">
        <span aria-hidden="true">+</span>
        <h2 id="share-title">Compartilhe</h2>
      </div>
      <div className="share__actions">
        {canCopy && <button className="share__action" type="button" onClick={copyLink}><Icon name="link" /><span>{copyLabel}</span></button>}
        {canShare && <button className="share__action" type="button" onClick={nativeShare}><Icon name="share" /><span>Compartilhar</span></button>}
        {links.map(({ label, href, icon }) => (
          <a key={label} className="share__action" href={href} target="_blank" rel="noopener" aria-label={`Compartilhar no ${label}`}>
            <Icon name={icon} /><span>{label}</span>
          </a>
        ))}
      </div>
      <p className="sr-only" role="status" aria-live="polite">{status}</p>
    </section>
  );
}
