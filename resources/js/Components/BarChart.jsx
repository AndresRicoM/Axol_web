import React, { useState } from "react";
import Chart from "react-apexcharts";
import { Select } from "antd";

const { Option } = Select;

const colors = [
    "#008FFB",
    "#00E396",
    "#FEB019",
    "#FF4560",
    "#775DD0",
    "#546E7A",
    "#26A69A",
    "#D10CE8",
];
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

export default function BarChart({ monthlyConsumption }) {
    const [startMonth, setStartMonth] = useState(0); // Enero (0)
    const [endMonth, setEndMonth] = useState(new Date().getMonth()); // Mes actual

    // Llenar los meses sin datos con 0
    const consumptionData = allMonths.map((_, index) => {
        const monthKey = (index + 1).toString().padStart(2, "0");
        return monthlyConsumption?.[monthKey] ?? 0;
    });

    // Filtrar los meses y datos según el rango seleccionado
    const displayedMonths = allMonths.slice(startMonth, endMonth + 1);
    const displayedData = consumptionData.slice(startMonth, endMonth + 1);

    const options = {
        chart: { height: 350, type: "bar", toolbar: { show: false } },
        title: {
            text: "Consumo de agua",
            align: "center",
            style: { fontWeight: 600, fontSize: "18px" },
        },
        colors: colors.slice(0, displayedMonths.length),
        plotOptions: {
            bar: { columnWidth: "60%", distributed: true },
        },
        dataLabels: { enabled: false },
        legend: { show: false },
        xaxis: {
            categories: displayedMonths,
            title: { text: "Meses del año", style: { fontWeight: 500 } },
        },
        yaxis: {
            title: { text: "Litros", style: { fontWeight: 500 } },
        },
        grid: {
            row: { colors: ["#f3f3f3", "transparent"], opacity: 0.5 },
        },
    };

    return (
        <div className="mx-auto">
            {/* Gráfica */}
            <Chart
                options={options}
                series={[{ name: "Litros", data: displayedData }]}
                type="bar"
                height={350}
            />

            <div className="flex justify-center gap-4 mb-4">
                <div>
                    <label className="mr-2">Mes inicio: </label>
                    <Select
                        style={{ width: 120 }}
                        value={startMonth}
                        onChange={(value) => setStartMonth(value)}
                    >
                        {allMonths.map((month, idx) => (
                            <Option
                                key={month}
                                value={idx}
                                disabled={idx > endMonth}
                            >
                                {month}
                            </Option>
                        ))}
                    </Select>
                </div>

                <div>
                    <label className="mr-2">Mes fin: </label>
                    <Select
                        style={{ width: 120 }}
                        value={endMonth}
                        onChange={(value) => setEndMonth(value)}
                    >
                        {allMonths.map((month, idx) => (
                            <Option
                                key={month}
                                value={idx}
                                disabled={idx < startMonth}
                            >
                                {month}
                            </Option>
                        ))}
                    </Select>
                </div>
            </div>
        </div>
    );
}
