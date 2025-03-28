export default function DateFormat({ datetime }) {
    if (!datetime) {
        return <span className="dark:text-white">Fecha no disponible</span>;
    }

    const newDatetime = new Date(datetime);

    const dateFormated = newDatetime.toLocaleString("es-MX", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });

    return <span className="dark:text-white">{dateFormated}</span>;
}
