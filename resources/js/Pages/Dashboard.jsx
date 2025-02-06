import React, { useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Dashboard({ auth, waterData, qualityData, tankData }) {
    useEffect(() => {
        console.log('Water Data:', waterData);
        console.log('Quality Data:', qualityData.mac_add);
        console.log('Quality Data:', qualityData.tds);
        console.log('Tank mac_add:', tankData);
        console.log('Tank Data %:', tankData.fill_percentage);
    }, [waterData, qualityData, tankData]);

    // Función para determinar el color basado en el porcentaje
    const getChartColor = (percentage) => {
        if (percentage <= 25) return '#FF4560';      // Rojo - Nivel crítico
        if (percentage <= 50) return '#FEB019';      // Amarillo - Nivel bajo
        if (percentage <= 75) return '#3CADD4';      // Azul - Nivel normal
        return '#00E396';                           // Verde - Nivel óptimo
    };

    const options = {
        series: [waterData.totalFill],
        chart: {
            height: 300,
            type: 'radialBar',
        },
        colors: [getChartColor(waterData.totalFill)], // Color dinámico
        plotOptions: {
            radialBar: {
                hollow: {
                    size: '70%',
                },
                track: {
                    background: '#f2f2f2',  // Color del fondo de la barra
                },
                dataLabels: {
                    value: {
                        fontSize: '24px',
                        formatter: function(val) {
                            return val + '%';
                        }
                    }
                }
            },
        },
        stroke: {
            lineCap: 'round'
        },
        labels: ['Almacenamiento'],
        tooltip: {
            enabled: true,
            formatter: function(val) {
                return waterData.totalMass + ' Litros';
            }
        }
    };

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
                                    <ReactApexChart
                                        options={options}
                                        series={options.series}
                                        type="radialBar"
                                        height={300}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Mostrar datos de calidad del agua */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
                        <div className="p-6">
                            <h3 className="text-xl font-semibold mb-4">Calidad del Agua</h3>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p>MAC: {qualityData.mac_add}.</p>
                                <p>TDS: {qualityData.tds}.</p>
    
                            </div>
                        </div>
                    </div>

                    {/* Mostrar datos del tanque */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h3 className="text-xl font-semibold mb-4">Nivel del Tanque</h3>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p>MAC: {tankData.mac_add}.</p>
                                <p>Nivel del tanque: {tankData.fill_percentage}%.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </AuthenticatedLayout>
    );
}