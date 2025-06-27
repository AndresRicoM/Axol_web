import React, { useState, useMemo } from "react";
import Chart from "react-apexcharts";
import { DatePicker } from "antd";

const { RangePicker } = DatePicker;

export default function LineChart({ data }) {
    const [dateRange, setDateRange] = useState([null, null]);

    // Filtrar datos según rango seleccionado
    const filteredData = useMemo(() => {
        if (!dateRange[0] || !dateRange[1]) return data;

        const [start, end] = dateRange;
        return data.filter((d) => {
            const dt = new Date(d.datetime);
            return dt >= start && dt <= end;
        });
    }, [data, dateRange]);

    // Mapear los datos filtrados a formato [timestamp, valor]
    const seriesData = filteredData.map((d) => [
        new Date(d.datetime).getTime(),
        d.tds,
    ]);

    // Extraer meses para categorías según datos filtrados (opcional)
    // Aquí puedes adaptar si quieres categorías dinámicas o dejar vacío
    // Para mantener tu estilo original, usaremos meses fijos:
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

    // Opciones originales adaptadas para eje datetime
    const options = {
        chart: {
            height: 350,
            type: "line",
            toolbar: { show: false },
        },
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
            <Chart
                options={options}
                series={[{ name: "PPM", data: seriesData }]}
                type="line"
                height={350}
            />

            {/* Selector rango fechas */}
            <div className="mb-4 flex justify-center max-w-md mx-auto">
                <RangePicker
                    onChange={(dates) =>
                        setDateRange(
                            dates
                                ? [dates[0].toDate(), dates[1].toDate()]
                                : [null, null]
                        )
                    }
                    allowClear
                />
            </div>
        </div>
    );
}
