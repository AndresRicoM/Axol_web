function Bubbles() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <div className="relative w-48 h-48">
                <div className="absolute rounded-full w-48 h-48 bg-[rgb(144,225,203)] shadow-lg"></div>
                <svg
                    className="absolute"
                    style={{
                        right: "18px",
                        top: "32px",
                        transform: "rotate(-28deg)",
                        zIndex: 10,
                    }}
                    width="44"
                    height="82"
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
            </div>
        </div>
    );
}

export default Bubbles;
