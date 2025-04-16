import { useMemo } from "react";

export default function useRangoMesActual() {
    const meses = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];

    return useMemo(() => {
        const fechaActual = new Date();
        const mesActual = meses[fechaActual.getMonth()];
        const añoActual = fechaActual.getFullYear();
        const primerDia = "01";
        const ultimoDia = new Date(añoActual, fechaActual.getMonth() + 1, 0).getDate();
        const rangoFechas = `${primerDia} - ${ultimoDia} ${mesActual}`;
        return rangoFechas;
    }, []);
}
