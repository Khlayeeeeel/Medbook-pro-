import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { doctors, specialties, timeSlots } from '@/data/mockData';
import { format, addDays, isBefore, startOfDay } from 'date-fns';
import { toast } from 'sonner';
import {
  Search,
  Star,
  Clock,
  DollarSign,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  Calendar as CalendarIcon,
  MapPin,
  Languages
} from 'lucide-react';
import { cn } from '@/lib/utils';

type BookingStep = 'select-doctor' | 'select-time' | 'enter-details' | 'confirmation';

const BookAppointment = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<BookingStep>('select-doctor');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('all');
  const [selectedDoctor, setSelectedDoctor] = useState<typeof doctors[0] | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(addDays(new Date(), 1));
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [symptoms, setSymptoms] = useState('');
  const [appointmentType, setAppointmentType] = useState<'consultation' | 'follow-up'>('consultation');

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecialty = selectedSpecialty === 'all' || doctor.specialty === selectedSpecialty;
    return matchesSearch && matchesSpecialty;
  });

  const handleSelectDoctor = (doctor: typeof doctors[0]) => {
    setSelectedDoctor(doctor);
    setStep('select-time');
  };

  const handleSelectTime = (time: string) => {
    setSelectedTime(time);
    setStep('enter-details');
  };

  const handleConfirmBooking = () => {
    setStep('confirmation');
    toast.success('Appointment booked successfully!');
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center gap-2 mb-8">
      {['select-doctor', 'select-time', 'enter-details', 'confirmation'].map((s, i) => (
        <div key={s} className="flex items-center">
          <div className={cn(
            'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors',
            step === s ? 'medical-gradient text-primary-foreground' :
              ['select-doctor', 'select-time', 'enter-details', 'confirmation'].indexOf(step) > i
                ? 'bg-success text-success-foreground'
                : 'bg-muted text-muted-foreground'
          )}>
            {['select-doctor', 'select-time', 'enter-details', 'confirmation'].indexOf(step) > i
              ? <CheckCircle className="h-4 w-4" />
              : i + 1}
          </div>
          {i < 3 && (
            <div className={cn(
              'w-12 h-0.5 mx-2',
              ['select-doctor', 'select-time', 'enter-details', 'confirmation'].indexOf(step) > i
                ? 'bg-success'
                : 'bg-muted'
            )} />
          )}
        </div>
      ))}
    </div>
  );

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto animate-fade-in">
        {renderStepIndicator()}

        {/* Step 1: Select Doctor */}
        {step === 'select-doctor' && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">Find Your Doctor</h1>
              <p className="text-muted-foreground">Search by name, specialty, or browse our top-rated physicians</p>
            </div>

            {/* Search & Filter */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search doctors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="All Specialties" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Specialties</SelectItem>
                  {specialties.map((specialty) => (
                    <SelectItem key={specialty} value={specialty}>
                      {specialty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Doctor Cards */}
            <div className="grid gap-4">
              {filteredDoctors.map((doctor, index) => (
                <Card
                  key={doctor.id}
                  className="border-border/50 hover:shadow-card transition-all cursor-pointer animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={() => handleSelectDoctor(doctor)}
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      <Avatar className="h-24 w-24 border-2 border-border">
                        <AvatarImage src={doctor.avatar} />
                        <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                          {doctor.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-lg font-semibold text-foreground">{doctor.name}</h3>
                            <p className="text-secondary font-medium">{doctor.specialty}</p>
                          </div>
                          <div className="flex items-center gap-1 bg-warning/10 px-2 py-1 rounded-full">
                            <Star className="h-4 w-4 fill-warning text-warning" />
                            <span className="font-medium text-foreground">{doctor.rating}</span>
                            <span className="text-sm text-muted-foreground">({doctor.reviewCount})</span>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{doctor.bio}</p>
                        <div className="flex flex-wrap gap-4 mt-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {doctor.experience} years exp.
                          </span>
                          <span className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4" />
                            ${doctor.consultationFee}
                          </span>
                          <span className="flex items-center gap-1">
                            <Languages className="h-4 w-4" />
                            {doctor.languages.join(', ')}
                          </span>
                        </div>
                        <div className="flex gap-2 mt-3">
                          {doctor.availability.map((day) => (
                            <Badge key={day} variant="secondary" className="text-xs">
                              {day}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex md:flex-col items-center justify-end gap-2">
                        <Button variant="hero" className="w-full md:w-auto">
                          Book Now
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Select Time */}
        {step === 'select-time' && selectedDoctor && (
          <div className="space-y-6">
            <Button variant="ghost" onClick={() => setStep('select-doctor')} className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Doctors
            </Button>

            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">Choose Date & Time</h1>
              <p className="text-muted-foreground">Select a convenient slot for your appointment with {selectedDoctor.name}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Calendar */}
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5 text-primary" />
                    Select Date
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => isBefore(date, startOfDay(new Date()))}
                    className="rounded-md border pointer-events-auto"
                  />
                </CardContent>
              </Card>

              {/* Time Slots */}
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    Available Times
                  </CardTitle>
                  <CardDescription>
                    {selectedDate ? format(selectedDate, 'EEEE, MMMM d, yyyy') : 'Select a date first'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-2">
                    {timeSlots.map((time) => (
                      <Button
                        key={time}
                        variant={selectedTime === time ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleSelectTime(time)}
                        className={cn(
                          selectedTime === time && 'medical-gradient text-primary-foreground'
                        )}
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Step 3: Enter Details */}
        {step === 'enter-details' && selectedDoctor && (
          <div className="space-y-6">
            <Button variant="ghost" onClick={() => setStep('select-time')} className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Time Selection
            </Button>

            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">Appointment Details</h1>
              <p className="text-muted-foreground">Tell us more about your visit</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Summary Card */}
              <Card className="border-border/50 h-fit">
                <CardHeader>
                  <CardTitle>Booking Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16 border-2 border-border">
                      <AvatarImage src={selectedDoctor.avatar} />
                      <AvatarFallback>{selectedDoctor.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-foreground">{selectedDoctor.name}</p>
                      <p className="text-sm text-secondary">{selectedDoctor.specialty}</p>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-border space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Date</span>
                      <span className="font-medium text-foreground">
                        {selectedDate && format(selectedDate, 'MMM d, yyyy')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Time</span>
                      <span className="font-medium text-foreground">{selectedTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Consultation Fee</span>
                      <span className="font-medium text-foreground">${selectedDoctor.consultationFee}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Details Form */}
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle>Visit Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Appointment Type</Label>
                    <Select value={appointmentType} onValueChange={(v: any) => setAppointmentType(v)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="consultation">New Consultation</SelectItem>
                        <SelectItem value="follow-up">Follow-up Visit</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Describe your symptoms or reason for visit</Label>
                    <Textarea
                      placeholder="Please describe what you'd like to discuss with the doctor..."
                      value={symptoms}
                      onChange={(e) => setSymptoms(e.target.value)}
                      rows={4}
                    />
                  </div>
                  <Button
                    variant="hero"
                    className="w-full"
                    size="lg"
                    onClick={handleConfirmBooking}
                  >
                    Confirm Booking
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Step 4: Confirmation */}
        {step === 'confirmation' && selectedDoctor && (
          <div className="text-center space-y-6 py-8 animate-slide-up">
            <div className="w-20 h-20 mx-auto rounded-full bg-success/10 flex items-center justify-center">
              <CheckCircle className="h-10 w-10 text-success" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Booking Confirmed!</h1>
              <p className="text-muted-foreground">
                Your appointment has been scheduled successfully
              </p>
            </div>

            <Card className="max-w-md mx-auto border-border/50">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-4 pb-4 border-b border-border">
                  <Avatar className="h-14 w-14">
                    <AvatarImage src={selectedDoctor.avatar} />
                    <AvatarFallback>{selectedDoctor.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="text-left">
                    <p className="font-semibold text-foreground">{selectedDoctor.name}</p>
                    <p className="text-sm text-secondary">{selectedDoctor.specialty}</p>
                  </div>
                </div>
                <div className="space-y-2 text-left">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Date</span>
                    <span className="font-medium">{selectedDate && format(selectedDate, 'EEEE, MMM d, yyyy')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Time</span>
                    <span className="font-medium">{selectedTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type</span>
                    <span className="font-medium capitalize">{appointmentType}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="outline" onClick={() => navigate('/dashboard')}>
                Go to Dashboard
              </Button>
              <Button variant="hero" onClick={() => navigate('/chat')}>
                Message Doctor
              </Button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default BookAppointment;
