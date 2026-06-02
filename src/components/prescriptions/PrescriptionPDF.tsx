import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { Prescription } from '@/types';
import { format, parseISO } from 'date-fns';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 11,
    lineHeight: 1.5,
  },
  header: {
    borderBottom: '2px solid #1E40AF',
    paddingBottom: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E40AF',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 10,
    color: '#64748B',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1E40AF',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  label: {
    width: 100,
    color: '#64748B',
    fontSize: 10,
  },
  value: {
    flex: 1,
    fontWeight: 'medium',
  },
  medicationCard: {
    backgroundColor: '#F8FAFC',
    padding: 12,
    marginBottom: 8,
    borderRadius: 4,
    borderLeft: '3px solid #0EA5E9',
  },
  medicationName: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  medicationDetails: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 4,
  },
  medicationDetail: {
    fontSize: 9,
    color: '#64748B',
  },
  instructions: {
    backgroundColor: '#FEF9C3',
    padding: 12,
    borderRadius: 4,
    marginTop: 20,
  },
  instructionsTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#CA8A04',
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    left: 40,
    right: 40,
    borderTop: '1px solid #E2E8F0',
    paddingTop: 10,
  },
  signature: {
    marginTop: 40,
    borderTop: '1px solid #1E40AF',
    width: 200,
    paddingTop: 8,
    textAlign: 'center',
  },
  signatureText: {
    fontSize: 10,
    color: '#64748B',
  },
});

interface PrescriptionPDFProps {
  prescription: Prescription;
}

export const PrescriptionPDF = ({ prescription }: PrescriptionPDFProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>MedBook Pro</Text>
        <Text style={styles.subtitle}>Medical Prescription</Text>
      </View>

      {/* Patient & Doctor Info */}
      <View style={styles.section}>
        <View style={styles.row}>
          <Text style={styles.label}>Patient:</Text>
          <Text style={styles.value}>{prescription.patientName}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Doctor:</Text>
          <Text style={styles.value}>{prescription.doctorName}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Date:</Text>
          <Text style={styles.value}>{format(parseISO(prescription.date), 'MMMM d, yyyy')}</Text>
        </View>
      </View>

      {/* Diagnosis */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Diagnosis</Text>
        <Text>{prescription.diagnosis}</Text>
      </View>

      {/* Medications */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Prescribed Medications</Text>
        {prescription.medications.map((med, index) => (
          <View key={index} style={styles.medicationCard}>
            <Text style={styles.medicationName}>{med.name}</Text>
            <View style={styles.medicationDetails}>
              <Text style={styles.medicationDetail}>Dosage: {med.dosage}</Text>
              <Text style={styles.medicationDetail}>Frequency: {med.frequency}</Text>
              <Text style={styles.medicationDetail}>Duration: {med.duration}</Text>
            </View>
            {med.instructions && (
              <Text style={{ fontSize: 9, fontStyle: 'italic', color: '#64748B' }}>
                {med.instructions}
              </Text>
            )}
          </View>
        ))}
      </View>

      {/* Instructions */}
      {prescription.instructions && (
        <View style={styles.instructions}>
          <Text style={styles.instructionsTitle}>Special Instructions</Text>
          <Text style={{ fontSize: 10 }}>{prescription.instructions}</Text>
        </View>
      )}

      {/* Follow-up */}
      {prescription.followUpDate && (
        <View style={{ marginTop: 20 }}>
          <Text style={{ fontSize: 10, color: '#CA8A04', fontWeight: 'bold' }}>
            Follow-up appointment: {format(parseISO(prescription.followUpDate), 'MMMM d, yyyy')}
          </Text>
        </View>
      )}

      {/* Signature */}
      <View style={styles.signature}>
        <Text style={styles.signatureText}>{prescription.doctorName}</Text>
        <Text style={[styles.signatureText, { fontSize: 8 }]}>Licensed Medical Practitioner</Text>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={{ fontSize: 8, color: '#94A3B8', textAlign: 'center' }}>
          This prescription was generated by MedBook Pro • For medical use only • 
          Please consult your healthcare provider for any concerns
        </Text>
      </View>
    </Page>
  </Document>
);
