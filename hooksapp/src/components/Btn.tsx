
interface Props {
    title: string;
    color: string;
    onPress: () => void;
}

export const Btn = ({ title, onPress, color }: Props) => {
  return (
    <button
        style={{
            backgroundColor: color,
            marginTop: 10
        }}
        onClick={ () => onPress }
        className={ `
            flex
            text-white 
            px-4 
            py-2 
            rounded-xl
            transition 
            duration-700
            justify-center
            items-center
        ` }
    >
        { title }
    </button>
  );
};
