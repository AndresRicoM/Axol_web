import React, { useEffect, useRef, useMemo } from "react";
import Chart from "react-apexcharts";
import html2canvas from "html2canvas";

function getMonthsDiff(startDate, endDate) {
    return (
        (endDate.getFullYear() - startDate.getFullYear()) * 12 +
        (endDate.getMonth() - startDate.getMonth()) +
        (endDate.getDate() - startDate.getDate()) / 31
    );
}

const LineChartPdf = ({
    data = [],
    onExport,
    chartId,
    fechaInicio,
    fechaFin,
}) => {
    const chartRef = useRef(null);

    const startDate = new Date(fechaInicio);
    const endDate = new Date(fechaFin);
    const diffMonths = getMonthsDiff(startDate, endDate);

    // Decide formato de etiquetas segun rango
    const xaxisLabelFormat = useMemo(() => {
        if (diffMonths <= 3) {
            return "dd MMM yyyy"; // formato día-mes-año
        } else if (diffMonths <= 12) {
            return "MMM yyyy"; // solo mes y año
        } else {
            return "yyyy"; // solo año
        }
    }, [diffMonths]);

    // Mapea datos tal cual llegan, suponiendo data con {datetime, tds}
    const series = [
        {
            name: "TDS (ppm)",
            data: data.map(({ datetime, tds }) => ({
                x: new Date(datetime).getTime(),
                y: Math.round(tds),
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
            labels: {
                datetimeUTC: false,
                format: xaxisLabelFormat, // se adapta según el rango
            },
            title: { text: "Fecha" },
        },
        yaxis: {
            title: { text: "TDS (ppm)" },
            min: 0,
        },
        stroke: {
            curve: "straight",
            width: 2,
        },
        tooltip: {
            x: {
                format: "dd MMM yyyy HH:mm", // tooltip con hora y fecha siempre
            },
        },
    };

    useEffect(() => {
        if (onExport && chartRef.current) {
            setTimeout(() => {
                html2canvas(chartRef.current, {
                    scale: 5,
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
    }, [onExport, data]);

    return (
        <div ref={chartRef}>
            <Chart options={options} series={series} type="line" height={250} />
        </div>
    );
};

export default LineChartPdf;
