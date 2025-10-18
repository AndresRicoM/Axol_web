function Bubble({ name = "Tanque", tds = 0, size = 100 }) {
    // Función para obtener la calidad y color
    const getQualityLevel = (value) => {
        if (value <= 50) return { text: "Buena", color: "#00E396" };
        if (value <= 900) return { text: "Regular", color: "#FEB019" };
        return { text: "Mala", color: "#FF4560" };
    };

    const quality = getQualityLevel(tds);

    // Clase para el color de la burbuja
    const color = (quality) => {
        if (quality === "Mala") return "bg-[#FF4560] text-white";
        if (quality === "Regular") return "bg-[#FEB019] text-black";
        return "bg-[#00E396] text-black"; // Buena
    };

    return (
        <div className="flex flex-col items-center" style={{ width: size }}>
            <div
                className="relative flex items-center justify-center"
                style={{ width: size, height: size }}
            >
                <div
                    className={`absolute rounded-full shadow-lg ${color(
                        quality.text
                    )}`}
                    style={{ width: size * 0.9, height: size * 0.9 }}
                ></div>
                <svg
                    className="absolute"
                    style={{
                        right: size * 0.18 + "px",
                        top: size * 0.13 + "px",
                        transform: "rotate(-28deg)",
                        zIndex: 10,
                    }}
                    width={size * 0.28}
                    height={size * 0.38}
                    viewBox="0 0 44 82"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M20 8 Q15 45 25 40 Q29 -5 19 18"
                        stroke="white"
                        strokeWidth="10"
                        strokeLinecap="round"
                        fill="none"
                        opacity="0.7"
                        filter="url(#glow)"
                    />
                    <path
                        d="M13 68 Q15 78 29 78 Q31 68 22 66 Q15 66 13 68 Z"
                        fill="white"
                        opacity="0.85"
                        filter="url(#glow)"
                    />
                    <defs>
                        <filter
                            id="glow"
                            x="-10"
                            y="-10"
                            width="64"
                            height="112"
                            filterUnits="userSpaceOnUse"
                        >
                            <feGaussianBlur
                                stdDeviation="4"
                                result="coloredBlur"
                            />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>
                </svg>
                {/* TDS en el centro de la burbuja */}
                <span
                    className="absolute text-white font-bold"
                    style={{
                        fontSize: size < 60 ? "0.7rem" : "1.1rem",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        pointerEvents: "none",
                        textShadow: "0 1px 4px #0008",
                    }}
                >
                    {tds ? `${tds} PPM` : ""}
                </span>
            </div>
            {/* Nombre debajo */}
            <div
                className="text-center w-full"
                style={{
                    marginTop: "12px",
                    fontSize: size < 60 ? "0.75rem" : "1.125rem",
                    maxWidth: size * 1.1,
                    lineHeight: 1.1,
                    wordBreak: "break-word",
                    whiteSpace: "normal",
                    marginLeft: "auto",
                    marginRight: "auto",
                }}
            >
                <span className="text-base font-semibold text-gray-700 break-words">
                    {name}
                </span>
            </div>
        </div>
    );
}

export default Bubble;
