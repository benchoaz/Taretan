import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { disposisiService, authService } from '../services/api';
import StatCard from '../components/StatCard';
import DisposisiTable from '../components/DisposisiTable';
import DisposisiModal from '../components/DisposisiModal';
import CreateDisposisiModal from '../components/CreateDisposisiModal';
import LoadingSkeleton from '../components/LoadingSkeleton';

const MonitoringDashboard = () => {
  const [filters, setFilters] = useState({
    status: '',
    unit_kerja: '',
    search: '',
    page: 1,
    limit: 10,
  });
  const [selectedDisposisi, setSelectedDisposisi] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const userRole = localStorage.getItem('userRole');
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['monitoring', filters],
    queryFn: () => disposisiService.getMonitoring(filters),
  });

  const refreshMonitoring = () => {
    queryClient.invalidateQueries(['monitoring']);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const handleViewDetail = (disposisi) => {
    setSelectedDisposisi(disposisi);
    setIsModalOpen(true);
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600">Error Loading Data</h2>
          <p className="text-gray-600">Please try again later.</p>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    authService.logout();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center space-x-4">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Monitoring Disposisi</h1>
          {userRole === 'kepala_opd' && (
            <button onClick={() => setIsCreateModalOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
              Create Disposisi
            </button>
          )}
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
        >
          Logout
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Disposisi" value={data?.data?.total || 0} />
        <StatCard title="Pending" value={data?.data?.disposisi?.filter(d => d.status === 'pending').length || 0} />
        <StatCard title="Proses" value={data?.data?.disposisi?.filter(d => d.status === 'proses').length || 0} />
        <StatCard title="Selesai" value={data?.data?.disposisi?.filter(d => d.status === 'selesai').length || 0} />
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">Semua</option>
              <option value="pending">Pending</option>
              <option value="proses">Proses</option>
              <option value="selesai">Selesai</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Unit Kerja</label>
            <input
              type="text"
              value={filters.unit_kerja}
              onChange={(e) => handleFilterChange('unit_kerja', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Cari unit kerja..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Search</label>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Cari nomor surat atau perihal..."
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={() => setFilters({ status: '', unit_kerja: '', search: '', page: 1, limit: 10 })}
              className="w-full bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
            >
              Reset Filter
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <LoadingSkeleton />
      ) : (
        <DisposisiTable
          disposisi={data?.data?.disposisi || []}
          onViewDetail={handleViewDetail}
          pagination={{
            page: data?.data?.page || 1,
            limit: data?.data?.limit || 10,
            total: data?.data?.total || 0,
            onPageChange: (page) => handleFilterChange('page', page),
          }}
        />
      )}

      {/* Modal */}
      {isModalOpen && (
        <DisposisiModal
          disposisi={selectedDisposisi}
          onClose={() => setIsModalOpen(false)}
        />
      )}
      {isCreateModalOpen && (
        <CreateDisposisiModal
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={refreshMonitoring}
        />
      )}
    </div>
  );
};

export default MonitoringDashboard;