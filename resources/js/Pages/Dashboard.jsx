import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { Select } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCircleInfo,
    faGamepad,
    faCircleExclamation,
    faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import RadialChart from "@/Components/RadialChart";
import { Flex, Modal } from "antd";
import ChartCard from "@/Components/ChartCard";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import WaterQualityIndicator from "@/Components/WaterQualityIndicator";
import Notification from "@/Components/Notification";
import useRangoMesActual from "@/hooks/useRangoMesActual";
import BarChart from "@/Components/BarChart";
import BarChartPdf from "@/Components/BarChartPdf";
import DateReportForm from "@/Components/DateReportForm";
import LineChartPdf from "@/Components/LineChartPdf";
import QualityModal from "@/Components/QualityModal";

export default function Dashboard({ auth, user, axolData }) {
    console.log("axolData");
    console.log(axolData);

    console.log(typeof axolData);

    // Función para determinar el color basado en el porcentaje
    const [openResponsive, setOpenResponsive] = useState(false);
    const [openAjoloteModal, setOpenAjoloteModal] = useState(false);
    const [openDatePdfModal, setDatePdfModal] = useState(false);
    const [selectedConsumption, setSelectedConsumption] = useState({});
    const [homehubList, setHomehubList] = useState(axolData);

    console.log("axolData");
    console.log(axolData);

    const [currentHomehub, setCurrentHomehub] = useState(axolData[0]);
    const [currentLat, setCurrentLat] = useState(
        axolData.length > 0 ? parseFloat(currentHomehub.homehub.lat) : 0
    );
    const [currentLon, setCurrentLon] = useState(
        axolData.length > 0 ? parseFloat(currentHomehub.homehub.lon) : 0
    );

    console.log("location");

    const hour = new Date().getHours();

    // Estados para almacenar las imágenes de las gráficas para el PDF
    const [chartImage, setChartImage] = useState(null); // Imagen de la gráfica de consumo
    const [qualityChartImage, setQualityChartImage] = useState(null); // Imagen de la gráfica de calidad
    const monthlyConsumption = {
        "01": 120,
        "02": 140,
        "03": 100,
        "04": 170,
        "05": 200,
    };

    // Datos de ejemplo para la gráfica de calidad del agua mensual (PPM) (HARDCODEADOS)
    const monthlyQualityData = [
        180, 150, 200, 250, 300, 280, 220, 350, 400, 380, 320, 290,
    ];

    const getGreeting = () => {
        if (hour >= 5 && hour < 12) {
            return "Buenos días";
        } else if (hour >= 12 && hour < 18) {
            return "Buenas tardes";
        } else {
            return "Buenas noches";
        }
    };

    const elapsedTime = (dateLog) => {
        if (!dateLog) {
            return false; // Devuelve false si dateLog es null o undefined
        }
        return Date.now() - new Date(dateLog) > 3 * 86400000;
    };

    const handleChange = (value) => {
        setCurrentHomehub(homehubList[value]);
    };

    const handleOpenModal = (tank) => {
        setSelectedConsumption(tank.storage.monthly_consumption || {});
        setOpenAjoloteModal(true);
    };

    const handleOpenModalPDF = () => {
        setDatePdfModal(true);
    };

    const rangoFechas = useRangoMesActual();

    if (axolData.length === 0) {
        return (
            <AuthenticatedLayout user={auth.user}>
                <Head title="Dashboard" />
                <Flex vertical gap="middle" align="center">
                    <div className="flex md:flex-row flex-col gap-5 justify-between">
                        <span className="text-text md:text-5xl text-2xl font-semibold">
                            {getGreeting()}, {user.username}.
                        </span>
                    </div>
                    <span className="text-text text-2xl font-semibold mt-10">
                        No hay datos disponibles.
                    </span>
                    <span className="text-text text-lg mt-10">
                        Registra un Homehub
                    </span>
                </Flex>
            </AuthenticatedLayout>
        );
    }

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Dashboard" />
            <Flex vertical gap="middle" align="flex-start">
                <div className="flex flex-col w-full items-center bg-[#F2F0FB]">
                    <div className="flex flex-col gap-10 w-[95%] py-8">
                        <div className="flex md:flex-row flex-col gap-5 justify-between">
                            <span className="text-text md:text-5xl text-2xl font-semibold">
                                {getGreeting()}, {user.username}.
                            </span>
                            <Select
                                placeholder={
                                    <span className="text-text">
                                        Selecciona tu homehub
                                    </span>
                                }
                                style={{
                                    width: 280,
                                    height: 50,
                                }}
                                onChange={(value) => handleChange(value)}
                                defaultValue={0}
                            >
                                {homehubList.map((homehub, i) => (
                                    <Select.Option key={i} value={i}>
                                        <FontAwesomeIcon
                                            icon={faGamepad}
                                            className="text-text"
                                        />{" "}
                                        <span className="text-text">
                                            {homehub.homehub?.name}
                                        </span>
                                    </Select.Option>
                                ))}
                            </Select>
                        </div>

                        {/* aqui va el map que quite */}
                        <div className="flex flex-col gap-7">
                            {currentHomehub.sensors.map((tank) => (
                                <div
                                    key={tank.mac_add}
                                    className="flex flex-col gap-3 "
                                >
                                    {tank.storage ? (
                                        <span className="text-text font-semibold text-2xl">
                                            Tanque {tank.storage?.use}
                                        </span>
                                    ) : (
                                        <span className="text-text font-semibold text-2xl">
                                            Tanque {tank.quality?.use}
                                        </span>
                                    )}

                                    <div className="flex md:flex-row flex-col gap-3 w-full h-full overflow-hidden">
                                        <div className="md:w-3/4 w-full">
                                            <div className="flex md:flex-row flex-col gap-3">
                                                {/* Primera Card - Agua almacenada (pequeña) */}
                                                <div className="md:w-1/3 w-full">
                                                    <ChartCard
                                                        title={
                                                            <div className="flex justify-between items-center">
                                                                <span>
                                                                    Agua
                                                                    almacenada
                                                                </span>
                                                                <Notification
                                                                    flag={elapsedTime(
                                                                        tank
                                                                            .storage
                                                                            ?.datetime
                                                                    )}
                                                                    datetime={
                                                                        tank
                                                                            .storage
                                                                            ?.datetime
                                                                    }
                                                                />
                                                            </div>
                                                        }
                                                    >
                                                        <div className="grid grid-cols-1 gap-6 h-full">
                                                            <div className="flex flex-col gap-2 items-center justify-center h-full">
                                                                {tank.storage ? (
                                                                    tank.storage
                                                                        .water_distance >=
                                                                    0 ? (
                                                                        <>
                                                                            <RadialChart
                                                                                waterPercentage={
                                                                                    tank
                                                                                        .storage
                                                                                        ?.fill_percentage >
                                                                                    100
                                                                                        ? 100
                                                                                        : tank
                                                                                              .storage
                                                                                              ?.fill_percentage
                                                                                }
                                                                                className="h-20 w-20"
                                                                            />
                                                                            <div className="flex items-center text-center text-sm">
                                                                                <span className="font-semibold text-text">
                                                                                    Hay
                                                                                    un
                                                                                    total
                                                                                    de{" "}
                                                                                    {
                                                                                        tank
                                                                                            .storage
                                                                                            ?.remaining_liters
                                                                                    }{" "}
                                                                                    Litros
                                                                                    de
                                                                                    agua
                                                                                </span>
                                                                            </div>
                                                                        </>
                                                                    ) : (
                                                                        <span className="text-text font-semibold text-lg">
                                                                            <FontAwesomeIcon
                                                                                icon={
                                                                                    faCircleExclamation
                                                                                }
                                                                            />{" "}
                                                                            No
                                                                            hay
                                                                            datos
                                                                            del
                                                                            sensor
                                                                        </span>
                                                                    )
                                                                ) : (
                                                                    <span className="text-text font-semibold text-lg">
                                                                        No hay
                                                                        sensor
                                                                        registrado
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </ChartCard>
                                                </div>

                                                {/* Segunda Card - Calidad del agua */}
                                                <div className="md:w-2/3 w-full">
                                                    <ChartCard
                                                        title={
                                                            <div className="flex justify-between items-center">
                                                                <span>
                                                                    Calidad del
                                                                    agua
                                                                </span>
                                                                <div>
                                                                    <Notification
                                                                        flag={elapsedTime(
                                                                            tank
                                                                                .quality
                                                                                ?.datetime
                                                                        )}
                                                                        datetime={
                                                                            tank
                                                                                .quality
                                                                                ?.datetime
                                                                        }
                                                                    />

                                                                    <QualityModal
                                                                        data={
                                                                            tank
                                                                                .quality
                                                                                ?.monthlyQuality
                                                                        }
                                                                    />
                                                                    <button
                                                                        className="p-1 ml-5"
                                                                        onClick={() =>
                                                                            setOpenResponsive(
                                                                                true
                                                                            )
                                                                        }
                                                                    >
                                                                        <FontAwesomeIcon
                                                                            icon={
                                                                                faCircleInfo
                                                                            }
                                                                        />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        }
                                                        className="relative min-w-[320px] min-h-[370px] flex items-center justify-center"
                                                    >
                                                        <div className="flex md:flex-row-reverse flex-col gap-6">
                                                            <div className="flex md:grid-cols-2 gap-6 relative w-full">
                                                                <div className="w-full h-[281px]">
                                                                    {tank.quality ? (
                                                                        tank
                                                                            .quality
                                                                            .tds ? (
                                                                            <WaterQualityIndicator
                                                                                tds={
                                                                                    tank
                                                                                        .quality
                                                                                        ?.tds
                                                                                }
                                                                            />
                                                                        ) : (
                                                                            <span className="text-text font-semibold text-2xl">
                                                                                <FontAwesomeIcon
                                                                                    icon={
                                                                                        faCircleExclamation
                                                                                    }
                                                                                />{" "}
                                                                                No
                                                                                hay
                                                                                datos
                                                                                del
                                                                                sensor
                                                                            </span>
                                                                        )
                                                                    ) : (
                                                                        <span className="text-text font-semibold text-2xl">
                                                                            No
                                                                            hay
                                                                            sensor
                                                                            registrado
                                                                        </span>
                                                                    )}
                                                                    {/* <ColumnChart tds={tank} /> */}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </ChartCard>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Tercera Card - Agua Consumida */}
                                        <div className="md:w-1/4 w-full">
                                            <ChartCard
                                                title={
                                                    <div className="flex justify-end items-center">
                                                        {/* Lupa animada */}
                                                        <button
                                                            className="transition-transform duration-200 hover:scale-150 outline-none"
                                                            onClick={() =>
                                                                handleOpenModal(
                                                                    tank
                                                                )
                                                            }
                                                        >
                                                            <FontAwesomeIcon
                                                                icon={
                                                                    faMagnifyingGlass
                                                                }
                                                                className="cursor-pointer text-blue-600 hover:text-blue-700"
                                                            />
                                                        </button>
                                                    </div>
                                                }
                                                className="relative min-w-[320px] min-h-[370px] flex items-center justify-center"
                                            >
                                                <div className="flex flex-col items-center justify-center h-full w-full">
                                                    <img
                                                        src="/assets/Desktop/Card3/Grifogif.gif"
                                                        alt="Grifo animado"
                                                        className="w-32 h-32 mb-2 object-contain mx-auto"
                                                    />
                                                    <span className="text-2xl font-semibold text-center">
                                                        Agua
                                                        <br />
                                                        Consumida
                                                    </span>
                                                    <div className="flex items-center gap-1 text-gray-500 mt-2">
                                                        <img
                                                            src="/assets/Desktop/Card3/Calendario.png"
                                                            alt="Calendario"
                                                            className="h-7 w-7 object-contain"
                                                        />
                                                        <span className="font-semibold text-base">
                                                            {rangoFechas}
                                                        </span>
                                                    </div>

                                                    <span className="text-4xl font-extrabold mt-2 mb-2">
                                                        {Object.values(
                                                            tank.storage
                                                                .monthly_consumption
                                                        ).pop()}{" "}
                                                        litros
                                                    </span>
                                                </div>
                                            </ChartCard>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-center w-full -mt-2 -mb-2">
                            <div className="flex justify-end items-center">
                                {/* Lupa animada */}
                                <button
                                    className="transition-transform duration-200 hover:scale-150 outline-none"
                                    onClick={() => handleOpenModalPDF()}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-7 w-7 text-blue-600"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    >
                                        <circle cx="11" cy="11" r="7" />
                                        <line
                                            x1="16.5"
                                            y1="16.5"
                                            x2="21"
                                            y2="21"
                                        />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Map */}
                        <MapContainer
                            center={[currentLat, currentLon]}
                            zoom={13}
                            scrollWheelZoom={false}
                            style={{ height: "400px", width: "100%" }}
                        >
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            <Marker position={[currentLat, currentLon]}>
                                <Popup>
                                    Tanques: {currentHomehub.sensors.length}
                                </Popup>
                            </Marker>
                        </MapContainer>
                    </div>
                    {/* PopUp de info */}
                </div>

                {/* Modal personalizado para mostrar información importante sobre la calidad del agua */}
                <Modal
                    // Título del modal con estilo personalizado: texto grande, negrita y mayúsculas
                    title={
                        <span className="text-2xl font-bold">¡CUIDADO!</span>
                    }
                    open={openResponsive}
                    // Handler para el botón OK
                    onOk={() => setOpenResponsive(false)}
                    // Handler para la X y click fuera del modal
                    onCancel={() => setOpenResponsive(false)}
                    // Ocultamos el botón de cancelar del modal
                    cancelButtonProps={{ style: { display: "none" } }}
                    // Configuración del ancho responsive del modal según el tamaño de pantalla
                    width={{
                        xs: "90%", // Móviles: usa 90% del ancho de la pantalla
                        sm: "80%", // Tablets pequeñas: usa 80% del ancho
                        md: "70%", // Tablets: usa 70% del ancho
                        lg: "60%", // Laptops: usa 60% del ancho
                        xl: "50%", // Monitores: usa 50% del ancho
                        xxl: "40%", // Pantallas grandes: usa 40% del ancho
                    }}
                    // Centramos todo el contenido del modal
                    className="text-center"
                >
                    {/* Contenedor flex para organizar el contenido en columna y centrado */}
                    <div className="flex flex-col items-center gap-6">
                        <p className="text-lg mt-4">
                            <span className="font-bold">Siempre</span> hierve el
                            agua y toma precauciones con su consumo. La medición
                            de calidad presentada{" "}
                            <span className="font-bold">no detecta</span> ni
                            toma en cuenta todos los tipos de contaminantes ni
                            bacterias.
                        </p>

                        {/* Categorías de calidad del agua */}
                        <div className="flex flex-col gap-4 w-full items-center">
                            <div className="text-[#00E396] text-lg">
                                Buena: Categoría 1 - Agua pura o con bajo
                                contenido de minerales y metales.
                            </div>
                            <div className="text-[#FEB019] text-lg">
                                Regular: Categoría 2 - Agua con características
                                de agua tratada.
                            </div>
                            <div className="text-[#FF4560] text-lg">
                                Mala: Categoría 3 - Agua con alto contenido de
                                minerales y posibles metales.
                            </div>
                        </div>

                        <img
                            src="/assets/Information/tds_agua.jpeg"
                            alt="Escala de PPM del agua"
                            className="w-full max-w-3xl mt-12"
                        />
                    </div>
                </Modal>

                {/* // Modal para mostrar la imagen del ajolote expandido al presionar la imagen en el dashboard // */} 
                <Modal
                    title={""}
                    open={openAjoloteModal}
                    onOk={() => setOpenAjoloteModal(false)}
                    onCancel={() => setOpenAjoloteModal(false)}
                    cancelButtonProps={{ style: { display: "none" } }}
                    width={{
                        xs: "90%", // Móviles: usa 90% del ancho de la pantalla
                        sm: "80%", // Tablets pequeñas: usa 80% del ancho
                        md: "70%", // Tablets: usa 70% del ancho
                        lg: "60%", // Laptops: usa 60% del ancho
                        xl: "50%", // Monitores: usa 50% del ancho
                        xxl: "40%", // Pantallas grandes: usa 40% del ancho
                    }}
                >
                    <div className="max-h-[80vh] w-3/4 mx-auto">
                        <BarChart monthlyConsumption={selectedConsumption} />
                    </div>
                </Modal>

                {/* // Modal para mostrar el formulario para solicitar las fechas de reporte // */}
                <Modal
                    title={
                        <div className="text-center w-full text-2xl font-bold">
                            Generacion de reporte
                        </div>
                    }
                    open={openDatePdfModal}
                    onOk={() => setDatePdfModal(false)}
                    onCancel={() => setDatePdfModal(false)}
                    cancelButtonProps={{ style: { display: "none" } }}
                    width={{
                        xs: "90%",
                        sm: "80%",
                        md: "70%",
                        lg: "60%",
                        xl: "50%",
                        xxl: "40%",
                    }}
                >
                    <div>
                        <div
                            style={{
                                position: "absolute",
                                left: "-9999px",
                                top: 0,
                            }}
                        >
                            <BarChartPdf
                                monthlyConsumption={monthlyConsumption}
                                onExport={setChartImage}
                            />
                            <LineChartPdf
                                data={monthlyQualityData}
                                onExport={setQualityChartImage}
                            />
                        </div>

                        <DateReportForm //Implementacion del componente DateReportForm
                            currentHomehub={currentHomehub}
                            chartImage={chartImage}
                            qualityChartImage={qualityChartImage}
                            onSubmit={(fechaInicio, fechaFin) =>
                                console.log(fechaInicio, fechaFin)
                            }
                        />
                    </div>
                </Modal>
            </Flex>
            {/* Division de cuadros */}
        </AuthenticatedLayout>
    );
}
