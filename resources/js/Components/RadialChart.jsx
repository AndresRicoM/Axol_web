import React from 'react'
import Chart from "react-apexcharts";

function RadialChart({waterPercentage}) {
    const getChartColor = (percentage) => {
        if (percentage <= 25) return "#FF4560"; // Rojo - Nivel crítico
        if (percentage <= 50) return "#FEB019"; // Amarillo - Nivel bajo
        if (percentage <= 75) return "#3CADD4"; // Azul - Nivel normal
        return "#00E396"; // Verde - Nivel óptimo
    };


    const options = {
        series: [waterPercentage],
        colors: [getChartColor(waterPercentage)], // Color dinámico
        plotOptions: {
            radialBar: {
                hollow: {
                    size: '70%',
                },
                track: {
                    background: '#f2f2f2',  // Color del fondo de la barra
                },
                dataLabels: {
                    value: {
                        fontSize: '24px',
                        formatter: function (val) {
                            return val + '%';
                        }
                    }
                }
            },
        },
        stroke: {
            lineCap: 'round'
        },
        labels: ['Almacenamiento'],
        tooltip: {
            enabled: true,
            formatter: function (val) {
                return val + ' Litros';
            }
        }
    };

    return (
        <Chart
            options={options}
            series={options.series}
            type="radialBar"
            width="300"
        />
    )
}

export default RadialChart;
