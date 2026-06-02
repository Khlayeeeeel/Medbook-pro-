import { useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { appointments } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { format, parseISO } from 'date-fns';
import { toast } from 'sonner';
import { 
  Calendar, 
  Clock, 
  User, 
  FileText, 
  MessageSquare,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Appointment } from '@/types';

const CalendarPage = () => {
  const { user } = useAuth();
  const [selectedEvent, setSelectedEvent] = useState<Appointment | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const calendarEvents = useMemo(() => {
    const userAppointments = user?.role === 'doctor'
      ? appointments.filter(apt => apt.doctorId === '1')
      : appointments.filter(apt => apt.patientId === '2');

    return userAppointments.map(apt => ({
      id: apt.id,
      title: user?.role === 'doctor' ? apt.patientName : apt.doctorName,
      start: `${apt.date}T${apt.time}`,
      end: `${apt.date}T${apt.time.split(':')[0]}:30`,
      extendedProps: apt,
      classNames: [`fc-event-${apt.status}`],
      backgroundColor: apt.status === 'confirmed' ? 'hsl(160, 84%, 39%)' :
                       apt.status === 'pending' ? 'hsl(38, 92%, 50%)' :
                       'hsl(0, 84%, 60%)',
    }));
  }, [user]);

  const handleEventClick = (info: any) => {
    setSelectedEvent(info.event.extendedProps as Appointment);
    setIsDialogOpen(true);
  };

  const handleDateClick = (info: any) => {
    toast.info(`Selected ${format(new Date(info.dateStr), 'MMMM d, yyyy')}`);
  };

  const handleEventDrop = (info: any) => {
    toast.success(`Appointment rescheduled to ${format(info.event.start, 'MMM d, h:mm a')}`);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'pending':
        return <AlertCircle className="h-4 w-4 text-warning" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-destructive" />;
      default:
        return null;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Calendar</h1>
            <p className="text-muted-foreground">
              {user?.role === 'doctor' 
                ? 'Manage your appointment schedule'
                : 'View your upcoming appointments'}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-3 h-3 rounded-full bg-success" />
              <span className="text-muted-foreground">Confirmed</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-3 h-3 rounded-full bg-warning" />
              <span className="text-muted-foreground">Pending</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-3 h-3 rounded-full bg-destructive" />
              <span className="text-muted-foreground">Cancelled</span>
            </div>
          </div>
        </div>

        {/* Calendar Card */}
        <Card className="border-border/50">
          <CardContent className="p-4 md:p-6">
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay',
              }}
              events={calendarEvents}
              eventClick={handleEventClick}
              dateClick={handleDateClick}
              editable={user?.role === 'doctor'}
              eventDrop={handleEventDrop}
              selectable={true}
              selectMirror={true}
              dayMaxEvents={3}
              weekends={true}
              height="auto"
              aspectRatio={1.8}
            />
          </CardContent>
        </Card>

        {/* Appointment Detail Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Appointment Details
              </DialogTitle>
              <DialogDescription>
                {selectedEvent && format(parseISO(selectedEvent.date), 'EEEE, MMMM d, yyyy')}
              </DialogDescription>
            </DialogHeader>
            
            {selectedEvent && (
              <div className="space-y-4">
                {/* Person Info */}
                <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/50">
                  <Avatar className="h-14 w-14 border-2 border-border">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {user?.role === 'doctor' 
                        ? selectedEvent.patientName.charAt(0)
                        : selectedEvent.doctorName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-foreground">
                      {user?.role === 'doctor' ? selectedEvent.patientName : selectedEvent.doctorName}
                    </p>
                    <p className="text-sm text-muted-foreground">{selectedEvent.specialty}</p>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      Time
                    </span>
                    <span className="font-medium">{selectedEvent.time}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-muted-foreground">
                      <User className="h-4 w-4" />
                      Type
                    </span>
                    <span className="font-medium capitalize">{selectedEvent.type}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Status</span>
                    <Badge 
                      className={cn(
                        selectedEvent.status === 'confirmed' && 'status-confirmed',
                        selectedEvent.status === 'pending' && 'status-pending',
                        selectedEvent.status === 'cancelled' && 'status-cancelled'
                      )}
                    >
                      {getStatusIcon(selectedEvent.status)}
                      <span className="ml-1 capitalize">{selectedEvent.status}</span>
                    </Badge>
                  </div>
                  {selectedEvent.symptoms && (
                    <div className="pt-3 border-t border-border">
                      <p className="text-sm text-muted-foreground mb-1">Notes</p>
                      <p className="text-sm text-foreground">{selectedEvent.symptoms}</p>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" className="flex-1">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Message
                  </Button>
                  {user?.role === 'doctor' && (
                    <Button variant="default" className="flex-1">
                      <FileText className="h-4 w-4 mr-2" />
                      Add Notes
                    </Button>
                  )}
                </div>

                {selectedEvent.status === 'pending' && (
                  <div className="flex gap-2">
                    <Button variant="success" className="flex-1 bg-success hover:bg-success/90">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Confirm
                    </Button>
                    <Button variant="destructive" className="flex-1">
                      <XCircle className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default CalendarPage;
