import React from 'react'
import Chart from "react-apexcharts";

// Función para determinar el offset basado en el ancho de la ventana
// Esta función ya no se usa ya que centramos la gráfica en todos los dispositivos
const getOffsetX = () => {
    const width = window.innerWidth;
    if (width >= 1920) return 200;      // Full HD y superior - Movido a la derecha
    if (width >= 1440) return 180;      // Laptops grandes - Movido a la derecha
    if (width >= 1024) return 150;      // Desktop pequeños - Movido a la derecha
    if (width >= 768) return 0;         // Tablets - Centrado
    if (width >= 640) return 0;         // Tablets pequeñas - Centrado
    if (width >= 480) return 0;         // Móviles grandes - Centrado
    return 0;                           // Móviles pequeños - Centrado
};

export default function ColumnChart() {
    // Valor inicial de la calidad del agua en PPM
    const value = 44;

    // Estado que contiene la configuración y datos de la gráfica
    const [state, setState] = React.useState({
        // Datos de la serie que se mostrará en la gráfica
        series: [{
            name: "Calidad",
            data: [value]
        }],
        // Configuración completa de la gráfica
        options: {
            // Configuración general del chart
            chart: {
                type: 'bar',
                height: '100%',
                width: '100%',
                toolbar: {
                    show: false        // Oculta la barra de herramientas
                },
                offsetX: 0             // Centra la gráfica horizontalmente
            },
            // Configuración de las barras
            plotOptions: {
                bar: {
                    horizontal: false,       // Barras verticales
                    columnWidth: '30%',      // Ancho de las barras
                    borderRadius: 5,         // Bordes redondeados
                    borderRadiusApplication: 'end',  // Aplica el radio solo al final
                    distributed: true        // Distribuye las barras uniformemente
                },
            },
            // Configuración de las etiquetas de datos
            dataLabels: {
                enabled: false              // Oculta las etiquetas en las barras
            },
            // Configuración del borde de las barras
            stroke: {
                show: true,
                width: 2,
                colors: ['transparent']     // Borde transparente
            },
            // Configuración del eje X
            xaxis: {
                categories: ['Tank'],       // Etiqueta del eje X
                position: 'center',         // Centra las etiquetas
                axisTicks: {
                    show: false            // Oculta las marcas del eje
                },
                axisBorder: {
                    show: false           // Oculta el borde del eje
                }
            },
            // Configuración del relleno
            fill: {
                opacity: 1                // Opacidad completa
            },
            // Configuración del tooltip
            tooltip: {
                y: {
                    formatter: function (val) {
                        return `${val} PPM`;  // Muestra el valor en PPM
                    }
                }
            },
            // Configuración de la cuadrícula
            grid: {
                padding: {
                    left: 0,              // Sin padding izquierdo para centrado
                    right: 0              // Sin padding derecho para centrado
                }
            },
        },
    });

    // Renderiza el componente Chart con todas las configuraciones
    return (
        <div className="h-full w-full">
            <Chart 
                options={state.options} 
                series={state.series} 
                type="bar" 
                height="100%" 
                width="100%"
            />
        </div>
    )
}
