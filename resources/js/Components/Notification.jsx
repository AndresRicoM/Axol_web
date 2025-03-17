import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import { Popover } from "@headlessui/react";
import DateFormat from "./DateFormat";

export default function Notification({ flag, datetime }) {
       if (flag) {
        return (
            <div className="relative inline-block">
                <Popover className="relative">
                    <Popover.Button className="focus:outline-none">
                        <FontAwesomeIcon
                            icon={faBell}
                            className="cursor-pointer text-blue-500 hover:text-blue-700"
                        />
                    </Popover.Button>

                    <Popover.Panel className="absolute z-10 right-full top-0 mr-2 w-64 text-sm text-gray-500 transition-opacity duration-300 bg-white border border-gray-200 rounded-lg shadow-xs opacity-100 dark:text-gray-400 dark:border-gray-600 dark:bg-gray-800">
                        <div className="px-3 py-2 bg-gray-100 border-b border-gray-200 rounded-t-lg dark:border-gray-600 dark:bg-gray-700">
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                                Alerta
                            </h3>
                        </div>
                        <div className="px-3 py-2">
                            <p>
                                Los datos registrados no son recientes, revisa
                                el homehub. 
                                <br />
                                <br />
                                Ultimo dato recibido: 
                                <br />
                                <DateFormat datetime={datetime} />
                            </p>
                        </div>
                        <div className="absolute w-3 h-3 bg-white border-gray-200 rotate-45 top-2 -right-1 dark:bg-gray-700"></div>
                    </Popover.Panel>
                </Popover>
            </div>
        );
    }

    return null;
}
