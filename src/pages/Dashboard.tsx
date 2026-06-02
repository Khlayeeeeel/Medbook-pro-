import { useAuth } from '@/contexts/AuthContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DoctorDashboard } from '@/components/dashboard/DoctorDashboard';
import { PatientDashboard } from '@/components/dashboard/PatientDashboard';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <DashboardLayout>
      {user?.role === 'doctor' ? <DoctorDashboard /> : <PatientDashboard />}
    </DashboardLayout>
  );
};

export default Dashboard;
