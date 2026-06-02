import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { appointments, prescriptions, doctors } from '@/data/mockData';
import { format, parseISO, isFuture, isPast } from 'date-fns';
import {
  Calendar,
  Clock,
  FileText,
  MessageSquare,
  ArrowRight,
  Star,
  CheckCircle,
  AlertCircle,
  Plus
} from 'lucide-react';
import { cn } from '@/lib/utils';


export const PatientDashboard = () => {
  const { user } = useAuth();

  const patientAppointments = appointments.filter(apt => apt.patientId === '2');
  const upcomingAppointments = patientAppointments.filter(apt =>
    isFuture(parseISO(apt.date)) || apt.date === format(new Date(), 'yyyy-MM-dd')
  ).slice(0, 3);

  const patientPrescriptions = prescriptions.filter(p => p.patientId === '2');

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Hello, {user?.name?.split(' ')[0]}!
          </h1>
          <p className="text-muted-foreground">
            Manage your appointments and stay on top of your health.
          </p>
        </div>
        <Link to="/book">
          <Button variant="hero">
            <Plus className="h-4 w-4" />
            Book Appointment
          </Button>
        </Link>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Upcoming', value: upcomingAppointments.length, icon: Calendar, color: 'text-primary', bgColor: 'bg-primary/10' },
          { label: 'Completed', value: patientAppointments.filter(a => a.status === 'completed').length, icon: CheckCircle, color: 'text-success', bgColor: 'bg-success/10' },
          { label: 'Prescriptions', value: patientPrescriptions.length, icon: FileText, color: 'text-secondary', bgColor: 'bg-secondary/10' },
          { label: 'Messages', value: 2, icon: MessageSquare, color: 'text-warning', bgColor: 'bg-warning/10' },
        ].map((stat, index) => (
          <Card
            key={stat.label}
            className="border-border/50 animate-slide-up"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className={cn('p-3 rounded-xl', stat.bgColor)}>
                  <stat.icon className={cn('h-5 w-5', stat.color)} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Upcoming Appointments */}
        <Card className="lg:col-span-2 border-border/50">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Upcoming Appointments</CardTitle>
              <CardDescription>Your scheduled visits</CardDescription>
            </div>
            <Link to="/book">
              <Button variant="ghost" size="sm">
                View All
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {upcomingAppointments.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                <p className="text-muted-foreground mb-4">No upcoming appointments</p>
                <Link to="/book">
                  <Button>Book Your First Appointment</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingAppointments.map((apt, index) => {
                  const doctor = doctors.find(d => d.id === apt.doctorId);
                  return (
                    <div
                      key={apt.id}
                      className="flex items-center gap-4 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors animate-slide-up"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <Avatar className="h-14 w-14 border-2 border-border">
                        <AvatarImage src={doctor?.avatar} />
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {apt.doctorName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground">{apt.doctorName}</p>
                        <p className="text-sm text-muted-foreground">{apt.specialty}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {format(parseISO(apt.date), 'MMM d, yyyy')} at {apt.time}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge
                          className={cn(
                            'text-xs',
                            apt.status === 'confirmed' && 'status-confirmed',
                            apt.status === 'pending' && 'status-pending'
                          )}
                        >
                          {apt.status === 'confirmed' && <CheckCircle className="h-3 w-3 mr-1" />}
                          {apt.status === 'pending' && <AlertCircle className="h-3 w-3 mr-1" />}
                          {apt.status}
                        </Badge>
                        <Link to="/chat">
                          <Button variant="ghost" size="sm">
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Side Panel */}
        <div className="space-y-6">
          {/* Recent Prescription */}
          <Card className="border-border/50">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Prescription</CardTitle>
              <Link to="/prescriptions">
                <Button variant="ghost" size="sm">View All</Button>
              </Link>
            </CardHeader>
            <CardContent>
              {patientPrescriptions.length === 0 ? (
                <p className="text-muted-foreground text-sm">No prescriptions yet</p>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-muted/50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-foreground">
                        {patientPrescriptions[0].doctorName}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {format(parseISO(patientPrescriptions[0].date), 'MMM d')}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {patientPrescriptions[0].diagnosis}
                    </p>
                    <div className="space-y-2">
                      {patientPrescriptions[0].medications.slice(0, 2).map((med, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm">
                          <div className="h-2 w-2 rounded-full bg-primary" />
                          <span className="text-foreground">{med.name}</span>
                          <span className="text-muted-foreground">• {med.dosage}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Link to="/prescriptions">
                    <Button variant="outline" size="sm" className="w-full">
                      <FileText className="h-4 w-4 mr-2" />
                      View Full Prescription
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Featured Doctors */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Top Doctors</CardTitle>
              <CardDescription>Highly rated specialists</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {doctors.slice(0, 3).map((doctor) => (
                  <div key={doctor.id} className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={doctor.avatar} />
                      <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                        {doctor.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{doctor.name}</p>
                      <p className="text-xs text-muted-foreground">{doctor.specialty}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 fill-warning text-warning" />
                      <span className="text-sm font-medium">{doctor.rating}</span>
                    </div>
                  </div>
                ))}
              </div>
              <Link to="/book">
                <Button variant="outline" size="sm" className="w-full mt-4">
                  Find a Doctor
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
