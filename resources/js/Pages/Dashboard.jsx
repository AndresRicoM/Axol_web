import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { Select } from "antd";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleInfo, faGamepad } from '@fortawesome/free-solid-svg-icons'
import RadialChart from "@/Components/RadialChart";
import ColumnChart from "@/Components/ColumnChart";
import { Button, Flex, Modal } from 'antd';
import ChartCard from "@/Components/ChartCard";

export default function Dashboard({ auth, waterData, user }) {
    // Función para determinar el color basado en el porcentaje
    const [selectedCity, setSelectedCity] = useState(null);
    const [open, setOpen] = useState(false);
    const [openResponsive, setOpenResponsive] = useState(false);

    const homehubList = [
        { name: "CSLab" },
        { name: "PabloHH" },
        { name: "TonyHH" },
        { name: "CUCEI1" },
        { name: "CUCEI2" },
    ];

    const tanks = [
        { name: "Tank CSLab", id: 1 },
        { name: "Tank PabloHH", id: 2 },
        { name: "Tank TonyHH", id: 3 },
        { name: "Tank CUCEI1", id: 4 },
        { name: "Tank CUCEI2", id: 5 },
    ];

    const hour = new Date().getHours();

    const getGreeting = () => {
        if (hour >= 5 && hour < 12) {
            return "Good Morning";
        } else if (hour >= 12 && hour < 18) {
            return "Good Afternoon";
        } else {
            return "Good Evening";
        }
    };

    // const getChartColor = (percentage) => {
    //     if (percentage <= 25) return "#FF4560"; // Rojo - Nivel crítico
    //     if (percentage <= 50) return "#FEB019"; // Amarillo - Nivel bajo
    //     if (percentage <= 75) return "#3CADD4"; // Azul - Nivel normal
    //     return "#00E396"; // Verde - Nivel óptimo
    // };

    // const options = {
    //     series: [waterData.totalFill],
    //     chart: {
    //         height: 300,
    //         type: 'radialBar',
    //     },
    //     colors: [getChartColor(waterData.totalFill)], // Color dinámico
    //     plotOptions: {
    //         radialBar: {
    //             hollow: {
    //                 size: '70%',
    //             },
    //             track: {
    //                 background: '#f2f2f2',  // Color del fondo de la barra
    //             },
    //             dataLabels: {
    //                 value: {
    //                     fontSize: '24px',
    //                     formatter: function(val) {
    //                         return val + '%';
    //                     }
    //                 }
    //             }
    //         },
    //     },
    //     stroke: {
    //         lineCap: 'round'
    //     },
    //     labels: ['Almacenamiento'],
    //     tooltip: {
    //         enabled: true,
    //         formatter: function(val) {
    //             return waterData.totalMass + ' Litros';
    //         }
    //     }
    // };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Dashboard" />
            <Flex vertical gap="middle" align="flex-start">
                <div className="flex flex-col w-full items-center">
                    <div className="flex flex-col gap-10 w-[95%] py-8">
                        <div className="flex md:flex-row flex-col gap-5 justify-between">
                            <span className="text-text md:text-5xl text-2xl font-semibold">{getGreeting()}, {user.username}.</span>
                            <Select
                                placeholder={<span className="text-text">Selecciona tu homehub</span>}
                                style={{
                                    width: 280,
                                    height: 50,
                                }}
                            // onChange={handleChange}
                            >
                                {homehubList.map((homehub) => (
                                    <Select.Option key={homehub.name} value={homehub.name}>
                                        <FontAwesomeIcon icon={faGamepad} className="text-text" /> <span className="text-text">{homehub.name}</span>
                                    </Select.Option>
                                ))}
                            </Select>
                        </div>

                        <div className="">
                            {tanks.map((tank) => (
                                <div key={tank.id} className="flex flex-col gap-5">
                                    <span className="text-text font-semibold text-2xl">Tanque {tank.name}</span>

                                    <div className="flex md:flex-row flex-col gap-3">
                                        <ChartCard title="Nivel de agua" className="w-full md:w-1/2">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                {/* Información del agua */}
                                                <div className="flex flex-col gap-3">
                                                    <RadialChart waterData={waterData} />
                                                </div>
                                                <div className="flex items-center">
                                                    <span>Hay un total de 0 Litros de Agua en la Casa</span>
                                                </div>
                                            </div>
                                        </ChartCard>

                                        <ChartCard title="Estado del Agua" className="w-full md:w-1/2 relative">
                                            <div className="flex md:flex-row-reverse flex-col gap-3">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative w-full">
                                                    <div className="w-full">
                                                        <ColumnChart />
                                                    </div>
                                                    <Button
                                                        className="absolute top-2 right-2 p-1"
                                                        onClick={() => setOpenResponsive(true)}
                                                    >
                                                        <FontAwesomeIcon icon={faCircleInfo} />
                                                    </Button>
                                                </div>
                                            </div>
                                        </ChartCard>

                                    </div>

                                </div>
                            ))}

                        </div>
                    </div>
                    {/* PopUp de info */}

                    {/* Map */}
                    {/* <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={false}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={[51.505, -0.09]}>
                        <Popup>
                            A pretty CSS3 popup. <br /> Easily customizable.
                        </Popup>
                    </Marker>
                </MapContainer> */}

                    <div className="max-w-7xl mx-auto p-6 lg:p-8">
                        <div className="mt-16">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                                <a
                                    href="#"
                                    className="scale-100 p-6 bg-white white:bg-gray-800/50 dark:bg-gradient-to-bl from-gray-700/50 via-transparent dark:ring-1 dark:ring-inset dark:ring-white/5 rounded-lg shadow-2xl shadow-gray-500/20 dark:shadow-none flex motion-safe:hover:scale-[1.01] transition-all duration-250 focus:outline focus:outline-2 focus:outline-red-500"
                                >
                                    <div>
                                        <div className="h-16 w-16 bg-red-50 dark:bg-red-800/20 flex items-center justify-center rounded-full">
                                            <img
                                                src="/assets/AxoloteCool.gif"
                                                alt="Mi Logo"
                                            />
                                        </div>

                                        <h2 className="mt-6 text-xl font-semibold text-gray-900 dark:text-white">
                                            Documentation
                                        </h2>

                                        <p className="mt-4 text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                                            Lorem, ipsum dolor sit amet consectetur
                                            adipisicing elit. Quisquam quae ullam
                                            deserunt tenetur amet nulla eaque rem
                                            quidem, dignissimos commodi molestiae
                                            deleniti .
                                        </p>
                                    </div>

                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth="1.5"
                                        className="self-center shrink-0 stroke-red-500 w-6 h-6 mx-6"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75"
                                        />
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <Modal
                    title={<span className="text-text">¡Cuidado!</span>}
                    open={openResponsive}
                    onOk={() => setOpenResponsive(false)}
                    cancelButtonProps={{ style: { display: 'none' } }}
                    width={{
                        xs: '90%',
                        sm: '80%',
                        md: '70%',
                        lg: '60%',
                        xl: '50%',
                        xxl: '40%',
                    }}
                >
                    <p>
                        Siempre hierve el agua y toma precauciones con su consumo. La medición de calidad presentada no
                        detecta ni toma en cuenta todos los tipos de contaminantes ni bacterias.
                    </p>
                    <img src="\assets\Information\tds_agua.jpeg" alt="Agua" className="w-full" />

                </Modal>
            </Flex>
            {/* Division de cuadros */}
        </AuthenticatedLayout>
    );
}
