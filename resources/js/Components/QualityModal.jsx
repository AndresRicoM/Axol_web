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

            {
                data && (<button
                    className="transition-transform duration-200 hover:scale-150 outline-none p-1 ml-5"
                    onClick={() => handleOpenModal()}
                >
                    <FontAwesomeIcon
                        icon={faMagnifyingGlass}
                        className="cursor-pointer text-blue-600 hover:text-blue-700"
                    />
                </button>)
            }

            <Modal
                title={""}
                open={openModal}
                onOk={() => setOpenModal(false)}
                onCancel={() => setOpenModal(false)}
                cancelButtonProps={{ style: { display: "none" } }}
                width={{
                    xs: "90%",
                    sm: "80%",
                    md: "70%",
                    lg: "60%",
                    xl: "50%",
                    xxl: "40%",
                }}
            >
                <div className="max-h-[80vh] w-3/4 mx-auto">
                    <LineChart data={data} />
                </div>
            </Modal>
        </>
    );
}
