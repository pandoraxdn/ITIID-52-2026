import type { Gif } from "../mock-gif/gif.mock";

interface Props {
    data: Gif[];
}

export const GifList = ({ data }: Props) => {
  return (
    <div
        className="gifs-container"
        style={{
            marginTop: 10
        }}
    >
        {
            data.map( ({ id, title, width, height, url }) => (
                <div
                    key={id}
                    className="gif-card"
                >
                    <img
                        src={url}
                    />
                    <h3>{title}</h3>
                    <p>{width} x {height} (1.5mb)</p>
                </div>
            ))
        }
    </div>
  );
};
