
import { Header } from "@/components/layout/Header";

const ProviderDashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary/30 to-white">
      <Header />
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-gray-900">Provider Dashboard</h1>
            <p className="text-xl text-gray-600">Welcome to the Healthcare Provider Portal</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Provider Features */}
            <div className="p-6 bg-white rounded-xl shadow-lg">
              <h2 className="text-2xl font-semibold mb-4">Patient Management</h2>
              <p className="text-gray-600">View and manage your patient records, appointments, and medical histories.</p>
            </div>

            <div className="p-6 bg-white rounded-xl shadow-lg">
              <h2 className="text-2xl font-semibold mb-4">Analytics</h2>
              <p className="text-gray-600">Access detailed analytics and insights about your practice and patient care.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderDashboard;
