import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Dialog } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { disposisiService } from '../services/api';

const CreateDisposisiModal = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    surat_id: '',
    user_id: '',
    instruksi: '',
    jenis_disposisi: '',
    batas_waktu: '',
    prioritas: 'sedang',
  });

  const queryClient = useQueryClient();

  const { data: suratMasuk, isLoading: loadingSurat } = useQuery({
    queryKey: ['surat-masuk'],
    queryFn: () => disposisiService.getSuratMasuk(),
  });

  const { data: users, isLoading: loadingUsers } = useQuery({
    queryKey: ['users'],
    queryFn: () => disposisiService.getUsers(),
  });

  const createMutation = useMutation({
    mutationFn: (data) => disposisiService.create(data),
    onSuccess: () => {
      onSuccess();
      onClose();
    },
    onError: (error) => {
      console.error('Error creating disposisi:', error);
      // You can add toast notification here
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.surat_id || !formData.user_id || !formData.instruksi || !formData.jenis_disposisi) {
      alert('Mohon lengkapi semua field yang wajib');
      return;
    }

    const submitData = {
      ...formData,
      batas_waktu: formData.batas_waktu || null,
    };

    createMutation.mutate(submitData);
  };

  return (
    <Dialog open={true} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black bg-opacity-25" />
      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-2xl bg-white rounded-lg shadow-xl">
            <div className="flex items-center justify-between p-6 border-b">
              <Dialog.Title className="text-lg font-medium text-gray-900">
                Buat Disposisi Baru
              </Dialog.Title>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label htmlFor="surat_id" className="block text-sm font-medium text-gray-700 mb-1">
                  Surat Masuk *
                </label>
                <select
                  id="surat_id"
                  name="surat_id"
                  value={formData.surat_id}
                  onChange={handleChange}
                  required
                  disabled={loadingSurat}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="">Pilih Surat Masuk</option>
                  {suratMasuk?.data?.map((surat) => (
                    <option key={surat.id} value={surat.id}>
                      {surat.nomor_surat} - {surat.perihal}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="user_id" className="block text-sm font-medium text-gray-700 mb-1">
                  Kepada User *
                </label>
                <select
                  id="user_id"
                  name="user_id"
                  value={formData.user_id}
                  onChange={handleChange}
                  required
                  disabled={loadingUsers}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="">Pilih User</option>
                  {users?.data?.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.nama} - {user.unit_kerja}
                    </option>
                  ))}
                </select>
              </div>

               <div>
                 <label htmlFor="instruksi" className="block text-sm font-medium text-gray-700 mb-1">
                   Instruksi *
                 </label>
                 <textarea
                   id="instruksi"
                   name="instruksi"
                   value={formData.instruksi}
                   onChange={handleChange}
                   required
                   rows={4}
                   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                   placeholder="Masukkan instruksi untuk disposisi..."
                 />
               </div>

               <div>
                 <label htmlFor="jenis_disposisi" className="block text-sm font-medium text-gray-700 mb-1">
                   Jenis Disposisi *
                 </label>
                 <input
                   type="text"
                   id="jenis_disposisi"
                   name="jenis_disposisi"
                   value={formData.jenis_disposisi}
                   onChange={handleChange}
                   required
                   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                   placeholder="Masukkan jenis disposisi..."
                 />
               </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="batas_waktu" className="block text-sm font-medium text-gray-700 mb-1">
                    Batas Waktu
                  </label>
                  <input
                    type="date"
                    id="batas_waktu"
                    name="batas_waktu"
                    value={formData.batas_waktu}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label htmlFor="prioritas" className="block text-sm font-medium text-gray-700 mb-1">
                    Prioritas
                  </label>
                   <select
                     id="prioritas"
                     name="prioritas"
                     value={formData.prioritas}
                     onChange={handleChange}
                     className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                   >
                     <option value="rendah">Rendah</option>
                     <option value="sedang">Sedang</option>
                     <option value="tinggi">Tinggi</option>
                   </select>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isLoading}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {createMutation.isLoading ? 'Menyimpan...' : 'Buat Disposisi'}
                </button>
              </div>
            </form>
          </Dialog.Panel>
        </div>
      </div>
    </Dialog>
  );
};

export default CreateDisposisiModal;