interface Props {
    title: string;
    description: string;
}

export const Header = ({ title, description }: Props) => {
  return (
    <div
        className="content-center"
    >
        <h1>
            { title }
        </h1>
        <p>{ description }</p>
    </div>
  );
};
