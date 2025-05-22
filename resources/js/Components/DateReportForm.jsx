import React, { useState } from 'react';
import PDF from "@/Components/PDF";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileArrowDown } from "@fortawesome/free-solid-svg-icons";

const DateReportForm = ({ onSubmit, currentHomehub, chartImage, qualityChartImage}) => {
    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, setFechaFin] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ fechaInicio, fechaFin });
    };

    console.log("Props recibidos:", currentHomehub, chartImage);
    console.log("chartImage:", chartImage);

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="bg-gray-100 p-8 rounded-lg w-[400px] mx-auto shadow">
            <h2 className="text-2xl font-bold mb-6 text-center">Ingresa la fecha que deseas consultar</h2>

            <label className="block mb-2 font-medium">Fecha de inicio:</label>
            <input type="date" 
                    value={fechaInicio}
                    onChange={(e) => setFechaInicio(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md mb-4" />

            <label className="block mb-2 font-medium">Fecha de fin:</label>
            <input type="date" 
                    value={fechaFin}
                    onChange={(e) => setFechaFin(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md mb-6" />


            
            {fechaInicio && fechaFin && currentHomehub && (
                <PDFDownloadLink
                    document={
                        <PDF
                            data={currentHomehub}
                            graficaUrl={chartImage}
                            qualityChartUrl={qualityChartImage}
                            fechaInicio={fechaInicio}
                            fechaFin={fechaFin}
                        />
                    }
                    fileName="Axol_Report.pdf"
                >
                    {({ loading }) =>
                    loading ? (
                        <span className="bg-white hover:bg-gray-50 text-gray-800 flex items-center gap-2 shadow-sm h-[50px] px-4 rounded-lg w-full mt-4">
                        <FontAwesomeIcon icon={faFileArrowDown} className="h-4 w-4" />
                        Cargando Reporte...
                        </span>
                    ) : (
                        <span className="bg-black hover:bg-gray-800 text-white flex items-center justify-center gap-2 shadow-sm h-[50px] px-4 rounded-full w-full mt-4 font-bold">
                        <FontAwesomeIcon icon={faFileArrowDown} className="h-4 w-4" />
                        Descargar Reporte
                        </span>
                    )
                    }
                </PDFDownloadLink>
                )}
        </div>
           
    </form>
  );
};

export default DateReportForm;