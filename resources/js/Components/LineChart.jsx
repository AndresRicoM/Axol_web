import React, { useState, useMemo } from "react";
import Chart from "react-apexcharts";

const rangeOptions = [
    { label: "YTD", value: "YTD" },
    { label: "3 meses", value: 3 },
    { label: "6 meses", value: 6 },
    { label: "1 año", value: 12 },
    { label: "2 años", value: 24 },
    { label: "3 años", value: 36 },
];

export default function LineChart({ data }) {
    const [selectedRange, setSelectedRange] = useState("YTD");

    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();
    let startDate;
    const endDate = today;

    if (selectedRange === "YTD") {
        startDate = new Date(currentYear, 0, 1);
    } else {
        const monthsBack = selectedRange;
        startDate = new Date(currentYear, currentMonth - monthsBack + 1, 1);
    }

    const filteredData = useMemo(() => {
        return data.filter((d) => {
            const dt = new Date(d.datetime);
            return dt >= startDate && dt <= endDate;
        });
    }, [data, startDate, endDate]);

    const seriesData = filteredData.map((d) => [
        new Date(d.datetime).getTime(),
        d.tds,
    ]);

    const options = {
        chart: { height: 350, type: "line", toolbar: { show: false } },
        colors: ["#4fd1c5"],
        dataLabels: { enabled: false },
        legend: { show: false },
        xaxis: {
            type: "datetime",
            labels: { datetimeUTC: false },
            tickAmount: 6,
        },
        yaxis: {
            min: -100000,
            max: 100000,
            show: false,
            labels: { formatter: (val) => val },
            title: {
                text: "Dureza del agua (PPM)",
                style: { fontWeight: 500 },
            },
        },
        stroke: {
            curve: "straight",
            width: 3,
        },
        markers: {
            size: 5,
            colors: ["#4fd1c5"],
            strokeColors: "#fff",
            strokeWidth: 2,
        },
        grid: {
            row: { colors: ["#f3f3f3", "transparent"], opacity: 0.5 },
        },
        title: {
            text: "Calidad del Agua",
            align: "center",
            style: { fontWeight: 600, fontSize: "18px" },
        },
    };

    return (
        <div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:flex md:justify-center gap-2 mb-4 px-2">
                {rangeOptions.map((option) => (
                    <button
                        key={option.value}
                        onClick={() => setSelectedRange(option.value)}
                        className={`px-2 py-2 text-sm rounded-t ${
                            selectedRange === option.value
                                ? "bg-blue-600 text-white font-bold"
                                : "bg-gray-200 text-gray-700"
                        }`}
                    >
                        {option.label}
                    </button>
                ))}
            </div>
            <Chart
                options={options}
                series={[{ name: "PPM", data: seriesData }]}
                type="line"
                height={350}
            />
        </div>
    );
}
