import React from 'react';
import { Document, Image,Page, Text, View, StyleSheet, PDFViewer } from '@react-pdf/renderer';
import CCGDL from './assets_pdf/CCGDL.png';
import MIT_ML from './assets_pdf/MIT_ML.png';
import NubesLogo from './assets_pdf/NubesLogo.png';
import Axol_logo from './assets_pdf/Axol_pdf.png';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#E4E4E4',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Separa izquierda y derecha
    alignItems: 'center',
    marginBottom: 10,
  },
  leftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 60,
    height: 40,
    marginRight: 10,
  },
  rightImage: {
    width: 60,
    height: 40,
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
  },
  content: {
    fontSize: 12,
    lineHeight: 1.5,
  },
  campoTexto: {
    backgroundColor: '#D3D3D3', // Fondo gris
    padding: 5,
    borderRadius: 8, // Bordes redondeados
    marginBottom: 5,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 8,
    flexWrap: 'wrap', // Por si el espacio horizontal se llena
  },
  box: {
    flexDirection: 'row',
    backgroundColor: '#D3D3D3',
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 6,
    marginRight: 10,
    marginBottom: 5,
  },
  label: {
    fontWeight: 'bold',
    marginRight: 4,
    fontSize: 10,
  },
  value: {
    fontSize: 10,
  },
  separator: {
    height: 1,
    backgroundColor: '#000', // Color negro (se puede cambiar al azul como en el slack)
    marginVertical: 10, // Espacio arriba y abajo de la línea
  },
});

const PDF = () => (
        <Document>
            <Page size="A4" style={styles.page}>
            <View style={styles.header}>
                {/* Grupo izquierdo: 3 imágenes */}
                <View style={styles.leftGroup}>
                    <Image src={CCGDL} style={styles.image} />
                    <Image src={MIT_ML} style={styles.image} />
                    <Image src={NubesLogo} style={styles.image} />
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
                    <Text style={styles.value}>homehub name</Text>
                    </View>
                    <View style={styles.box}>
                    <Text style={styles.label}>Fecha:</Text>
                    <Text style={styles.value}>fecha de inicio - fecha fin</Text>
                    </View>
                </View>

                {/* Fila 2 */}
                <View style={styles.row}>
                    <View style={styles.box}>
                    <Text style={styles.label}># de tanques:</Text>
                    <Text style={styles.value}>tanques totales</Text>
                    </View>
                    <View style={styles.box}>
                    <Text style={styles.label}>Consumo Total:</Text>
                    <Text style={styles.value}>consumo en Litros</Text>
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
                    <Text style={styles.value}>almacenamiento en Litros</Text>
                    </View>
                </View>

                <View style={styles.separator} />


            </Page>
        </Document>
    )

export default PDF;
