import React, { useState } from "react";
import Chart from "react-apexcharts";

const rangeOptions = [
    { label: "YTD", value: "YTD" },
    { label: "3 meses", value: 3 },
    { label: "6 meses", value: 6 },
    { label: "1 año", value: 12 },
    { label: "2 años", value: 24 },
    { label: "3 años", value: 36 },
];

function generateMonthsArray(start, end) {
    const result = [];
    const current = new Date(start.getFullYear(), start.getMonth(), 1);
    const last = new Date(end.getFullYear(), end.getMonth(), 1);
    while (current <= last) {
        const year = current.getFullYear();
        const month = (current.getMonth() + 1).toString().padStart(2, "0");
        result.push(`${year}${month}`);
        current.setMonth(current.getMonth() + 1);
    }
    return result;
}

export default function BarChart({ monthlyConsumption }) {
    const [selectedRange, setSelectedRange] = useState("YTD");

    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();

    let startDate;
    let endDate = new Date(currentYear, currentMonth, 1);

    if (selectedRange === "YTD") {
        startDate = new Date(currentYear, 0, 1);
    } else {
        const monthsBack = selectedRange;
        startDate = new Date(currentYear, currentMonth - monthsBack + 1, 1);
    }

    const monthsInRange = generateMonthsArray(startDate, endDate);
    const displayedDates = monthsInRange.map(
        (key) => `${key.slice(0, 4)}-${key.slice(4, 6)}-01`
    );
    const displayedData = monthsInRange.map(
        (key) => monthlyConsumption?.[key] ?? 0
    );

    const series = [
        {
            name: "Litros",
            data: displayedDates.map((date, i) => [date, displayedData[i]]),
        },
    ];

    const options = {
        chart: { height: 350, type: "bar", toolbar: { show: false } },
        title: {
            text: "Consumo de agua",
            align: "center",
            style: { fontWeight: 600, fontSize: "18px" },
        },
        xaxis: {
            type: "datetime",
            title: { text: "Meses", style: { fontWeight: 500 } },
            labels: {
                style: { fontSize: "12px" },
            },
            tickAmount: 12, // Opcional: máximo 12 labels visibles
        },
        yaxis: {
            title: { text: "Litros", style: { fontWeight: 500 } },
        },
        grid: {
            row: { colors: ["#f3f3f3", "transparent"], opacity: 0.5 },
        },
        plotOptions: { bar: { columnWidth: "60%", distributed: true } },
        dataLabels: { enabled: false },
        legend: { show: false },
    };

    return (
        <div className="mx-auto">
            <div className="flex justify-center gap-2 mb-6">
                {rangeOptions.map((option) => (
                    <button
                        key={option.value}
                        onClick={() => setSelectedRange(option.value)}
                        className={`px-4 py-2 rounded-t ${
                            selectedRange === option.value
                                ? "bg-blue-600 text-white font-bold"
                                : "bg-gray-200 text-gray-700"
                        }`}
                    >
                        {option.label}
                    </button>
                ))}
            </div>
            <Chart options={options} series={series} type="bar" height={350} />
        </div>
    );
}
