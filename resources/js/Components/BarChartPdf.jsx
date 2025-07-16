import React, { useEffect, useRef } from "react";
import Chart from "react-apexcharts";
import html2canvas from "html2canvas";

// Recibe fechas en formato 'YYYY-MM-DD' o Date
function getMonthsRange(startDateStr, endDateStr) {
    const allMonths = [
        "Ene",
        "Feb",
        "Mar",
        "Abr",
        "May",
        "Jun",
        "Jul",
        "Ago",
        "Sep",
        "Oct",
        "Nov",
        "Dic",
    ];

    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);

    // Normalizar al primer día del mes
    let current = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
    const end = new Date(endDate.getFullYear(), endDate.getMonth(), 1);

    const months = [];
    const consumptionKeys = [];

    while (current <= end) {
        const monthIndex = current.getMonth();
        months.push(allMonths[monthIndex]);
        consumptionKeys.push(String(monthIndex + 1).padStart(2, "0"));

        // Incrementar un mes
        current.setMonth(current.getMonth() + 1);
    }

    return { months, consumptionKeys };
}

const colors = ["#b37f95", "#fcedf4", "#f4ddf3", "#fbecf3", "#b6bcd5"];

export default function BarChartPdf({
    monthlyConsumption,
    onExport,
    chartId,
    fechaInicio,
    fechaFin,
}) {
    const chartRef = useRef(null);

    const { months: displayedMonths, consumptionKeys } = getMonthsRange(
        fechaInicio,
        fechaFin
    );

    // Construye el array de consumos para cada mes en el rango
    const consumptionData = consumptionKeys.map(
        (monthKey) => monthlyConsumption?.[monthKey] ?? 0
    );

    const options = {
        chart: {
            id: chartId,
            type: "bar",
            toolbar: { show: false },
        },
        colors: colors.slice(0, displayedMonths.length),
        plotOptions: { bar: { columnWidth: "65%", distributed: true } },
        dataLabels: { enabled: false },
        legend: { show: false },
        xaxis: {
            title: { text: "Meses" },
            categories: displayedMonths,
            labels: { style: { fontSize: "12px" } },
        },
        yaxis: {
            title: { text: "Litros" },
            min: 0,
        },
    };

    useEffect(() => {
        if (onExport && chartRef.current) {
            setTimeout(() => {
                html2canvas(chartRef.current).then((canvas) => {
                    const imgData = canvas.toDataURL("image/png");
                    onExport(imgData);
                });
            }, 1000);
        }
    }, [onExport, consumptionData]);

    return (
        <div ref={chartRef}>
            <Chart
                options={options}
                series={[{ data: consumptionData }]}
                type="bar"
                height={250}
            />
        </div>
    );
}
