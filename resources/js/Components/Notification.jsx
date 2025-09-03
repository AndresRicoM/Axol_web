import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import { Popover } from "@headlessui/react";
import DateFormat from "./DateFormat";
import { useEffect } from "react";

export default function Notification({ type, sensor }) {
    const [alertMessage, setAlertMessage] = useState(null);

    const isOutdated = (dateLog) => {
        if (!dateLog) {
            return false; // Devuelve false si dateLog es null o undefined
        }
        return Date.now() - new Date(dateLog) > 3 * 86400000;
    };

    const outdatedMessage = () => {
        return (
            <p>
                Los datos registrados no son recientes, revisa
                el homehub.
                <br />
                <br />
                Último dato recibido:
                <br />
                <DateFormat datetime={sensor.datetime} />
            </p>
        );
    }

    const humidityMessage = () => {
        return (
            <p>
                La humedad del sensor es mayor a 100, revisa el sensor.
                <br />
                <br />
                Último dato de humedad: {sensor?.humidity}
                
            </p>
        );
    }

    useEffect(() => {
        switch (type) {
            case "outdated":
                if (isOutdated(sensor?.datetime)) {
                    const message = outdatedMessage();
                    setAlertMessage(message);
                }

                break

            case "humidity":
                if (sensor?.humidity > 100) {
                    const message = humidityMessage();
                    setAlertMessage(message);
                }

                break;
        }
    }, [])


    if (alertMessage) {
        return (
            <div className="relative inline-block">
                <Popover className="relative">
                    <Popover.Button className="focus:outline-none transition-transform duration-200 hover:scale-150 outline-none">
                        <FontAwesomeIcon
                            icon={faBell}
                            className="cursor-pointer text-blue-600 hover:text-blue-700"
                        />
                    </Popover.Button>

                    <Popover.Panel className="absolute z-10 -right-4 top-9 mr-2 w-44 text-sm text-gray-500 transition-opacity duration-300 bg-white border border-gray-200 rounded-lg shadow-xs opacity-100 dark:text-gray-400 dark:border-gray-600 dark:bg-gray-800 xl:w-64">
                        <div className="px-3 py-2 bg-gray-100 border-b border-gray-200 rounded-t-lg dark:border-gray-600 dark:bg-gray-700">
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                                Alerta
                            </h3>
                        </div>
                        <div className="px-3 py-2">
                            {/* Mensaje de alerta */}
                            {alertMessage}
                        </div>
                        <div className="absolute w-3 h-3 bg-white border-gray-200 rotate-45 -top-1 right-3 dark:bg-gray-700"></div>
                    </Popover.Panel>
                </Popover>
            </div>
        );
    }

    return null;
}
