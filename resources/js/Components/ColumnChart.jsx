import React from 'react'
import Chart from "react-apexcharts";

export default function ColumnChart() {
    // Valor inicial de la calidad del agua en PPM
    const value = 44;

    // Estado para controlar la posición horizontal de la gráfica
    // 255 es el valor inicial para desktop (mueve la gráfica hacia la derecha)
    const [chartOffset, setChartOffset] = React.useState(255);

    // Este efecto se ejecuta cuando el componente se monta y cuando la ventana cambia de tamaño
    React.useEffect(() => {
        // Función que determina el offset según el ancho de la pantalla
        const handleResize = () => {
            const width = window.innerWidth;
            // Diferentes offsets según el breakpoint:
            if (width >= 1024) {
                setChartOffset(255);     // Desktop - mueve bastante a la derecha
            } else if (width >= 768) {
                setChartOffset(50);      // Tablets - mueve un poco a la derecha
            } else if (width >= 480) {
                setChartOffset(15);      // Móviles grandes - mueve muy poco (reducido de 20 a 15)
            } else {
                setChartOffset(-4);      // Móviles pequeños - casi centrado (reducido de 20 a 10)
            }
        };

        // Ejecuta la función inmediatamente y añade el listener
        handleResize();
        window.addEventListener('resize', handleResize);
        // Limpia el listener cuando el componente se desmonta
        return () => window.removeEventListener('resize', handleResize);
    }, []);

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
                offsetX: chartOffset  // Aquí se aplica el offset para mover la gráfica
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

    // Este efecto actualiza las opciones de la gráfica cuando cambia el offset
    React.useEffect(() => {
        setState(prev => ({
            ...prev,
            options: {
                ...prev.options,
                chart: {
                    ...prev.options.chart,
                    offsetX: chartOffset  // Actualiza el offset en las opciones
                }
            }
        }));
    }, [chartOffset]);

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
