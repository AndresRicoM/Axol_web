import React, { useEffect, useState } from "react";
import BubbleModal from "@/Components/BubbleModal";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Rive from "rive-react";

export default function Community({ auth, datosComunidad, tanques = [] }) {
    const [riveKey, setRiveKey] = useState(0);
    useEffect(() => {
        const handleVisibility = () => {
            if (document.visibilityState === "visible") {
                setRiveKey((k) => k + 1); // Fuerza remount del Rive
            }
        };

        document.addEventListener("visibilitychange", handleVisibility);
        return () => {
            document.removeEventListener("visibilitychange", handleVisibility);
        };
    }, []);

    const calculateBubblePosition = (index, totalBubbles) => {
        if (index <= 2) {
            // 3 burbujas arriba
            if (index === 0) return "absolute top-5 left-1/4 -translate-x-1/2";
            if (index === 1) return "absolute top-5 left-1/2 -translate-x-1/2";
            if (index === 2) return "absolute top-5 right-1/4 translate-x-1/2";
        } else if (index <= 4) {
            // 2 burbujas izquierda
            const leftIndex = index - 3;
            if (leftIndex === 0)
                return "absolute top-1/3 left-16 -translate-y-1/2";
            if (leftIndex === 1)
                return "absolute bottom-1/3 left-16 translate-y-1/2";
        } else if (index <= 7) {
            // 3 burbujas abajo
            const bottomIndex = index - 5;
            if (bottomIndex === 0)
                return "absolute bottom-5 left-1/4 -translate-x-1/2";
            if (bottomIndex === 1)
                return "absolute bottom-5 left-1/2 -translate-x-1/2";
            if (bottomIndex === 2)
                return "absolute bottom-5 right-1/4 translate-x-1/2";
        } else if (index <= 9) {
            // 2 burbujas derecha
            const rightIndex = index - 8;
            if (rightIndex === 0)
                return "absolute top-1/3 right-16 -translate-y-1/2";
            if (rightIndex === 1)
                return "absolute bottom-1/3 right-16 translate-y-1/2";
        }

        // Posición de fallback si hay más de 10 burbujas
        return "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2";
    };

    const bubbleData = datosComunidad.map((item, index) => ({
        id: item.mac_add || index, // Id unico para la key
        name: item.use || "Sin nombre", // Mostrar el nombre del homehub
        tds: item.tds || 0,
        litros: item.tank_capacity
            ? Number(item.tank_capacity)
            : item.tds
            ? 1000
            : null,
    }));

    const litrosArray = bubbleData.map((b) => b.litros);
    const bubbleSizes = getBubbleSizes(litrosArray);

    console.log(bubbleData);
    console.log("datos: ", datosComunidad);

    function getBubbleSizes(litrosArray, minPixel = 60, maxPixel = 160) {
        const logs = litrosArray.map((l) => Math.log10(l > 0 ? l : 1)); // Evita log(0)
        const minLog = Math.min(...logs);
        const maxLog = Math.max(...logs);
        return logs.map((log) =>
            maxLog === minLog
                ? (maxPixel + minPixel) / 2
                : ((log - minLog) / (maxLog - minLog)) * (maxPixel - minPixel) +
                  minPixel
        );
    }

    return (
        <>
            <AuthenticatedLayout user={auth.user}>
                <div
                    className="relative min-h-screen w-full py-20 px-20"
                    style={{ marginTop: "35px", marginBottom: "35px" }}
                >
                    {/* Componente Principal - Centro */}
                    <div className="absolute inset-0 flex items-center justify-center z-20">
                        <Rive
                            key={riveKey}
                            src="/assets/TITO_FELIZ_ALLBODY.riv"
                            style={{ width: 300, height: 300 }}
                            autoplay
                        />
                    </div>

                    {/* Burbujas dinámicas distribuidas: 3 arriba, 2 lados, 3 abajo */}
                    {bubbleData.slice(0, 10).map((bubble, index) => (
                        <div
                            key={bubble.id}
                            className={
                                calculateBubblePosition(
                                    index,
                                    bubbleData.length
                                ) + " z-10"
                            }
                        >
                            <BubbleModal
                                name={bubble.name}
                                tds={bubble.tds}
                                size={bubbleSizes[index]}
                            />
                        </div>
                    ))}
                </div>
            </AuthenticatedLayout>
        </>
    );
}
