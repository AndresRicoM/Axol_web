import React from 'react';

export default function TankLevelIndicator({ level }) {
    const getLevelStatus = (value) => {
        if (value <= 30) return { text: "Bajo", color: "#FF4560" };
        if (value <= 50) return { text: "Medio", color: "#FEB019" };
        return { text: "Alto", color: "#00E396" };
    };

    const status = getLevelStatus(level);

    const calculateLeftPosition = (value) => {
        // Convertir el porcentaje (0-100) a posición en la barra (0-100%)
        return Math.min(Math.max(value, 0), 100);
    };

    return (
        <div className="flex flex-col gap-4 p-2">
            <div className="flex items-center gap-4">
                <span className="text-lg font-bold" style={{ color: status.color }}>{level}%</span>
            </div>

            {/* Barra de nivel */}
            <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden">
                <div className="absolute top-0 left-0 h-full w-full flex">
                    <div className="h-full bg-[#FF4560] flex-1" /> {/* Bajo */}
                    <div className="h-full bg-[#FEB019] flex-1" /> {/* Medio */}
                    <div className="h-full bg-[#00E396] flex-1" /> {/* Alto */}
                </div>
                {/* Indicador de nivel actual */}
                <div
                    className="absolute top-0 h-full w-2 bg-white border-2 border-gray-800 rounded-full"
                    style={{
                        left: `${calculateLeftPosition(level)}%`,
                        transform: 'translateX(-50%)'
                    }}
                />
            </div>

            {/* Etiquetas */}
            <div className="flex justify-between text-sm">
                <span className="text-[#FF4560]">30%</span>
                <span className="text-[#FEB019]">50%</span>
                <span className="text-[#00E396]">100%</span>
            </div>
        </div>
    );
} 