import React, { useState } from "react";
import PDF from "@/Components/PDF";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileArrowDown } from "@fortawesome/free-solid-svg-icons";

const DateReportForm = ({
    onSubmit,
    currentHomehub,
    chartImage,
    qualityChartImage,
}) => {
    const [fechaInicio, setFechaInicio] = useState("");
    const [fechaFin, setFechaFin] = useState("");
    const [reportData, setReportData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Función para obtener el cookie CSRF de Sanctum
    const getCsrfCookie = async () => {
        await fetch("http://127.0.0.1:8000/sanctum/csrf-cookie", {
            credentials: "include",
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);
        setError(null);

        if (!currentHomehub) {
            setError("No hay un homehub seleccionado.");
            setLoading(false);
            return;
        }

        try {
            // Obtener cookie CSRF antes de la petición
            await getCsrfCookie();

            const params = new URLSearchParams({
                mac_add: currentHomehub,
                start_date: fechaInicio,
                end_date: fechaFin,
            });

            const response = await fetch(`/report?${params.toString()}`, {
                method: "GET",
                credentials: "include", // importante para enviar cookies de sesión y CSRF
                headers: {
                    Accept: "application/json",
                },
            });

            if (!response.ok) {
                let errorMessage = "Error al obtener el reporte";
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorMessage;
                } catch {
                    // No es JSON, mantener mensaje genérico
                }
                throw new Error(errorMessage);
            }

            const data = await response.json();
            setReportData(data);

            if (onSubmit) onSubmit(data);
        } catch (err) {
            setError(err.message || "Error desconocido");
            setReportData(null);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="bg-gray-100 p-8 rounded-lg w-[400px] mx-auto shadow">
                <h2 className="text-2xl font-bold mb-6 text-center">
                    Ingresa la fecha que deseas consultar
                </h2>

                <label className="block mb-2 font-medium">
                    Fecha de inicio:
                </label>
                <input
                    type="date"
                    value={fechaInicio}
                    onChange={(e) => setFechaInicio(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md mb-4"
                    required
                />

                <label className="block mb-2 font-medium">Fecha de fin:</label>
                <input
                    type="date"
                    value={fechaFin}
                    onChange={(e) => setFechaFin(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md mb-6"
                    required
                />

                {error && (
                    <p className="text-red-600 mb-4 text-center font-semibold">
                        {error}
                    </p>
                )}

                {fechaInicio && fechaFin && currentHomehub && (
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-black hover:bg-gray-800 text-white flex items-center justify-center gap-2 shadow-sm h-[50px] px-4 rounded-full w-full mt-4 font-bold"
                    >
                        {loading ? "Generando reporte..." : "Generar Reporte"}
                    </button>
                )}

                {reportData && (
                    <PDFDownloadLink
                        document={
                            <PDF
                                data={reportData}
                                graficaUrl={chartImage}
                                qualityChartUrl={qualityChartImage}
                                fechaInicio={fechaInicio}
                                fechaFin={fechaFin}
                            />
                        }
                        fileName="Axol_Report.pdf"
                    >
                        {({ loading: pdfLoading }) =>
                            pdfLoading ? (
                                <span className="bg-white hover:bg-gray-50 text-gray-800 flex items-center gap-2 shadow-sm h-[50px] px-4 rounded-lg w-full mt-4">
                                    <FontAwesomeIcon
                                        icon={faFileArrowDown}
                                        className="h-4 w-4"
                                    />
                                    Cargando Reporte...
                                </span>
                            ) : (
                                <span className="bg-black hover:bg-gray-800 text-white flex items-center justify-center gap-2 shadow-sm h-[50px] px-4 rounded-full w-full mt-4 font-bold">
                                    <FontAwesomeIcon
                                        icon={faFileArrowDown}
                                        className="h-4 w-4"
                                    />
                                    Descargar Reporte
                                </span>
                            )
                        }
                    </PDFDownloadLink>
                )}
            </div>
        </form>
    );
};

export default DateReportForm;
