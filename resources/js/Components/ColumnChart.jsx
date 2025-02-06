import React from 'react'
import Chart from "react-apexcharts";

export default function ColumnChart() {
    const value = 44;

    const [state, setState] = React.useState({

        series: [{
            name: "Calidad",
            data: [value]
        }],
        options: {
            chart: {
                type: 'bar',
                height: '100%',
                width: '100%',
                toolbar: {
                    show: false  // Oculta la barra de herramientas
                },
                offsetX: 255  // Move Chart - Mueve la gráfica horizontalmente (255px a la derecha)
            },
            plotOptions: {
                bar: {
                    horizontal: false,
                    columnWidth: '55%',
                    borderRadius: 5,
                    borderRadiusApplication: 'end'
                },
            },
            dataLabels: {
                enabled: false
            },
            stroke: {
                show: true,
                width: 2,
                colors: ['transparent']
            },
            xaxis: {
                categories: ['Tank'],
            },
            fill: {
                opacity: 1
            },
            tooltip: {
                y: {
                    formatter: function (val) {
                        return `${val} PPM`;
                    }
                }
            },
            grid: {
                padding: {
                    left: 50,   // Espacio a la izquierda
                    right: 10,  // Espacio a la derecha
                }
            },
        },


    });

    return (
        <div className="h-full w-full">
            <Chart options={state.options} series={state.series} type="bar" height="100%" width="100%"/>
        </div>
    )
}
