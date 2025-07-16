import React, { useEffect, useRef } from "react";
import Chart from "react-apexcharts";
import html2canvas from "html2canvas";

const LineChartPdf = ({ data = [], onExport, chartId }) => {
    const chartRef = useRef(null);

    const series = [
        {
            name: "TDS (ppm)",
            data: data.map(({ datetime, tds }) => ({
                x: new Date(datetime).getTime(),
                y: tds,
            })),
        },
    ];

    const options = {
        chart: {
            id: chartId,
            type: "line",
            zoom: { enabled: false },
            toolbar: { show: false },
            animations: { enabled: false },
        },
        xaxis: {
            type: "datetime",
            labels: { datetimeUTC: false },
            title: { text: "Fecha" },
        },
        yaxis: {
            title: { text: "TDS (ppm)" },
            min: 0,
        },
        tooltip: {
            x: {
                format: "dd MMM yyyy HH:mm",
            },
        },
        markers: {
            size: 4,
        },
    };

    // Exportar imagen cuando el chart esté listo
    useEffect(() => {
        if (onExport && chartRef.current) {
            // Dar tiempo para que el chart se renderice completamente
            setTimeout(() => {
                html2canvas(chartRef.current, {
                    scale: 2, // Mayor calidad
                    logging: false,
                    useCORS: true,
                })
                    .then((canvas) => {
                        const imgData = canvas.toDataURL("image/png");
                        onExport(imgData);
                    })
                    .catch((err) => {
                        console.error("Error al exportar chart:", err);
                    });
            }, 800);
        }
    }, [data, onExport]);

    return (
        <div ref={chartRef}>
            <Chart options={options} series={series} type="line" height={250} />
        </div>
    );
};

export default LineChartPdf;
