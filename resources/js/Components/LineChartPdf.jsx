import React, { useEffect, useRef } from "react";
import Chart from "react-apexcharts";
import html2canvas from "html2canvas";

// Array con los nombres abreviados de los meses en español
const allMonths = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

export default function LineChartPdf({ data, onExport }) {
    const chartRef = useRef(null);

    // Opciones de configuración para la gráfica de ApexCharts
    const options = {
        chart: {
            height: 350, // Altura de la gráfica
            type: "line", // Tipo de gráfica: línea
            toolbar: { show: false }, // Oculta la barra de herramientas
        },
        colors: ["#4fd1c5"], // Color de la línea
        dataLabels: { enabled: false }, // Deshabilita las etiquetas de datos
        legend: { show: false }, // Oculta la leyenda
        xaxis: {
            categories: allMonths, // Usa los nombres de los meses en el eje X
            title: {
                text: "Meses del año",
                style: { fontWeight: 500 }
            },
        },
        yaxis: {
            min: 0,
            max: 500,
            tickAmount: 5, // Divisiones de 100 en 100
            labels: {
                formatter: (val) => val,
            },
            title: {
                text: "Dureza del agua (PPM)",
                style: { fontWeight: 500 }
            },
        },
        stroke: {
            curve: "straight",
            width: 3,
        },
        markers: {
            size: 5,
            colors: ["#4fd1c5"],
            strokeColors: "#fff",
            strokeWidth: 2,
        },
        grid: {
            row: {
                colors: ["#f3f3f3", "transparent"],
                opacity: 0.5,
            },
        },
    };

    useEffect(() => {
        if (onExport && chartRef.current) {
            // Espera un poco a que la gráfica se renderice
            setTimeout(() => {
                html2canvas(chartRef.current).then((canvas) => {
                    const imgData = canvas.toDataURL("image/png");
                    onExport(imgData);
                });
            }, 1000);
        }
    }, [onExport]);

    return (
        <div ref={chartRef}>
            <Chart
                options={options}
                series={[{ name: "Calidad del Agua", data: data }]}
                type="line"
                height={350}
            />
        </div>
    );
}
