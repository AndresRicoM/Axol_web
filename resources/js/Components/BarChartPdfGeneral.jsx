import React, { useEffect, useRef } from "react";
import Chart from "react-apexcharts";
import html2canvas from "html2canvas";

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

// Calcula diferencia decimal en meses entre dos fechas
function getMonthsDiff(startDate, endDate) {
    return (
        (endDate.getFullYear() - startDate.getFullYear()) * 12 +
        (endDate.getMonth() - startDate.getMonth()) +
        (endDate.getDate() - startDate.getDate()) / 31 // aproximación por días
    );
}

// Obtiene la semana ISO en formato "YYYY-Www" desde una fecha
function getWeekIsoString(date) {
    const temp = new Date(date.getTime());
    temp.setHours(0, 0, 0, 0);
    temp.setDate(temp.getDate() + 3 - ((temp.getDay() + 6) % 7));
    const week1 = new Date(temp.getFullYear(), 0, 4);
    const weekNumber =
        1 +
        Math.round(
            ((temp.getTime() - week1.getTime()) / 86400000 -
                3 +
                ((week1.getDay() + 6) % 7)) /
                7
        );
    return `${temp.getFullYear()}-W${String(weekNumber).padStart(2, "0")}`;
}

// Genera etiquetas y claves por semanas, usando formato ISO semana
function getWeeksRange(startDate, endDate) {
    const weeks = [];
    const keys = [];
    let current = new Date(startDate);
    current.setHours(0, 0, 0, 0);

    // Ajusta current al lunes de esa semana
    const day = current.getDay();
    current.setDate(current.getDate() + (((day === 0 ? 1 : 8) - day) % 7));

    let weekNumber = 1;
    while (current <= endDate) {
        weeks.push(`Sem ${weekNumber}`);
        keys.push(getWeekIsoString(current));
        current.setDate(current.getDate() + 7);
        weekNumber++;
    }
    return { months: weeks, consumptionKeys: keys };
}

// Genera etiquetas y claves por meses
function getMonthsRange(startDateStr, endDateStr) {
    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);
    let current = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
    const end = new Date(endDate.getFullYear(), endDate.getMonth(), 1);

    const months = [];
    const consumptionKeys = [];
    while (current <= end) {
        const monthIndex = current.getMonth();
        months.push(allMonths[monthIndex]);
        consumptionKeys.push(
            String(current.getFullYear()) +
                String(monthIndex + 1).padStart(2, "0")
        );
        current.setMonth(current.getMonth() + 1);
    }
    return { months, consumptionKeys };
}

// Genera etiquetas y claves por años
function getYearsRange(startDate, endDate) {
    const years = [];
    const keys = [];
    let currentYear = startDate.getFullYear();
    const endYear = endDate.getFullYear();
    while (currentYear <= endYear) {
        years.push(String(currentYear));
        keys.push(String(currentYear));
        currentYear++;
    }
    return { months: years, consumptionKeys: keys };
}

// Decide el rango (semanal, mensual, anual) según la diferencia de meses
function getRangeByDateRange(startDateStr, endDateStr) {
    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);
    const diffMonths = getMonthsDiff(startDate, endDate);

    if (diffMonths <= 3) {
        return getWeeksRange(startDate, endDate);
    } else if (diffMonths <= 12) {
        return getMonthsRange(startDateStr, endDateStr);
    } else {
        return getYearsRange(startDate, endDate);
    }
}

/**
 * Suma el consumo de todos los sensores en un objeto acumulador por clave periodo
 * @param {Array} sensors - arreglo de sensores con la estructura { storage: { range_consumption: {...} } }
 * @returns {Object} objeto con claves periodo y valores sumados
 */
function sumRangeConsumptionBySensors(sensors) {
    const totalConsumption = {};

    sensors.forEach((sensor) => {
        const rangeConsumption = sensor.storage?.range_consumption;
        if (rangeConsumption) {
            Object.entries(rangeConsumption).forEach(([period, value]) => {
                if (!totalConsumption[period]) {
                    totalConsumption[period] = 0;
                }
                totalConsumption[period] += value;
            });
        }
    });

    return totalConsumption;
}

const colors = ["#b37f95", "#fcedf4", "#f4ddf3", "#fbecf3", "#b6bcd5"];

/**
 * Componente para mostrar gráfica de barras con consumo general sumando todos los sensores
 */
export default function BarChartPdfGeneral({
    sensors = [],
    onExport,
    chartId,
    fechaInicio,
    fechaFin,
}) {
    const chartRef = useRef(null);

    // Sumar consumo general
    const rangeConsumption = sumRangeConsumptionBySensors(sensors);

    // Obtener etiquetas y claves según rango fechas (semanal, mensual, anual)
    const { months: displayedCategories, consumptionKeys } =
        getRangeByDateRange(fechaInicio, fechaFin);

    // Mapeo de datos: asigna consumo sumado por clave o 0 si no existe
    const consumptionData = consumptionKeys.map(
        (key) => rangeConsumption[key] ?? 0
    );

    const options = {
        chart: {
            id: chartId,
            type: "bar",
            toolbar: { show: false },
        },
        colors: colors.slice(0, displayedCategories.length),
        plotOptions: { bar: { columnWidth: "65%", distributed: true } },
        dataLabels: { enabled: false },
        legend: { show: false },
        xaxis: {
            title: { text: "Periodo" },
            categories: displayedCategories,
            labels: { style: { fontSize: "12px" } },
        },
        yaxis: {
            title: { text: "Consumo total (Litros)" },
            min: 0,
        },
    };

    useEffect(() => {
        if (onExport && chartRef.current) {
            setTimeout(() => {
                html2canvas(chartRef.current, {
                    scale: 5,
                    logging: false,
                    useCORS: true,
                }).then((canvas) => {
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
