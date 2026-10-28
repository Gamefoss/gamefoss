type Props = {
    id: string;
    alt: string;
};

export default function Giphy({ id, alt }: Props) {
  return (
    <img
        src={`https://media.giphy.com/media/${id}/giphy.gif`}
        alt={alt}
        loading="lazy"
    />
  );
}