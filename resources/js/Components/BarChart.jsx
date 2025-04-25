import React from "react";
import Chart from "react-apexcharts";

const colors = ["#008FFB", "#00E396", "#FEB019", "#FF4560", "#775DD0", "#546E7A", "#26A69A", "#D10CE8"];
const allMonths = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

export default function BarChart({ monthlyConsumption }) {
    const currentMonthIndex = new Date().getMonth();
    const displayedMonths = allMonths.slice(0, currentMonthIndex + 1);

    // Llenar los meses sin datos con 0
    const consumptionData = allMonths.map((_, index) => {
        const monthKey = (index + 1).toString().padStart(2, "0"); 
        return monthlyConsumption?.[monthKey] ?? 0;
    });

    const options = {
        chart: {
            height: 350,
            type: "bar",
        },
        colors: colors.slice(0, displayedMonths.length),
        plotOptions: {
            bar: {
                columnWidth: "65%",
                distributed: true,
            },
        },
        dataLabels: {
            enabled: false,
        },
        legend: {
            show: false,
        },
        xaxis: {
            categories: displayedMonths,
            labels: {
                style: {
                    colors: colors.slice(0, displayedMonths.length),
                    fontSize: "12px",
                },
            },
        },
    };

    return (
        <div>
            <Chart options={options} series={[{ data: consumptionData.slice(0, displayedMonths.length) }]} type="bar" height={350} />
        </div>
    );
}
