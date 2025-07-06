import React, { useState, useEffect } from "react";
import PDF from "@/Components/PDF";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileArrowDown } from "@fortawesome/free-solid-svg-icons";
import BarChartPdf from "./BarChartPdf"; // Asegúrate de importar tus componentes de chart
import LineChartPdf from "./LineChartPdf";

const DateReportForm = ({ onSubmit, currentHomehub }) => {
    const [fechaInicio, setFechaInicio] = useState("");
    const [fechaFin, setFechaFin] = useState("");
    const [reportData, setReportData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Estados para las imágenes base64 de los charts
    const [chartImages, setChartImages] = useState([]); // Consumo
    const [qualityChartImages, setQualityChartImages] = useState([]); // Calidad

    // Función para obtener cookie CSRF
    const getCsrfCookie = async () => {
        await fetch("http://127.0.0.1:8000/sanctum/csrf-cookie", {
            credentials: "include",
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);
        setError(null);
        setReportData(null);
        setChartImages([]);
        setQualityChartImages([]);

        if (!currentHomehub) {
            setError("No hay un homehub seleccionado.");
            setLoading(false);
            return;
        }

        try {
            await getCsrfCookie();

            const params = new URLSearchParams({
                mac_add: currentHomehub,
                start_date: fechaInicio,
                end_date: fechaFin,
            });

            const response = await fetch(`/report?${params.toString()}`, {
                method: "GET",
                credentials: "include",
                headers: {
                    Accept: "application/json",
                },
            });

            if (!response.ok) {
                let errorMessage = "Error al obtener el reporte";
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorMessage;
                } catch {}
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

    // Funciones para agregar imágenes a los arrays
    const handleAddChartImage = (image) => {
        setChartImages((prev) => {
            if (!prev.includes(image)) return [...prev, image];
            return prev;
        });
    };

    const handleAddQualityChartImage = (image) => {
        setQualityChartImages((prev) => {
            if (!prev.includes(image)) return [...prev, image];
            return prev;
        });
    };

    const today = new Date().toISOString().split("T")[0];
    console.log("---------------------------");
    console.log(today);

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
                    max={today}
                />

                <label className="block mb-2 font-medium">Fecha de fin:</label>
                <input
                    type="date"
                    value={fechaFin}
                    onChange={(e) => setFechaFin(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md mb-6"
                    required
                    max={today}
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

                {/* Contenedor oculto para generar los charts y capturar imágenes */}
                {reportData && (
                    <div
                        style={{
                            position: "absolute",
                            left: "-9999px",
                            top: 0,
                        }}
                    >
                        {/* Generar un BarChartPdf por cada sensor de consumo */}
                        {reportData.data.sensors.map((sensor, i) => (
                            <BarChartPdf
                                key={`tanque-${i}`}
                                monthlyConsumption={
                                    sensor.storage.monthly_consumption
                                }
                                onExport={handleAddChartImage}
                                chartId={`bar-chart-${i}`}
                                fechaInicio={fechaInicio}
                                fechaFin={fechaFin}
                            />
                        ))}

                        {reportData.data.quality_sensors.map((sensor, i) => (
                            <LineChartPdf
                                key={`calidad-${i}`}
                                data={sensor.logs}
                                onExport={handleAddQualityChartImage}
                                chartId={`line-chart-${i}`} // id único
                            />
                        ))}
                    </div>
                )}

                {/* Botón para descargar PDF solo si ya se generaron las imágenes */}
                {reportData &&
                    chartImages.length > 0 &&
                    qualityChartImages.length > 0 && (
                        <PDFDownloadLink
                            document={
                                <PDF
                                    data={reportData}
                                    graficaUrls={chartImages}
                                    qualityChartUrls={qualityChartImages}
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
