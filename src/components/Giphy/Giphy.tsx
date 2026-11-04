type Props = {
  id: string;
  alt: string;
};

export function Giphy({ id, alt }: Props) {
  return (
    <figure className="content-figure">
      <img
        src={`https://media.giphy.com/media/${id}/giphy.gif`}
        alt={alt}
        loading="lazy"
      />
      {alt.trim() && <figcaption>{alt}</figcaption>}
    </figure>
  );
}
