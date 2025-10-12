import React, { useEffect, useState } from "react";
import BubbleModal from "@/Components/BubbleModal";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Rive from "rive-react";

export default function Community({ auth, datosComunidad, tanques = [] }) {
    const calculateRadialPosition = (index, totalBubbles) => {
        // Configuración del posicionamiento radial
        const BUBBLE_DIAMETER = 160; // Diámetro de la burbuja en px (w-40 = 160px)
        const RIVE_SAFE_RADIUS = 300; // Radio de la zona segura del componente Rive (aumentado considerablemente)
        const MIN_RADIUS = RIVE_SAFE_RADIUS + BUBBLE_DIAMETER / 2 + 60; // Radio mínimo mucho mayor + margen amplio
        const MAX_RADIUS = MIN_RADIUS + 100; // Radio máximo con buena variación
        const CONTAINER_CENTER_X = 50; // Centro del contenedor en porcentaje
        const CONTAINER_CENTER_Y = 50; // Centro del contenedor en porcentaje

        // Calcular ángulo base dividiendo 360° entre el número de burbujas
        const baseAngle = (360 / totalBubbles) * index;

        // Añadir variación aleatoria al ángulo (±12°) para naturalidad
        const angleVariation = (Math.random() - 0.5) * 24;
        const finalAngle = baseAngle + angleVariation;

        // Radio aleatorio entre MIN_RADIUS y MAX_RADIUS
        const radius = MIN_RADIUS + Math.random() * (MAX_RADIUS - MIN_RADIUS);

        // Convertir coordenadas polares a cartesianas
        const angleInRadians = (finalAngle * Math.PI) / 180;
        const deltaX = radius * Math.cos(angleInRadians);
        const deltaY = radius * Math.sin(angleInRadians);

        // Convertir píxeles a porcentajes - ajustado para el radio mayor
        const xPercent = CONTAINER_CENTER_X + deltaX / 20; // Factor ajustado para radio mayor
        const yPercent = CONTAINER_CENTER_Y + deltaY / 15; // Factor ajustado para radio mayor

        // Límites para mantener burbujas en área visible pero con más espacio
        const clampedX = Math.max(8, Math.min(92, xPercent)); // Márgenes más amplios 8% - 92%
        const clampedY = Math.max(10, Math.min(90, yPercent)); // Márgenes más amplios 10% - 90%

        // Retornar estilo inline para posición precisa y coordenadas para el popover
        return {
            style: {
                position: "absolute",
                left: `${clampedX}%`,
                top: `${clampedY}%`,
                transform: "translate(-50%, -50%)",
                zIndex: 10,
            },
            position: { x: clampedX, y: clampedY },
        };
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
        level: item.water_level_percentage || null, // Nivel del tanque
        currentWater: item.current_water || null, // Volumen actual de agua
    }));

    // Función para calcular el estado de salud del tanque
    const calculateTankHealth = (tds, currentWater, waterLevel) => {
        if (!tds || !currentWater || !waterLevel) return null;

        // Aplicar la fórmula: (1 - tds/currentWater) * water_level_percentage
        const healthScore = (1 - tds / currentWater) * waterLevel;
        return Math.max(0, Math.min(100, healthScore)); // Limitar entre 0 y 100
    };

    // Calcular el estado promedio de todos los tanques
    const calculateCommunityHealth = () => {
        const validTanks = bubbleData.filter(
            (tank) => tank.tds && tank.currentWater && tank.level
        );

        if (validTanks.length === 0)
            return { averageHealth: 50, titoState: "normal" };

        const totalHealth = validTanks.reduce((sum, tank) => {
            const health = calculateTankHealth(
                tank.tds,
                tank.currentWater,
                tank.level
            );
            return sum + (health || 0);
        }, 0);

        const averageHealth = totalHealth / validTanks.length;

        // Determinar el estado de TITO basado en el promedio
        let titoState = "normal";
        if (averageHealth < 30) {
            titoState = "triste"; // Muy bajo
        } else if (averageHealth < 60) {
            titoState = "enfermo"; // Medio-bajo
        } else {
            titoState = "normal"; // Normal-alto
        }

        return { averageHealth, titoState, totalTanks: validTanks.length };
    };

    const { averageHealth, titoState, totalTanks } = calculateCommunityHealth();

    // Seleccionar el archivo Rive apropiado
    const getRiveFile = (state) => {
        switch (state) {
            case "triste":
                return "/assets/TITO_TRISTE_ALLBODY.riv";
            case "enfermo":
                return "/assets/TITO_ENFERMO_ALLBODY.riv";
            case "normal":
            default:
                return "/assets/TITO_ALLBODY.riv";
        }
    };

    console.log(datosComunidad);
    console.log(
        `Estado de la comunidad: ${titoState}, Salud promedio: ${averageHealth.toFixed(
            1
        )}%, Tanques: ${totalTanks}`
    );

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
                    {/* Componente Principal - Centro con estado dinámico */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Rive
                            src={getRiveFile(titoState)}
                            style={{ width: 300, height: 300 }}
                            autoplay
                        />
                    </div>

                    {/* Burbujas dinámicas con posicionamiento radial */}
                    {bubbleData.map((bubble, index) => {
                        const { style, position } = calculateRadialPosition(
                            index,
                            bubbleData.length
                        );
                        return (
                            <div key={bubble.id} style={style}>
                                <BubbleModal
                                    name={bubble.name}
                                    tds={bubble.tds}
                                    level={bubble.level}
                                    position={position}
                                    size={bubbleSizes[index]}
                                />
                            </div>
                        );
                    })}
                </div>
            </AuthenticatedLayout>
        </>
    );
}
