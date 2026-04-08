import { useAuth } from '@/hooks/useAuth';
import AdminDashboard from './AdminDashboard';
import StudentDashboard from './StudentDashboard';

const Index = () => {
  const { roles } = useAuth();
  const isAdmin = roles.includes('admin');
  return isAdmin ? <AdminDashboard /> : <StudentDashboard />;
};

export default Index;
