import React from 'react'
import Chart from "react-apexcharts";

function ColumnChart() {
    const value = 44;

    const [state, setState] = React.useState({

        series: [{
            name: "Calidad",
            data: [value]
        }],
        options: {
            chart: {
                type: 'bar',
                height: 350,
                width: '100%',
                toolbar: {
                    show: false
                }
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
            }
        },


    });

    return (
        <div style={{ width: '100%' }}> {/* Contenedor con ancho del 100% */}
            <Chart options={state.options} series={state.series} type="bar" height={350}/>
        </div>
    )
}

export default ColumnChart
