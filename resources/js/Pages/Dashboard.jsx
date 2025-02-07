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
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'

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

                        <div className="flex flex-col gap-7">
                            {tanks.map((tank) => (
                                <div key={tank.id} className="flex flex-col gap-3 ">
                                    <span className="text-text font-semibold text-2xl">Tanque {tank.name}</span>

                                    <div className="flex md:flex-row flex-col gap-3 w-full h-full overflow-hidden">
                                        <div className="md:w-3/4 w-full">
                                            <div className="flex md:flex-row flex-col gap-3">
                                                {/* Primera Card - Agua almacenada (pequeña) */}
                                                <div className="md:w-1/3 w-full">
                                                    <ChartCard title="Agua almacenada">
                                                        <div className="grid grid-cols-1 gap-6 h-full">
                                                            <div className="flex flex-col gap-2 items-center justify-center h-full">
                                                                <RadialChart waterData={waterData} className="h-20 w-20" />
                                                                <div className="flex items-center text-center text-sm">
                                                                    <span>Hay un total de 0 Litros de agua</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </ChartCard>
                                                </div>

                                                {/* Segunda Card - Agua almacenada (ancha) */}
                                                <div className="md:w-2/3 w-full">
                                                    <ChartCard
                                                        title={
                                                            <div className="flex justify-between items-center">
                                                                <span>Agua almacenada</span>
                                                                
                                                            </div>
                                                        }
                                                        className="relative h-full py-4"
                                                    >
                                                        {/* Contenido de agua almacenada */}
                                                    </ChartCard>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Tercera Card - Mismo tamaño que la primera */}
                                        <div className="md:w-1/4 w-full">
                                            <ChartCard
                                                title={
                                                    <div className="flex justify-between items-center">
                                                        <span>Ajolotito</span>
                                                        <button
                                                            className="p-1"
                                                            onClick={() => setOpenResponsive(true)}
                                                        >
                                                            <FontAwesomeIcon icon={faCircleInfo} />
                                                        </button>
                                                    </div>
                                                }
                                                className="relative h-full py-4"
                                            >
                                                <div className="flex items-center justify-center h-full">
                                                    <img 
                                                        src="/assets/Desktop/CirculoAjolote/CirculoBlanco.gif" 
                                                        alt="Ajolotito"
                                                        className="w-64 h-64 object-cover mt-2"
                                                    />
                                                </div>
                                            </ChartCard>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Map */}
                        <MapContainer
                            center={[51.505, -0.09]}
                            zoom={13}
                            scrollWheelZoom={false}
                            style={{ height: "400px", width: "100%" }}
                        >
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            <Marker position={[51.505, -0.09]}>
                                <Popup>
                                    A pretty CSS3 popup. <br /> Easily customizable.
                                </Popup>
                            </Marker>
                        </MapContainer>
                    </div>
                    {/* PopUp de info */}




                </div>

                {/* Modal personalizado para mostrar información importante sobre la calidad del agua */}
                <Modal
                    // Título del modal con estilo personalizado: texto grande, negrita y mayúsculas
                    title={<span className="text-2xl font-bold">¡CUIDADO!</span>}
                    open={openResponsive}
                    // Handler para el botón OK
                    onOk={() => setOpenResponsive(false)}
                    // Handler para la X y click fuera del modal
                    onCancel={() => setOpenResponsive(false)}
                    // Ocultamos el botón de cancelar del modal
                    cancelButtonProps={{ style: { display: 'none' } }}
                    // Configuración del ancho responsive del modal según el tamaño de pantalla
                    width={{
                        xs: '90%',  // Móviles: usa 90% del ancho de la pantalla
                        sm: '80%',  // Tablets pequeñas: usa 80% del ancho
                        md: '70%',  // Tablets: usa 70% del ancho
                        lg: '60%',  // Laptops: usa 60% del ancho
                        xl: '50%',  // Monitores: usa 50% del ancho
                        xxl: '40%', // Pantallas grandes: usa 40% del ancho
                    }}
                    // Centramos todo el contenido del modal
                    className="text-center"
                >
                    {/* Contenedor flex para organizar el contenido en columna y centrado */}
                    <div className="flex flex-col items-center gap-6">
                        {/* Párrafo de advertencia con palabras clave resaltadas en negrita */}
                        <p className="text-lg">
                            <span className="font-bold">Siempre</span> hierve el agua y toma precauciones con su consumo. La medición de calidad presentada{' '}
                            <span className="font-bold">no detecta</span> ni toma en cuenta todos los tipos de contaminantes ni bacterias.
                        </p>

                        {/* Imagen informativa que muestra la escala de PPM */}
                        <img
                            src="/assets/Information/tds_agua.jpeg"
                            alt="Escala de PPM del agua"
                            // Ancho completo con máximo de 768px y margen superior
                            className="w-full max-w-3xl mt-4"
                        />
                    </div>
                </Modal>
            </Flex>
            {/* Division de cuadros */}
        </AuthenticatedLayout>
    );
}
