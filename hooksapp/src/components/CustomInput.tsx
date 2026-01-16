interface Props {
    text:   string;
    color:  string;
    type:   string;
}

export const CustomInput = ({ text, color, type }: Props) => {
  return (
    <input
        type={ type }
        style={{
            marginTop: 10,
            borderColor: color
        }}
        className="
            border-5
            p-2
            rounded-md
            w-full
            focus:border-blue-500
            focus:ring-2
            focus:ring-pink-500
            focus:outline-none
        "
        placeholder={ text }
    />
  );
};
