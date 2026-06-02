import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger 
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { prescriptions } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { format, parseISO } from 'date-fns';
import { toast } from 'sonner';
import { 
  FileText, 
  Plus, 
  Download, 
  Printer,
  Calendar,
  User,
  Pill,
  Clock,
  AlertCircle,
  Trash2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Prescription, Medication } from '@/types';
import { PrescriptionPDF } from '@/components/prescriptions/PrescriptionPDF';
import { pdf } from '@react-pdf/renderer';

const Prescriptions = () => {
  const { user } = useAuth();
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newPrescription, setNewPrescription] = useState({
    patientName: '',
    diagnosis: '',
    instructions: '',
    medications: [{ name: '', dosage: '', frequency: '', duration: '', instructions: '' }] as Medication[],
  });

  const userPrescriptions = user?.role === 'doctor'
    ? prescriptions
    : prescriptions.filter(p => p.patientId === '2');

  const handleAddMedication = () => {
    setNewPrescription({
      ...newPrescription,
      medications: [
        ...newPrescription.medications,
        { name: '', dosage: '', frequency: '', duration: '', instructions: '' },
      ],
    });
  };

  const handleRemoveMedication = (index: number) => {
    if (newPrescription.medications.length > 1) {
      setNewPrescription({
        ...newPrescription,
        medications: newPrescription.medications.filter((_, i) => i !== index),
      });
    }
  };

  const handleMedicationChange = (index: number, field: keyof Medication, value: string) => {
    const updated = [...newPrescription.medications];
    updated[index] = { ...updated[index], [field]: value };
    setNewPrescription({ ...newPrescription, medications: updated });
  };

  const handleCreatePrescription = () => {
    toast.success('Prescription created successfully!');
    setIsCreateDialogOpen(false);
    setNewPrescription({
      patientName: '',
      diagnosis: '',
      instructions: '',
      medications: [{ name: '', dosage: '', frequency: '', duration: '', instructions: '' }],
    });
  };

  const handleDownloadPDF = async (prescription: Prescription) => {
    try {
      const blob = await pdf(<PrescriptionPDF prescription={prescription} />).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `prescription-${prescription.id}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
      toast.success('Prescription downloaded!');
    } catch (error) {
      toast.error('Failed to generate PDF');
    }
  };

  const commonMedications = [
    'Ibuprofen', 'Acetaminophen', 'Amoxicillin', 'Metformin', 
    'Lisinopril', 'Atorvastatin', 'Omeprazole', 'Losartan'
  ];

  const frequencies = [
    'Once daily', 'Twice daily', 'Three times daily', 
    'Four times daily', 'Every 6 hours', 'Every 8 hours',
    'As needed', 'Before meals', 'After meals'
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Prescriptions</h1>
            <p className="text-muted-foreground">
              {user?.role === 'doctor' 
                ? 'Create and manage patient prescriptions'
                : 'View your prescription history'}
            </p>
          </div>
          {user?.role === 'doctor' && (
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="hero">
                  <Plus className="h-4 w-4" />
                  New Prescription
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create New Prescription</DialogTitle>
                  <DialogDescription>
                    Fill in the prescription details for your patient
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-6 py-4">
                  {/* Patient Info */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Patient Name</Label>
                      <Input
                        placeholder="Enter patient name"
                        value={newPrescription.patientName}
                        onChange={(e) => setNewPrescription({ ...newPrescription, patientName: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Diagnosis</Label>
                      <Input
                        placeholder="Enter diagnosis"
                        value={newPrescription.diagnosis}
                        onChange={(e) => setNewPrescription({ ...newPrescription, diagnosis: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* Medications */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-base font-semibold">Medications</Label>
                      <Button variant="outline" size="sm" onClick={handleAddMedication}>
                        <Plus className="h-4 w-4 mr-1" />
                        Add Medication
                      </Button>
                    </div>
                    {newPrescription.medications.map((med, index) => (
                      <Card key={index} className="border-border/50">
                        <CardContent className="pt-4 space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-muted-foreground">
                              Medication {index + 1}
                            </span>
                            {newPrescription.medications.length > 1 && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveMedication(index)}
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Medication Name</Label>
                              <Select
                                value={med.name}
                                onValueChange={(v) => handleMedicationChange(index, 'name', v)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select medication" />
                                </SelectTrigger>
                                <SelectContent>
                                  {commonMedications.map((m) => (
                                    <SelectItem key={m} value={m}>{m}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label>Dosage</Label>
                              <Input
                                placeholder="e.g., 500mg"
                                value={med.dosage}
                                onChange={(e) => handleMedicationChange(index, 'dosage', e.target.value)}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Frequency</Label>
                              <Select
                                value={med.frequency}
                                onValueChange={(v) => handleMedicationChange(index, 'frequency', v)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select frequency" />
                                </SelectTrigger>
                                <SelectContent>
                                  {frequencies.map((f) => (
                                    <SelectItem key={f} value={f}>{f}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label>Duration</Label>
                              <Input
                                placeholder="e.g., 7 days"
                                value={med.duration}
                                onChange={(e) => handleMedicationChange(index, 'duration', e.target.value)}
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label>Special Instructions</Label>
                            <Input
                              placeholder="e.g., Take with food"
                              value={med.instructions || ''}
                              onChange={(e) => handleMedicationChange(index, 'instructions', e.target.value)}
                            />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Instructions */}
                  <div className="space-y-2">
                    <Label>Additional Instructions</Label>
                    <Textarea
                      placeholder="Any additional notes or instructions for the patient..."
                      value={newPrescription.instructions}
                      onChange={(e) => setNewPrescription({ ...newPrescription, instructions: e.target.value })}
                      rows={3}
                    />
                  </div>

                  <Button variant="hero" className="w-full" onClick={handleCreatePrescription}>
                    Create Prescription
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Prescriptions List */}
        <div className="grid gap-4">
          {userPrescriptions.length === 0 ? (
            <Card className="border-border/50">
              <CardContent className="py-12 text-center">
                <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                <p className="text-muted-foreground">No prescriptions found</p>
              </CardContent>
            </Card>
          ) : (
            userPrescriptions.map((prescription, index) => (
              <Card 
                key={prescription.id}
                className="border-border/50 hover:shadow-card transition-all cursor-pointer animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => setSelectedPrescription(prescription)}
              >
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <FileText className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold text-foreground">
                            {user?.role === 'doctor' ? prescription.patientName : prescription.doctorName}
                          </p>
                          <Badge variant="secondary" className="text-xs">
                            {prescription.medications.length} medication{prescription.medications.length > 1 ? 's' : ''}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{prescription.diagnosis}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" />
                            {format(parseISO(prescription.date), 'MMM d, yyyy')}
                          </span>
                          {prescription.followUpDate && (
                            <span className="flex items-center gap-1 text-warning">
                              <AlertCircle className="h-3.5 w-3.5" />
                              Follow-up: {format(parseISO(prescription.followUpDate), 'MMM d')}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownloadPDF(prescription);
                        }}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        PDF
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Printer className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Prescription Detail Dialog */}
        <Dialog open={!!selectedPrescription} onOpenChange={() => setSelectedPrescription(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Prescription Details
              </DialogTitle>
              <DialogDescription>
                {selectedPrescription && format(parseISO(selectedPrescription.date), 'MMMM d, yyyy')}
              </DialogDescription>
            </DialogHeader>
            
            {selectedPrescription && (
              <div className="space-y-6">
                {/* Header Info */}
                <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-muted/50">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Patient</p>
                    <p className="font-medium text-foreground">{selectedPrescription.patientName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Doctor</p>
                    <p className="font-medium text-foreground">{selectedPrescription.doctorName}</p>
                  </div>
                </div>

                {/* Diagnosis */}
                <div>
                  <p className="text-sm font-medium text-foreground mb-1">Diagnosis</p>
                  <p className="text-sm text-muted-foreground">{selectedPrescription.diagnosis}</p>
                </div>

                {/* Medications */}
                <div className="space-y-3">
                  <p className="text-sm font-medium text-foreground">Medications</p>
                  {selectedPrescription.medications.map((med, index) => (
                    <div key={index} className="p-3 rounded-lg border border-border bg-card">
                      <div className="flex items-start gap-3">
                        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <Pill className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-foreground">{med.name}</p>
                          <div className="flex flex-wrap gap-2 mt-1 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <span className="font-medium">Dosage:</span> {med.dosage}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" /> {med.frequency}
                            </span>
                            <span>•</span>
                            <span>{med.duration}</span>
                          </div>
                          {med.instructions && (
                            <p className="text-xs text-muted-foreground mt-1 italic">
                              {med.instructions}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Instructions */}
                {selectedPrescription.instructions && (
                  <div>
                    <p className="text-sm font-medium text-foreground mb-1">Instructions</p>
                    <p className="text-sm text-muted-foreground">{selectedPrescription.instructions}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                  <Button 
                    variant="hero" 
                    className="flex-1"
                    onClick={() => handleDownloadPDF(selectedPrescription)}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default Prescriptions;
