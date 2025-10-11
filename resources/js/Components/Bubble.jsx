function Bubble({ name = "Tanque" }) {
    wIdth: 150;
    height: 150;
    return (

        <div className="relative w-40 h-auto flex flex-col items-center">
            <div className="relative w-32 h-32 flex items-center justify-center">
                <div className="absolute rounded-full w-36 h-36 bg-[rgb(144,225,203)] shadow-lg"></div>
                <svg
                    className="absolute"
                    style={{
                        right: "15px",
                        top: "27px",
                        transform: "rotate(-28deg)",
                        zIndex: 10,
                    }}
                    width="37"
                    height="70"
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
                            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>
                </svg>
            </div>
            {/* Nombre del tanque debajo del bubble */}
            <div className="text-center w-full" style={{ marginTop: '5px' }}>
                <span className="text-lg font-semibold text-gray-700">
                    {name}
                </span>
            </div>
        </div>
    );
}

export default Bubble;
