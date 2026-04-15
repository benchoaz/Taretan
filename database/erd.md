# ERD Database Sistem E-Disposisi

## Diagram Entitas-Relasi

```
+----------------+       +-----------------+       +-----------------+
|     Users      |       |   SuratMasuk    |       |   Disposisi     |
+----------------+       +-----------------+       +-----------------+
| id (PK)        |<--    | id (PK)         |<--    | id (PK)         |
| nama           |   |   | nomor_surat     |   |   | surat_id (FK)   |
| nip            |   |   | tanggal_surat   |   |   | dari_user_id(FK)|
| email          |   |   | tanggal_terima  |   |   | ke_user_id (FK) |
| password_hash  |   |   | asal_surat      |   |   | instruksi       |
| jabatan        |   |   | perihal         |   |   | batas_waktu     |
| unit_kerja     |   |   | sifat           |   |   | prioritas       |
| role           |   |   | file_pdf_url    |   |   | status          |
| status         |   |   | created_by (FK) |   |   | created_at      |
| created_at     |   |   | created_at      |   |   | updated_at      |
| updated_at     |   +-->| updated_at      |   +-->|                 |
+----------------+       +-----------------+       +-----------------+
    |                           |                           |
    |                           |                           |
    | (created_by)              | (surat_id)                | (disposisi_id)
    |                           |                           |
    v                           v                           v
+----------------+       +-----------------+       +-----------------+
| LogAktivitas   |       |   LaporanHasil  |       |                 |
+----------------+       +-----------------+       +-----------------+
| id (PK)        |       | id (PK)         |       |                 |
| user_id (FK)   |       | disposisi_id(FK)|       |                 |
| aktivitas      |       | user_id (FK)    |       |                 |
| referensi_id   |       | uraian          |       |                 |
| ip_address     |       | foto_url        |       |                 |
| created_at     |       | latitude        |       |                 |
|                |       | longitude       |       |                 |
|                |       | tanggal_lapor   |       |                 |
|                |       | status_verifikasi|      |                 |
|                |       | created_at      |       |                 |
+----------------+       +-----------------+       +-----------------+
```

## Relasi

- **Users** 1:N **SuratMasuk** (via created_by)
- **Users** 1:N **Disposisi** (via dari_user_id, ke_user_id)
- **SuratMasuk** 1:N **Disposisi** (via surat_id)
- **Users** 1:N **LaporanHasil** (via user_id)
- **Disposisi** 1:N **LaporanHasil** (via disposisi_id)
- **Users** 1:N **LogAktivitas** (via user_id)

## Catatan

- Semua Primary Key menggunakan UUID
- Foreign Key constraints diterapkan
- Indexes ditambahkan pada kolom yang sering dicari
- Triggers untuk auto-update updated_at pada tabel yang relevan