import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { Popover } from "@headlessui/react";
import Bubble from "./Bubble";

export default function BubbleModal({ name }) {
    return (
        <div className="relative inline-block">
            <Popover className="relative">
                <Popover.Button className="focus:outline-none outline-none">
                    <Bubble name={name}></Bubble>
                </Popover.Button>

                <Popover.Panel className="absolute z-10 -right-12 top-9 mr-2 w-44 text-sm transition-opacity duration-300 rounded-lg shadow-xs opacity-100 xl:w-64">
                    <div className="px-3 py-2 border border-b rounded-t-lg bg-[#EDEDED]">
                        <h3 className="font-semibold text-black">{name}</h3>
                    </div>
                    <div className="px-3 py-2 border border-b rounded-b-lg roundedtext-[#954747] bg-[#f2d1d9] text-[#954747] font-bold">
                        <p>Ver más</p>
                        <FontAwesomeIcon icon={faArrowRight} />
                    </div>
                    <div className="absolute w-3 h-3 bg-[#EDEDED] rotate-45 -top-1 right-3"></div>
                </Popover.Panel>
            </Popover>
        </div>
    );
}
