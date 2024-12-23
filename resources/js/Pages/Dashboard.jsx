import React from 'react';
import ReactApexChart from 'react-apexcharts';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

const WaterChart = ({ waterData }) => {
    // Configuración de la gráfica
    const options = {
        series: [waterData.totalFill],
        chart: {
            height: 300,
            type: 'radialBar',
        },
        colors: ['#3CADD4'],
        plotOptions: {
            radialBar: {
                hollow: {
                    size: '70%',
                }
            },
        },
        stroke: {
            lineCap: 'round'
        },
        labels: ['Almacenamiento'],
        tooltip: {
            enabled: false
        }
    };

    return (
        <div className="water-chart-container">
            <h3>Agua Disponible</h3>
            <ReactApexChart 
                options={options} 
                series={options.series} 
                type="radialBar" 
                height={300} 
            />
            <p className="water-total">
                Hay un total de {waterData.totalMass} Litros de Agua en la Casa
            </p>
        </div>
    );
};

export default function Dashboard({ auth, waterData }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard</h2>}
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
                        <div className="p-6">
                            <h2 className="text-2xl font-semibold mb-4">Estado del Agua</h2>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Información del agua */}
                                <div className="space-y-4">
                                    <div className="bg-blue-50 p-4 rounded-lg">
                                        <p className="text-lg">
                                            Total de agua: <span className="font-bold">{waterData.totalMass}</span> Litros
                                        </p>
                                    </div>
                                    
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <p>Tanques conectados: {waterData.tankNum}</p>
                                        <p>Volumen total: {waterData.totalVolume} m³</p>
                                    </div>
                                </div>

                                {/* Gráfica circular */}
                                <div className="h-[400px]">
                                    <WaterChart waterData={waterData} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">You're logged in!</div>
                    </div>
                </div>
            </div>

{/* PopUp de info */}
        
            <div className="max-w-7xl mx-auto p-6 lg:p-8">

                    <div className="mt-16">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                            <a
                                href="#"
                                className="scale-100 p-6 bg-white white:bg-gray-800/50 dark:bg-gradient-to-bl from-gray-700/50 via-transparent dark:ring-1 dark:ring-inset dark:ring-white/5 rounded-lg shadow-2xl shadow-gray-500/20 dark:shadow-none flex motion-safe:hover:scale-[1.01] transition-all duration-250 focus:outline focus:outline-2 focus:outline-red-500"
                            >
                                <div>
                                    <div className="h-16 w-16 bg-red-50 dark:bg-red-800/20 flex items-center justify-center rounded-full">
                                    <img src="/assets/AxoloteCool.gif" alt="Mi Logo" />
                                    </div>

                                    <h2 className="mt-6 text-xl font-semibold text-gray-900 dark:text-white">
                                        Documentation
                                    </h2>

                                    <p className="mt-4 text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                                        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quisquam quae ullam deserunt tenetur amet nulla eaque rem quidem, dignissimos commodi molestiae deleniti .
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
            
{/* Division de cuadros */}


        </AuthenticatedLayout>
    );
}
