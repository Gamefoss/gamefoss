type Props = {
  id: string;
  alt: string;
  caption?: string;
};

export function Giphy({ id, alt, caption = alt }: Props) {
  return (
    <figure className="content-figure">
      <img
        src={`https://media.giphy.com/media/${id}/giphy.gif`}
        alt={alt}
        loading="lazy"
      />
      {caption.trim() && <figcaption>{caption}</figcaption>}
    </figure>
  );
}
