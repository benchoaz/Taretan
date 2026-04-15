import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { XMarkIcon, MapPinIcon } from '@heroicons/react/24/outline';

const DisposisiModal = ({ disposisi, onClose }) => {
  const [activeTab, setActiveTab] = useState('detail');

  if (!disposisi) return null;

  const handleViewLocation = (latitude, longitude) => {
    const url = `https://maps.google.com/?q=${latitude},${longitude}`;
    window.open(url, '_blank');
  };

  return (
    <Dialog open={true} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black bg-opacity-25" />
      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-4xl bg-white rounded-lg shadow-xl">
            <div className="flex items-center justify-between p-6 border-b">
              <Dialog.Title className="text-lg font-medium text-gray-900">
                Detail Disposisi
              </Dialog.Title>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6">
              {/* Tabs */}
              <div className="border-b border-gray-200 mb-6">
                <nav className="-mb-px flex space-x-8">
                  <button
                    onClick={() => setActiveTab('detail')}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'detail'
                        ? 'border-indigo-500 text-indigo-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Data Surat & Disposisi
                  </button>
                  <button
                    onClick={() => setActiveTab('laporan')}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'laporan'
                        ? 'border-indigo-500 text-indigo-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Laporan Hasil
                  </button>
                </nav>
              </div>

              {/* Tab Content */}
              {activeTab === 'detail' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-md font-medium text-gray-900 mb-4">Data Surat Masuk</h3>
                      <dl className="space-y-2">
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Nomor Surat</dt>
                          <dd className="text-sm text-gray-900">{disposisi.surat.nomor_surat}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Tanggal Surat</dt>
                          <dd className="text-sm text-gray-900">
                            {new Date(disposisi.surat.tanggal_surat).toLocaleDateString('id-ID')}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Asal Surat</dt>
                          <dd className="text-sm text-gray-900">{disposisi.surat.asal_surat}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Perihal</dt>
                          <dd className="text-sm text-gray-900">{disposisi.surat.perihal}</dd>
                        </div>
                      </dl>
                    </div>
                    <div>
                      <h3 className="text-md font-medium text-gray-900 mb-4">Data Disposisi</h3>
                      <dl className="space-y-2">
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Dari</dt>
                          <dd className="text-sm text-gray-900">{disposisi.dari_user.nama}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Kepada</dt>
                          <dd className="text-sm text-gray-900">{disposisi.ke_user.nama} ({disposisi.ke_user.unit_kerja})</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Instruksi</dt>
                          <dd className="text-sm text-gray-900">{disposisi.instruksi}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Batas Waktu</dt>
                          <dd className="text-sm text-gray-900">
                            {disposisi.batas_waktu ? new Date(disposisi.batas_waktu).toLocaleDateString('id-ID') : '-'}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Status</dt>
                          <dd className="text-sm text-gray-900">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              disposisi.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              disposisi.status === 'proses' ? 'bg-blue-100 text-blue-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {disposisi.status}
                            </span>
                          </dd>
                        </div>
                      </dl>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'laporan' && (
                <div className="space-y-4">
                  {disposisi.laporan_hasil && disposisi.laporan_hasil.length > 0 ? (
                    disposisi.laporan_hasil.map((laporan) => (
                      <div key={laporan.id} className="border rounded-lg p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="text-sm font-medium text-gray-900 mb-2">Uraian</h4>
                            <p className="text-sm text-gray-700">{laporan.uraian}</p>
                            <div className="mt-2">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                laporan.status_verifikasi === 'belum_verifikasi' ? 'bg-yellow-100 text-yellow-800' :
                                laporan.status_verifikasi === 'terverifikasi' ? 'bg-green-100 text-green-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {laporan.status_verifikasi}
                              </span>
                            </div>
                          </div>
                          <div>
                            {laporan.foto_url && (
                              <div className="mb-4">
                                <h4 className="text-sm font-medium text-gray-900 mb-2">Foto</h4>
                                <img
                                  src={laporan.foto_url}
                                  alt="Laporan"
                                  className="w-full h-32 object-cover rounded"
                                />
                              </div>
                            )}
                            {laporan.latitude && laporan.longitude && (
                              <div>
                                <button
                                  onClick={() => handleViewLocation(laporan.latitude, laporan.longitude)}
                                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                  <MapPinIcon className="h-4 w-4 mr-2" />
                                  Lihat Lokasi
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-8">Belum ada laporan hasil</p>
                  )}
                </div>
              )}
            </div>
          </Dialog.Panel>
        </div>
      </div>
    </Dialog>
  );
};

export default DisposisiModal;