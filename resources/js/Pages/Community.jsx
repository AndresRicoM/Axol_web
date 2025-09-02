import BubbleModal from "@/Components/BubbleModal";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Rive from "rive-react";

export default function Community({ auth, user, tanques = [] }) {
    const calculateBubblePosition = (index, totalBubbles) => {
        if (index <= 2) {
            // 3 burbujas arriba
            if (index === 0) return "absolute top-5 left-1/4 -translate-x-1/2";
            if (index === 1) return "absolute top-5 left-1/2 -translate-x-1/2";
            if (index === 2) return "absolute top-5 right-1/4 translate-x-1/2";
        } else if (index <= 4) {
            // 2 burbujas izquierda
            const leftIndex = index - 3;
            if (leftIndex === 0) return "absolute top-1/3 left-16 -translate-y-1/2";
            if (leftIndex === 1) return "absolute bottom-1/3 left-16 translate-y-1/2";
        } else if (index <= 7) {
            // 3 burbujas abajo
            const bottomIndex = index - 5;
            if (bottomIndex === 0) return "absolute bottom-5 left-1/4 -translate-x-1/2";
            if (bottomIndex === 1) return "absolute bottom-5 left-1/2 -translate-x-1/2";
            if (bottomIndex === 2) return "absolute bottom-5 right-1/4 translate-x-1/2";
        } else if (index <= 9) {
            // 2 burbujas derecha
            const rightIndex = index - 8;
            if (rightIndex === 0) return "absolute top-1/3 right-16 -translate-y-1/2";
            if (rightIndex === 1) return "absolute bottom-1/3 right-16 translate-y-1/2";
        }
        
        // Posición de fallback si hay más de 10 burbujas
        return "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2";
    };

    // Datos dinámicos con fallback a ejemplo
    const bubbleData = tanques.length > 0 ? tanques : [
        { name: "Tanque 1" },
        { name: "Tanque 2" },
        { name: "Tanque 3" },
        { name: "Tanque 4" },
        { name: "Tanque 5" },
        { name: "Tanque 6" },
        { name: "Tanque 7" },
        { name: "Tanque 8" },
        { name: "Tanque 9" },
        { name: "Tanque 10" },
    ];

    return (
        <>
            <AuthenticatedLayout user={auth.user}>
                <div 
                    className="relative min-h-screen w-full py-20 px-20"
                    style={{ marginTop: '35px', marginBottom: '35px' }}
                >
                    {/* Componente Principal - Centro */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Rive
                            src="/assets/TITO_ALLBODY.riv"
                            style={{ width: 300, height: 300 }}
                            autoplay
                        />
                    </div>

                    {/* Burbujas dinámicas distribuidas: 3 arriba, 2 lados, 3 abajo */}
                    {bubbleData.slice(0, 10).map((bubble, index) => (
                        <div
                            key={bubble.id || `bubble-${index}`}
                            className={calculateBubblePosition(index, bubbleData.length)}
                        >
                            <BubbleModal name={bubble.name} />
                        </div>
                    ))}
                </div>
            </AuthenticatedLayout>
        </>
    );
}
