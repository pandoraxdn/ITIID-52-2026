interface Props{
    texto: string;
}

export const Texto = ( {texto} :Props ) => {
    return <>
        <p>{texto}</p>
    </>;
}

