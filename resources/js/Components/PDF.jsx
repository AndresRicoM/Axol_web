import React from "react";
import {
    Document,
    Image,
    Page,
    Text,
    View,
    StyleSheet,
    PDFViewer,
} from "@react-pdf/renderer";
import CCGDL from "./assets_pdf/CCGDL.png";
import MIT_ML from "./assets_pdf/MIT_ML.png";
import NubesLogo from "./assets_pdf/NubesLogo.png";
import Axol_logo from "./assets_pdf/Axol_pdf.png";

const styles = StyleSheet.create({
    page: {
        flexDirection: "column",
        backgroundColor: "#FFFFFF",
        padding: 20,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between", // Separa izquierda y derecha
        alignItems: "center",
        marginBottom: 10,
    },
    leftGroup: {
        flexDirection: "row",
        alignItems: "center",
    },
    image: {
        width: 60,
        height: 40,
        marginRight: 10,
        objectFit: "contain",
    },
    rightImage: {
        width: 50,
        height: 40,
        objectFit: "contain",
    },
    section: {
        margin: 10,
        padding: 10,
        flexGrow: 1,
    },
    title: {
        fontSize: 24,
        textAlign: "center",
        marginBottom: 20,
    },
    content: {
        fontSize: 12,
        lineHeight: 1.5,
    },
    campoTexto: {
        backgroundColor: "#D3D3D3", // Fondo gris
        padding: 5,
        borderRadius: 8, // Bordes redondeados
        marginBottom: 5,
    },
    row: {
        flexDirection: "row",
        marginBottom: 8,
        flexWrap: "wrap", // Por si el espacio horizontal se llena
    },
    box: {
        flexDirection: "row",
        backgroundColor: "#D3D3D3",
        borderRadius: 8,
        paddingVertical: 4,
        paddingHorizontal: 6,
        marginRight: 10,
        marginBottom: 5,
    },
    label: {
        fontWeight: "bold",
        marginRight: 4,
        fontSize: 10,
    },
    value: {
        fontSize: 10,
    },
    separator: {
        height: 1,
        backgroundColor: "#000", // Color negro (se puede cambiar al azul como en el slack)
        marginVertical: 10, // Espacio arriba y abajo de la línea
    },
    grafica: {
        width: 400,
        height: 200,
        marginTop: 20,
    },
});

const PDF = ({
    data,
    fechaInicio,
    fechaFin,
    graficaUrls = [],
    qualityChartUrls = [],
}) => {
    const pdfData = data?.data || {};
    const homehub = pdfData.homehub || {};
    const sensors = Array.isArray(pdfData.sensors) ? pdfData.sensors : [];

    const totalConsumo = sensors.reduce(
        (total, sensor) =>
            total +
            Object.values(sensor.storage.monthly_consumption).reduce(
                (sum, value) => sum + value,
                0
            ),
        0
    );

    const almacenamientoTotal = sensors.reduce(
        (total, sensor) => total + sensor.storage.remaining_liters,
        0
    );

    // Función que devuelve el porcentaje de calidad según ppm
    const getQualityPercentage = (value) => {
        if (value <= 50) {
            return (value / 50) * 33.33; // Buena calidad: hasta 33.33%
        } else if (value <= 899) {
            return 33.33 + ((value - 50) / 849) * 33.33; // Calidad regular: siguiente 33.33%
        } else {
            return 66.66 + ((value - 899) / 101) * 33.33; // Calidad mala: último 33.33%
        }
    };

    // Función para obtener texto y color según ppm
    const getQualityStatus = (ppm) => {
        const percentage = getQualityPercentage(ppm);

        if (percentage <= 33.33) {
            return { text: "Buena", color: "#4caf50" }; // verde
        } else if (percentage <= 66.66) {
            return { text: "Regular", color: "#ffeb3b" }; // amarillo
        } else {
            return { text: "Mala", color: "#f44336" }; // rojo
        }
    };

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.header}>
                    {/* Grupo izquierdo: 3 imágenes */}
                    <View style={styles.leftGroup}>
                        <Image src={MIT_ML} style={styles.image} />
                        <Image src={CCGDL} style={styles.image} />
                        {/* <Image src={NubesLogo} style={styles.image} /> */}
                    </View>

                    {/* Imagen derecha */}
                    <Image src={Axol_logo} style={styles.rightImage} />
                </View>

                <View style={styles.separator} />

                {/* Datos de los tanques y consumo, captura, etc*/}
                {/* Fila 1 */}
                <View style={styles.row}>
                    <View style={styles.box}>
                        <Text style={styles.label}>Reporte:</Text>
                        <Text style={styles.value}>{homehub.name}</Text>
                    </View>
                    <View style={styles.box}>
                        <Text style={styles.label}>Fecha:</Text>
                        <Text style={styles.value}>
                            {fechaInicio} - {fechaFin}
                        </Text>
                    </View>
                </View>

                {/* Fila 2 */}
                <View style={styles.row}>
                    <View style={styles.box}>
                        <Text style={styles.label}># de tanques:</Text>
                        <Text style={styles.value}>
                            {sensors.filter((sensor) => sensor.storage).length}
                        </Text>
                    </View>

                    <View style={styles.box}>
                        <Text style={styles.label}>Consumo total:</Text>
                        <Text style={styles.value}>{totalConsumo} Litros</Text>
                    </View>
                </View>

                {/* Fila 3 */}
                <View style={styles.row}>
                    <View style={styles.box}>
                        <Text style={styles.label}>Captura Total:</Text>
                        <Text style={styles.value}>captura en Litros</Text>
                    </View>
                    <View style={styles.box}>
                        <Text style={styles.label}>Almacenamiento Total:</Text>
                        <Text style={styles.value}>
                            {almacenamientoTotal} Litros
                        </Text>
                    </View>
                </View>

                <View style={styles.separator} />
                {/* Apartado para las analogias */}

                {/* Fila 1 de analogias */}
                <View style={styles.row}>
                    <View style={styles.box}>
                        <Text style={styles.label}>Agua captada: </Text>
                        <Text style={styles.value}> X litros</Text>
                    </View>
                    <View style={styles.box}>
                        <Text style={styles.label}>Equivalente a: </Text>
                        <Text style={styles.value}> X / 20 garrafones</Text>
                    </View>
                </View>

                {/* Fila de analogias 2 */}
                <View style={styles.row}>
                    <View style={styles.box}>
                        <Text style={styles.label}>
                            {" "}
                            Días de consumo familiar promedio:{" "}
                        </Text>
                        <Text style={styles.value}> X / 1,464 días</Text>
                    </View>

                    <View style={styles.box}>
                        <Text style={styles.label}> CO₂ evitado: </Text>
                        <Text style={styles.value}> X × 0.0004 kg</Text>
                    </View>
                </View>

                {/* Fila 3 de analogias*/}
                <View style={styles.row}>
                    <View style={styles.box}>
                        <Text style={styles.label}>Equivalente a: </Text>
                        <Text style={styles.value}>
                            conducir X × 0.0004 / 0.192 km
                        </Text>
                    </View>
                </View>

                <View style={styles.separator} />

                <View style={{ marginTop: 20 }}>
                    {graficaUrls.map((consumoSrc, i) => {
                        const calidadSrc = qualityChartUrls[i];
                        // Extraer el valor ppm (tds) del sensor de calidad correspondiente
                        const ppm =
                            pdfData?.quality_sensors?.[i]?.latest_log?.tds ?? 0;

                        // Función para obtener estado según ppm (puedes usar la función que ya tienes)
                        const qualityStatus = getQualityStatus(ppm);

                        return (
                            <View key={`pair-${i}`}>
                                <View
                                    style={{
                                        flexDirection: "row",
                                        justifyContent: "space-between",
                                        marginBottom: 15,
                                    }}
                                >
                                    {/* Gráfica de consumo */}
                                    <View
                                        style={{
                                            width: "35%",
                                            alignItems: "center",
                                        }}
                                    >
                                        <Text
                                            style={{
                                                fontSize: 12,
                                                marginBottom: 5,
                                            }}
                                        >
                                            Consumo diario {i + 1}
                                        </Text>
                                        <Image
                                            src={consumoSrc}
                                            style={{ width: 180, height: 150 }}
                                        />
                                    </View>

                                    {/* Gráfica de calidad */}
                                    {calidadSrc && (
                                        <View
                                            style={{
                                                width: "35%",
                                                alignItems: "center",
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    fontSize: 12,
                                                    marginBottom: 5,
                                                }}
                                            >
                                                Calidad del Agua {i + 1}
                                            </Text>
                                            <Image
                                                src={calidadSrc}
                                                style={{
                                                    width: 180,
                                                    height: 150,
                                                }}
                                            />
                                        </View>
                                    )}

                                    {/* Estado dinámico */}
                                    <View
                                        style={{
                                            width: "20%",
                                            alignItems: "center",
                                        }}
                                    >
                                        <Text
                                            style={{
                                                fontSize: 12,
                                                marginBottom: 5,
                                                textAlign: "center",
                                            }}
                                        >
                                            Estado de Calidad del Agua:
                                        </Text>
                                        <Image
                                            src={Axol_logo}
                                            style={{
                                                width: 50,
                                                height: 50,
                                                marginBottom: 5,
                                            }}
                                        />
                                        <View
                                            style={{
                                                backgroundColor:
                                                    qualityStatus.color,
                                                paddingVertical: 4,
                                                paddingHorizontal: 8,
                                                borderRadius: 8,
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    color: "white",
                                                    fontWeight: "bold",
                                                    fontSize: 10,
                                                }}
                                            >
                                                {qualityStatus.text}
                                            </Text>
                                        </View>
                                    </View>
                                </View>

                                {/* Separador */}
                                {i < graficaUrls.length - 1 && (
                                    <View
                                        style={{
                                            height: 1,
                                            backgroundColor: "#000",
                                            marginVertical: 10,
                                        }}
                                    />
                                )}
                            </View>
                        );
                    })}
                </View>
            </Page>
        </Document>
    );
};

export default PDF;
