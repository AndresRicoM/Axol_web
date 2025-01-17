import React from 'react';
import ReactApexChart from 'react-apexcharts';

export default function WaterDashboard({ totalMass, totalFill, tankNum, totalVolume }) {
    const chartOptions = {
        series: [totalFill],
        options: {
            chart: {
                height: 350,
                type: 'radialBar',
            },
            plotOptions: {
                radialBar: {
                    hollow: {
                        size: '70%',
                    }
                },
            },
            labels: ['Nivel de Agua'],
            colors: ['#2563eb'], // Color azul
        }
    };

    return (
        <div className="p-6">
            <div className="max-w-7xl mx-auto">
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <div className="p-6">
                        <h2 className="text-2xl font-bold mb-4">
                            Estado del Agua
                        </h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Información del agua */}
                            <div className="space-y-4">
                                <div className="bg-blue-50 p-4 rounded-lg">
                                    <p className="text-lg">
                                        Hay un total de <span className="font-bold">{totalMass}</span> Litros de Agua en la Casa
                                    </p>
                                </div>
                                
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <p>Número de tanques: {tankNum}</p>
                                    <p>Volumen total: {totalVolume} m³</p>
                                </div>
                            </div>

                            {/* Gráfica circular */}
                            <div className="h-[400px]">
                                <ReactApexChart
                                    options={chartOptions.options}
                                    series={chartOptions.series}
                                    type="radialBar"
                                    height={350}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 