# Sistem E-Disposisi

Sistem terintegrasi untuk manajemen disposisi surat berbasis web & mobile.

## 🚀 Quick Start

### Option 1: Docker (Recommended)
```bash
# Clone repository
git clone <repository-url>
cd e-disposisi

# Start all services
docker-compose up -d

# Check logs
docker-compose logs -f
```

### Option 2: Local Development

#### Prerequisites
- Go 1.21+
- Node.js 18+
- PostgreSQL 12+

#### Setup Database
```bash
# Create database
sudo -u postgres createdb edisposisi

# Run migration
psql -U postgres -d edisposisi -f database/schema.sql

# Run seeder
psql -U postgres -d edisposisi -f database/seeder.sql
```

#### Setup & Run
```bash
# Quick setup
./setup.sh

# Run all services
./run.sh
```

Or manually:
```bash
# Backend
cd backend && go run cmd/server/main.go

# Frontend (new terminal)
cd frontend && npm start
```

## 📚 API Documentation

### SSO Authentication
```
POST /api/login
Content-Type: application/json

{
  "sso_id": "sso_user_001",
  "email": "user@office365.com",
  "role": "operator|kepala_opd|staf"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "SSO Login berhasil",
  "data": {
    "token": "sso_sso_user_001_staf_token",
    "user": {
      "sso_id": "sso_user_001",
      "email": "user@office365.com",
      "role": "staf"
    }
  }
}
```

### Create Disposisi (Kepala OPD only)
```
POST /api/disposisi
Authorization: Bearer sso_sso_kepala_001_kepala_opd_token
Content-Type: application/json

{
  "surat_id": "uuid",
  "ke_user_id": "uuid",
  "instruksi": "string",
  "batas_waktu": "2026-01-15",
  "prioritas": "tinggi"
}
```

### Upload Laporan (Staf only)
```
POST /api/laporan
Authorization: Bearer sso_sso_staf_001_staf_token
Content-Type: multipart/form-data

disposisi_id: uuid
uraian: string
latitude: number
longitude: number
foto: file (JPG/PNG, max 5MB)
```

### Monitoring Disposisi (Role-based)
```
GET /api/disposisi/monitoring?status=pending&page=1&limit=10
Authorization: Bearer sso_{sso_id}_{role}_token
```

**Response bervariasi berdasarkan role:**
- **Operator**: Melihat semua disposisi
- **Kepala OPD**: Melihat disposisi yang dibuatnya
- **Staf**: Melihat disposisi yang diterimanya

## 🗄️ Database Schema

### Users
- id (UUID, PK)
- nama, nip, email (unique), password_hash
- jabatan, unit_kerja, role (admin/pimpinan/staf), status

### SuratMasuk
- id (UUID, PK), nomor_surat (unique)
- tanggal_surat, tanggal_terima, asal_surat, perihal
- sifat (biasa/penting/segera), file_pdf_url

### Disposisi
- id (UUID, PK), surat_id (FK), dari_user_id (FK), ke_user_id (FK)
- instruksi, batas_waktu, prioritas, status

### LaporanHasil
- id (UUID, PK), disposisi_id (FK), user_id (FK)
- uraian, foto_url, latitude, longitude, tanggal_lapor, status_verifikasi

### LogAktivitas (Audit Trail)
- id (PK), user_id (FK), aktivitas, referensi_id, ip_address, created_at

## 🏗️ Architecture

### Backend (Go)
- **Framework**: Gin
- **ORM**: GORM
- **Auth**: JWT
- **Architecture**: Clean Architecture
- **Middleware**: Logger, CORS, Rate Limit, Auth

### Frontend (React)
- **Framework**: React 18
- **State Management**: React Query
- **Styling**: Tailwind CSS
- **Components**: Headless UI

### Mobile (Flutter)
- Coming soon...

## 🔒 Security Features
- SSO Authentication (Office365/Google)
- Role-based Access Control (RBAC)
- JWT Token Authorization
- File upload validation
- Rate limiting
- CORS protection
- Input validation

## 👥 User Roles & Permissions

### 1. **Operator** (Administrator Sistem)
- **Akses**: Full system monitoring
- **Endpoint**: `GET /api/disposisi/monitoring`
- **Fungsi**: Mengelola sistem, melihat semua disposisi

### 2. **Kepala OPD** (Pimpinan)
- **Akses**: Create disposisi, monitoring disposisi yang dibuat
- **Endpoint**: `POST /api/disposisi`, `GET /api/disposisi/monitoring`
- **Fungsi**: Membuat disposisi surat ke staf

### 3. **Staf/Kasi/Kabid**
- **Akses**: Upload laporan, monitoring disposisi yang diterima
- **Endpoint**: `POST /api/laporan`, `GET /api/disposisi/monitoring`
- **Fungsi**: Menerima disposisi dan membuat laporan hasil

## 📱 Features
- ✅ User authentication & authorization
- ✅ Surat masuk management
- ✅ Disposisi creation & monitoring
- ✅ Laporan upload with GPS & photo
- ✅ Real-time monitoring dashboard
- ✅ Responsive web interface
- ✅ Audit trail logging

## 🧪 Testing
```bash
# Backend tests
cd backend && go test ./...

# Frontend tests
cd frontend && npm test
```

## 🚀 Deployment
```bash
# Build backend
cd backend && go build -o bin/server cmd/server/main.go

# Build frontend
cd frontend && npm run build
```

## 📝 Environment Variables
```bash
# Backend (.env)
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=password
DB_NAME=edisposisi
JWT_SECRET=your-secret-key

# Frontend (.env)
REACT_APP_API_URL=http://localhost:8080/api
```

## 🤝 Contributing
1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License
This project is licensed under the MIT License.