import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { Popover } from "@headlessui/react";
import Bubble from "./Bubble";
import TankLevelIndicator from "./TankLevelIndicator";
import QualityIndicator from "./QualityIndicator";

export default function BubbleModal({ name, tds, level, position = { x: 50, y: 50 } }) {
    // Determinar la dirección del popover basándose en la posición de la burbuja
    const getPopoverPosition = () => {
        const { x, y } = position;
        
        // Definir las clases base del popover
        let positionClasses = "absolute z-10 w-44 text-sm transition-opacity duration-300 rounded-lg shadow-xs opacity-100 xl:w-64";
        let arrowClasses = "absolute w-3 h-3 bg-[#EDEDED] rotate-45";
        
        // Lógica de posicionamiento basada en cuadrantes
        if (y < 30) {
            // Burbuja en la parte superior - popover hacia abajo
            positionClasses += " top-12 left-1/2 -translate-x-1/2";
            arrowClasses += " -top-1 left-1/2 -translate-x-1/2";
        } else if (y > 70) {
            // Burbuja en la parte inferior - popover hacia arriba
            positionClasses += " bottom-12 left-1/2 -translate-x-1/2";
            arrowClasses += " -bottom-1 left-1/2 -translate-x-1/2 rotate-[225deg]";
        } else if (x < 30) {
            // Burbuja en la parte izquierda - popover hacia la derecha
            positionClasses += " left-12 top-1/2 -translate-y-1/2";
            arrowClasses += " -left-1 top-1/2 -translate-y-1/2 rotate-[315deg]";
        } else if (x > 70) {
            // Burbuja en la parte derecha - popover hacia la izquierda
            positionClasses += " right-12 top-1/2 -translate-y-1/2";
            arrowClasses += " -right-1 top-1/2 -translate-y-1/2 rotate-[135deg]";
        } else {
            // Burbuja en el centro - usar posición por defecto (arriba)
            positionClasses += " bottom-12 left-1/2 -translate-x-1/2";
            arrowClasses += " -bottom-1 left-1/2 -translate-x-1/2 rotate-[225deg]";
        }
        
        return { positionClasses, arrowClasses };
    };

    const { positionClasses, arrowClasses } = getPopoverPosition();

    return (
        <div className="relative inline-block">
            <Popover className="relative">
                <Popover.Button className="focus:outline-none outline-none">
                    <Bubble name={name}></Bubble>
                </Popover.Button>

                <Popover.Panel className={positionClasses}>
                    <div className="px-3 py-2 border border-b rounded-t-lg bg-[#EDEDED]">
                        <h3 className="font-semibold text-black">{name}</h3>
                    </div>
                    <div className="px-3 py-2 border border-b rounded-b-lg roundedtext-[#954747] bg-[#f2d1d9] text-[#954747] font-bold">
                        <TankLevelIndicator level={level} />
                        <QualityIndicator tds={tds} />
                        <p>Ver más</p>
                        <FontAwesomeIcon icon={faArrowRight} />
                    </div>
                    <div className={arrowClasses}></div>
                </Popover.Panel>
            </Popover>
        </div>
    );
}
