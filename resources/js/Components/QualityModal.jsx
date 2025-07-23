import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { Modal } from "antd";
import LineChart from "./LineChart";

export default function QualityModal({ data }) {
    const [openModal, setOpenModal] = useState(false);

    const handleOpenModal = () => {
        setOpenModal(true);
    };

    return (
        <>
            {data && (
                <button
                    className="transition-transform duration-200 hover:scale-150 outline-none p-1 ml-5"
                    onClick={() => handleOpenModal()}
                >
                    <FontAwesomeIcon
                        icon={faMagnifyingGlass}
                        className="cursor-pointer text-blue-600 hover:text-blue-700"
                    />
                </button>
            )}

            <Modal
                title={""}
                open={openModal}
                onOk={() => setOpenModal(false)}
                onCancel={() => setOpenModal(false)}
                cancelButtonProps={{ style: { display: "none" } }}
                width={{
                    xs: "90%", // Móviles: usa 90% del ancho de la pantalla
                    sm: "80%", // Tablets pequeñas: usa 80% del ancho
                    md: "70%", // Tablets: usa 70% del ancho
                    lg: "70%", // Laptops: usa 60% del ancho
                    xl: "60%", // Monitores: usa 50% del ancho
                    xxl: "50%", // Pantallas grandes: usa 40% del ancho
                }}
            >
                <div className="max-h-[80vh] w-3/4 mx-auto">
                    <LineChart data={data} />
                </div>
            </Modal>
        </>
    );
}
