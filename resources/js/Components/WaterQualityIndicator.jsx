import React from 'react';

export default function WaterQualityIndicator({ tds }) {
    const getQualityLevel = (value) => {
        if (value <= 50) return { text: "Buena", color: "#00E396" };
        if (value <= 600) return { text: "Regular", color: "#FEB019" };
        return { text: "Mala", color: "#FF4560" };
    };

    const quality = getQualityLevel(tds);

    return (
        <div className="flex flex-col gap-4 p-4 pt-20">
            <div className="flex items-center gap-4">
                <span className="text-xl font-bold" style={{ color: quality.color }}>{tds} PPM</span>
            </div>

            {/* Barra de calidad */}
            <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden">
                <div className="absolute top-0 left-0 h-full w-full flex">
                    <div className="h-full bg-[#00E396] flex-1" /> {/* Buena */}
                    <div className="h-full bg-[#FEB019] flex-1" /> {/* Regular */}
                    <div className="h-full bg-[#FF4560] flex-1" /> {/* Mala */}
                </div>
                {/* Indicador de nivel actual */}
                <div 
                    className="absolute top-0 h-full w-2 bg-white border-2 border-gray-800 rounded-full"
                    style={{ 
                        left: `${Math.min((tds / 1000) * 100, 100)}%`,
                        transform: 'translateX(-50%)'
                    }}
                />
            </div>

            {/* Etiquetas */}
            <div className="flex justify-between text-sm">
                <span className="text-[#00E396]">Buena</span>
                <span className="text-[#FEB019]">Regular</span>
                <span className="text-[#FF4560]">Mala</span>
            </div>
        </div>
    );
} 