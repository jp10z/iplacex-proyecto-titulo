type Props = {
    icono: string;
    tamano?: number;
}

export function Icono({ icono, tamano = 32 }: Props) {
    return (
        <img src={`/iconos/${icono}.svg`} alt="Descripción del icono" width={tamano} height={tamano}></img>
    )
}