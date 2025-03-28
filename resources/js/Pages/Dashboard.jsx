import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { Select } from "antd";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleInfo, faGamepad, faCircleExclamation, faBell } from '@fortawesome/free-solid-svg-icons'
import RadialChart from "@/Components/RadialChart";
import ColumnChart from "@/Components/ColumnChart";
import { Flex, Modal } from 'antd';
import ChartCard from "@/Components/ChartCard";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import WaterQualityIndicator from "@/Components/WaterQualityIndicator";
import Notification from "@/Components/Notification";


export default function Dashboard({ auth, user, axolData }) {
    // console.log("qualityData");
    // console.log(qualityData);
    // console.log("tankData");
    // console.log(tankData);
    // console.log("homehubData");
    // console.log(homehubData);

    // console.log("user")
    // console.log(user)
    // console.log("userId")
    // console.log(userId)
    // console.log("homehubData")
    // console.log(homehubData)

    console.log("axolData")
    console.log(axolData)

    // const [qualityData, setQualityData] = useState(axolData.qualityData);
    console.log(typeof axolData)
    // return (<></>);

    // Función para determinar el color basado en el porcentaje
    const [selectedCity, setSelectedCity] = useState(null);
    const [open, setOpen] = useState(false);
    const [openResponsive, setOpenResponsive] = useState(false);
    const [openAjoloteModal, setOpenAjoloteModal] = useState(false);
    const [homehubList, setHomehubList] = useState(axolData);

    console.log("axolData")
    console.log(axolData)

    // return (
    //     <></>
    // )

    const [currentHomehub, setCurrentHomehub] = useState(axolData[0]);
    const [currentLat, setCurrentLat] = useState(axolData.length > 0 ? parseFloat(currentHomehub.homehub.lat) : 0);
    const [currentLon, setCurrentLon] = useState(axolData.length > 0 ? parseFloat(currentHomehub.homehub.lon) : 0);

    console.log("location")
    // console.log(currentHomehub.homehub.lat)
    // console.log(currentHomehub.homehub.lon)

    // const homehubList = [
    //     { name: "CSLab" },
    //     { name: "PabloHH" },
    //     { name: "TonyHH" },
    //     { name: "CUCEI1" },
    //     { name: "CUCEI2" },
    // ];

    // const tanks = [
    //     { name: "Tank CSLab", id: 1 },
    //     { name: "Tank PabloHH", id: 2 },
    //     { name: "Tank TonyHH", id: 3 },
    //     { name: "Tank CUCEI1", id: 4 },
    //     { name: "Tank CUCEI2", id: 5 },
    // ];

    const hour = new Date().getHours();

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
        return (Date.now() - new Date(dateLog)) > 3 * 86400000;
    };


    const handleChange = (value) => {
        setCurrentHomehub(homehubList[value]);
    }

    if (axolData.length === 0) {
        return (
            <AuthenticatedLayout user={auth.user}>
                <Head title="Dashboard" />
                <Flex vertical gap="middle" align="center">
                    <div className="flex md:flex-row flex-col gap-5 justify-between">
                        <span className="text-text md:text-5xl text-2xl font-semibold">{getGreeting()}, {user.username}.</span>
                    </div>
                    <span className="text-text text-2xl font-semibold mt-10">No hay datos disponibles.</span>
                    <span className="text-text text-lg mt-10">Registra un Homehub</span>
                </Flex>
            </AuthenticatedLayout>
        )
    }

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Dashboard" />
            <Flex vertical gap="middle" align="flex-start">
                <div className="flex flex-col w-full items-center bg-[#F2F0FB]">
                    <div className="flex flex-col gap-10 w-[95%] py-8">
                        <div className="flex md:flex-row flex-col gap-5 justify-between">
                            <span className="text-text md:text-5xl text-2xl font-semibold">{getGreeting()}, {user.username}.</span>
                            <Select
                                placeholder={<span className="text-text">Selecciona tu homehub</span>}
                                style={{
                                    width: 280,
                                    height: 50,
                                }}
                                onChange={(value) => handleChange(value)}
                                defaultValue={0}
                            >
                                {homehubList.map((homehub, i) => (
                                    <Select.Option key={i} value={i} >
                                        <FontAwesomeIcon icon={faGamepad} className="text-text" /> <span className="text-text">{homehub.homehub?.name}</span>
                                    </Select.Option>
                                ))}
                            </Select>
                        </div>

                        {/* aqui va el map que quite */}
                        <div className="flex flex-col gap-7">
                            {currentHomehub.sensors.map((tank) => (
                                
                                <div key={tank.mac_add} className="flex flex-col gap-3 ">
                                    {tank.storage ?
                                        (<span className="text-text font-semibold text-2xl">Tanque {tank.storage?.use}</span>)
                                        :
                                        (<span className="text-text font-semibold text-2xl">Tanque {tank.quality?.use}</span>)
                                    }

                                    <div className="flex md:flex-row flex-col gap-3 w-full h-full overflow-hidden">
                                        <div className="md:w-3/4 w-full">
                                            <div className="flex md:flex-row flex-col gap-3">
                                                {/* Primera Card - Agua almacenada (pequeña) */}
                                                <div className="md:w-1/3 w-full">
                                                    <ChartCard title={
                                                            <div className="flex justify-between items-center">
                                                                <span>Agua almacenada</span>
                                                                <Notification flag={elapsedTime(tank.storage?.datetime)} datetime={tank.storage?.datetime}/>
                                                            </div>
                                                    }>
                                                        <div className="grid grid-cols-1 gap-6 h-full">
                                                            <div className="flex flex-col gap-2 items-center justify-center h-full">
                                                                {tank.storage ?
                                                                    (
                                                                        tank.storage.water_distance >= 0 ? 
                                                                        (
                                                                            <>
                                                                                <RadialChart waterPercentage={tank.storage?.fill_percentage > 100 ? 100 : tank.storage?.fill_percentage} className="h-20 w-20" />
                                                                                <div className="flex items-center text-center text-sm">
                                                                                    <span className="font-semibold text-text">Hay un total de {tank.storage?.remaining_liters} Litros de agua</span>
                                                                                </div>
                                                                            </>
                                                                        )
                                                                        :
                                                                        (<span className="text-text font-semibold text-lg"><FontAwesomeIcon icon={faCircleExclamation} /> No hay datos del sensor</span>)
                                                                    )
                                                                    :
                                                                    (<span className="text-text font-semibold text-lg">No hay sensor registrado</span>)
                                                                }
                                                            </div>
                                                        </div>
                                                    </ChartCard>
                                                </div>

                                                {/* Segunda Card - Calidad del agua */}
                                                <div className="md:w-2/3 w-full">
                                                    <ChartCard
                                                        title={
                                                            <div className="flex justify-between items-center">
                                                                <span>Calidad del agua</span>
                                                                <div>
                                                                    <Notification flag={elapsedTime(tank.quality?.datetime)}
                                                                    datetime={tank.quality?.datetime}/>
                                                                    <button
                                                                        className="p-1 ml-5"
                                                                        onClick={() => setOpenResponsive(true)}
                                                                    >
                                                                        <FontAwesomeIcon icon={faCircleInfo} />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        }
                                                        className="relative min-h-[400px] py-4"
                                                    >
                                                        <div className="flex md:flex-row-reverse flex-col gap-6">
                                                            <div className="flex md:grid-cols-2 gap-6 relative w-full">
                                                                <div className="w-full h-[281px]">
                                                                    {tank.quality ?
                                                                        (   
                                                                            tank.quality.tds ? 
                                                                            (<WaterQualityIndicator tds={tank.quality?.tds} />) 
                                                                            :
                                                                            (<span className="text-text font-semibold text-2xl"><FontAwesomeIcon icon={faCircleExclamation} /> No hay datos del sensor</span>)
                                                                            
                                                                        )
                                                                        :
                                                                        (<span className="text-text font-semibold text-2xl">No hay sensor registrado</span>)
                                                                    }
                                                                    {/* <ColumnChart tds={tank} /> */}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </ChartCard>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Tercera Card - Ajolote */}
                                        <div className="md:w-1/4 w-full">
                                            <ChartCard
                                                title={
                                                    <div className="flex justify-between items-center">
                                                        <span>Ajolotito</span>
                                                    </div>
                                                }
                                                className="relative h-full py-4"
                                            >
                                                <div className="relative flex items-center justify-center cursor-pointer transition-transform duration-300 hover:scale-105 hover:opacity-80"
                                                     onClick={() => setOpenAjoloteModal(true)}>
                                                    
                                                    {tank.quality?.tds < 900 ?
                                                        (

                                                            <img
                                                                src="/assets/Desktop/Calidad/Axol_TITO_Dashboard.gif"
                                                                alt="Calidad buena o regular"
                                                                className="w-64 h-64 object-cover mt-2"
                                                            />
                                                        )
                                                        :
                                                        (
                                                            <img
                                                                src="/assets/Desktop/Calidad/Ajolotito_triste_1.gif"
                                                                alt="Mala calidad"
                                                                className="w-64 h-64 object-cover mt-2"
                                                            />
                                                        )
                                                    }
                                                    
                                    </div>
                                    </ChartCard>
                                        </div>
                                    </div>
                                </div>
                            ))}
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


                        <p className="text-lg mt-4">
                            <span className="font-bold">Siempre</span> hierve el agua y toma precauciones con su consumo.
                            La medición de calidad presentada{' '}
                            <span className="font-bold">no detecta</span> ni toma en cuenta todos los tipos de contaminantes ni bacterias.
                        </p>


                        {/* Categorías de calidad del agua */}
                        <div className="flex flex-col gap-4 w-full items-center">
                            <div className="text-[#00E396] text-lg">
                                Buena: Categoría 1 - Agua pura o con bajo contenido de minerales y metales.
                            </div>
                            <div className="text-[#FEB019] text-lg">
                                Regular: Categoría 2 - Agua con características de agua tratada.
                            </div>
                            <div className="text-[#FF4560] text-lg">
                                Mala: Categoría 3 - Agua con alto contenido de minerales y posibles metales.
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
                    title={<div className="text-center w-full text-2xl font-bold">
                            TITO el ajolotito
                            </div>
                    }
                    open={openAjoloteModal}
                    onOk={() => setOpenAjoloteModal(false)}
                    onCancel={() => setOpenAjoloteModal(false)}
                    cancelButtonProps={{ style: { display: 'none' } }}
                    width="90%"
                    style={{ top: 20 }} // Mantiene el modal dentro de la pantalla
                >
                    <div className="max-h-[80vh] flex flex-col items-center justify-center">
                        <p className="text-lg mt-4 text-center px-4">
                            Los ajolotes son muy sensibles a la calidad del agua. Si el nivel de sólidos disueltos totales (TDS) es alto, el ajolote podría estar en peligro.
                        </p>

                        {/* Imagen que se adapta sin scroll */}
                        <img
                            src="/assets/Desktop/Calidad/Axol_TITO_Dashboard.gif"
                            alt="Ajolote Feliz" 
                            className="max-w-full max-h-[60vh] h-auto object-contain mt-6"
                        />
                    </div>
                </Modal>

            </Flex>
            {/* Division de cuadros */}
        </AuthenticatedLayout>
    );
}