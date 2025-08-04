import React, { useState, useEffect } from "react";
import PDF from "@/Components/PDF";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileArrowDown } from "@fortawesome/free-solid-svg-icons";
import BarChartPdf from "./BarChartPdf"; // Asegúrate de importar tus componentes de chart
import LineChartPdf from "./LineChartPdf";
import BarChartPdfGeneral from "./BarChartPdfGeneral";

const DateReportForm = ({ onSubmit, currentHomehub, username }) => {
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
        setConsumoChartImage(null);
        setChartsReady(false);

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
            console.log("Datos del reporte:", data);
            console.log("Estructura de sensors:", data.data.sensors);
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

    const [consumoChartImage, setConsumoChartImage] = useState(null);
    const [chartsReady, setChartsReady] = useState(false);

    const handleSetConsumoChartImage = (image) => {
        setConsumoChartImage(image);
    };

    // Función para verificar si todas las gráficas están listas
    const checkIfChartsReady = (reportData, chartImages, qualityChartImages, consumoChart) => {
        if (!reportData || !consumoChart) return false;
        
        const expectedStorageCharts = reportData.data.sensors.filter(s => s.storage).length;
        const expectedQualityCharts = reportData.data.sensors.filter(s => s.quality).length;
        
        return chartImages.length >= expectedStorageCharts && 
               qualityChartImages.length >= expectedQualityCharts;
    };

    // Effect para verificar cuando todas las gráficas están listas
    useEffect(() => {
        if (reportData) {
            const ready = checkIfChartsReady(reportData, chartImages, qualityChartImages, consumoChartImage);
            setChartsReady(ready);
        }
    }, [reportData, chartImages, qualityChartImages, consumoChartImage]);

    const today = new Date().toISOString().split("T")[0];

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
                        <BarChartPdfGeneral
                            sensors={reportData.data.sensors}
                            fechaInicio={fechaInicio}
                            fechaFin={fechaFin}
                            chartId="general-consumo"
                            onExport={handleSetConsumoChartImage} // Aquí le pasas la función para guardar la imagen
                        />

                        {/* Generar un BarChartPdf por cada sensor de consumo */}
                        {reportData.data.sensors.map((sensorGroup, i) => {
                            console.log(`Sensor ${i}:`, sensorGroup);
                            if (sensorGroup.storage) {
                                console.log(`Datos de storage para sensor ${i}:`, sensorGroup.storage);
                            }
                            return sensorGroup.storage ? (
                                <BarChartPdf
                                    key={`tanque-${i}`}
                                    monthlyConsumption={
                                        sensorGroup.storage.range_consumption
                                    }
                                    onExport={handleAddChartImage}
                                    chartId={`bar-chart-${i}`}
                                    fechaInicio={fechaInicio}
                                    fechaFin={fechaFin}
                                />
                            ) : null;
                        })}

                        {reportData.data.sensors.map((sensorGroup, i) => 
                            sensorGroup.quality ? (
                                <LineChartPdf
                                    key={`calidad-${i}`}
                                    data={sensorGroup.quality.logs}
                                    onExport={handleAddQualityChartImage}
                                    chartId={`line-chart-${i}`} // id único
                                    fechaInicio={fechaInicio}
                                    fechaFin={fechaFin}
                                />
                            ) : null
                        )}
                    </div>
                )}

                {/* Botón para descargar PDF solo si ya se generaron las imágenes */}
                {reportData && chartsReady ? (
                    <PDFDownloadLink
                            document={
                                <PDF
                                    data={reportData}
                                    graficaUrls={chartImages}
                                    qualityChartUrls={qualityChartImages}
                                    fechaInicio={fechaInicio}
                                    fechaFin={fechaFin}
                                    totalConsumoChart={consumoChartImage}
                                    usuario={username}
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
                ) : reportData && !chartsReady ? (
                    <div className="bg-gray-200 text-gray-600 flex items-center justify-center gap-2 shadow-sm h-[50px] px-4 rounded-full w-full mt-4 font-bold">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                        Generando gráficas...
                    </div>
                ) : null}
            </div>
        </form>
    );
};

export default DateReportForm;
