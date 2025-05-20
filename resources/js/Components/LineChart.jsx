import React from "react";
import Chart from "react-apexcharts";

// Array con los nombres abreviados de los meses en español
const allMonths = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

// Define el componente LineChart que recibe 'data' como prop
export default function LineChart({ data }) {
    // Opciones de configuración para la gráfica de ApexCharts
    const options = {
        chart: {
            height: 350, // Altura de la gráfica
            type: "line", // Tipo de gráfica: línea
            toolbar: { show: false }, // Oculta la barra de herramientas (zoom, descargar, etc.)
        },
        colors: ["#4fd1c5"], // Define el color de la línea (azul claro similar a la imagen)
        dataLabels: { enabled: false }, // Deshabilita las etiquetas de datos en los puntos
        legend: { show: false }, // Oculta la leyenda
        xaxis: {
            categories: allMonths, // Usa los nombres de los meses en el eje X
            title: {
                text: "Meses del año", // Título del eje X
                style: { fontWeight: 500 } // Estilo del título
            },
        },
        yaxis: {
            min: 0, // Valor mínimo del eje Y
            max: 500, // Valor máximo del eje Y
            tickAmount: 5, // Número de divisiones en el eje Y (crea saltos de 100: 0, 100, 200, etc.)
            labels: {
                formatter: (val) => val, // Formatea las etiquetas del eje Y para mostrar el valor tal cual
            },
            title: {
                text: "Dureza del agua (PPM)", // Título del eje Y
                style: { fontWeight: 500 } // Estilo del título
            },
        },
        stroke: {
            curve: "straight", // Tipo de curva de la línea (recta entre puntos)
            width: 3, // Ancho de la línea
        },
        markers: {
            size: 5, // Tamaño de los marcadores en los puntos
            colors: ["#4fd1c5"], // Color de los marcadores
            strokeColors: "#fff", // Color del borde de los marcadores
            strokeWidth: 2, // Ancho del borde de los marcadores
        },
        grid: {
            row: {
                colors: ["#f3f3f3", "transparent"], // Colores alternos para las filas de la cuadrícula
                opacity: 0.5, // Opacidad de las filas de la cuadrícula
            },
        },
        title: {
            text: "Calidad del Agua", // Título principal de la gráfica
            align: "center", // Alineación del título
            style: { fontWeight: 600, fontSize: '18px' } // Estilo del título
        },
    };

    return (
        // Contenedor principal de la gráfica
        <div>
            <Chart
                options={options} // Pasa las opciones de configuración
                series={[{ name: "Calidad del Agua", data: data }]} // Define la serie de datos (nombre y los valores recibidos por prop)
                type="line" // Especifica el tipo de gráfica nuevamente (aunque ya está en options)
                height={350} // Especifica la altura nuevamente (aunque ya está en options)
            />
        </div>
    );
}
