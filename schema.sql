-- 1. Tabel Warga
CREATE TABLE warga (
    id SERIAL PRIMARY KEY,
    nik VARCHAR(16) UNIQUE NOT NULL,
    nama VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabel Profil Warga (Relasi 1:1 dengan warga)
CREATE TABLE profil_warga (
    id SERIAL PRIMARY KEY,
    warga_id INT UNIQUE NOT NULL,
    nomor_telepon VARCHAR(15),
    alamat_lengkap TEXT NOT NULL,
    rt_rw VARCHAR(10),
    CONSTRAINT fk_profil_warga FOREIGN KEY (warga_id) REFERENCES warga(id) ON DELETE CASCADE
);

-- 3. Tabel Kategori Laporan
CREATE TABLE kategori_laporan (
    id SERIAL PRIMARY KEY,
    nama_kategori VARCHAR(50) NOT NULL,
    deskripsi TEXT
);

-- 4. Tabel Laporan (Relasi 1:N dari warga dan kategori_laporan)
CREATE TABLE laporan (
    id SERIAL PRIMARY KEY,
    warga_id INT NOT NULL,
    kategori_id INT NOT NULL,
    judul VARCHAR(150) NOT NULL,
    isi_laporan TEXT NOT NULL,
    lokasi VARCHAR(150) NOT NULL,
    status VARCHAR(20) DEFAULT 'Menunggu' CHECK (status IN ('Menunggu', 'Diproses', 'Selesai', 'Ditolak')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_laporan_warga FOREIGN KEY (warga_id) REFERENCES warga(id) ON DELETE CASCADE,
    CONSTRAINT fk_laporan_kategori FOREIGN KEY (kategori_id) REFERENCES kategori_laporan(id) ON DELETE RESTRICT
);

-- 5. Tabel Petugas
CREATE TABLE petugas (
    id SERIAL PRIMARY KEY,
    nama_petugas VARCHAR(100) NOT NULL,
    jabatan VARCHAR(50) NOT NULL,
    nomor_kontak VARCHAR(15) NOT NULL
);

-- 6. Tabel Penugasan Petugas (Relasi M:N antara laporan dan petugas)
CREATE TABLE penugasan_petugas (
    id SERIAL PRIMARY KEY,
    laporan_id INT NOT NULL,
    petugas_id INT NOT NULL,
    catatan_tugas TEXT,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_penugasan_laporan FOREIGN KEY (laporan_id) REFERENCES laporan(id) ON DELETE CASCADE,
    CONSTRAINT fk_penugasan_petugas FOREIGN KEY (petugas_id) REFERENCES petugas(id) ON DELETE CASCADE
);

-- 7. Tabel Tanggapan Laporan (Relasi 1:N dari laporan dan petugas)
CREATE TABLE tanggapan_laporan (
    id SERIAL PRIMARY KEY,
    laporan_id INT NOT NULL,
    petugas_id INT NOT NULL,
    isi_tanggapan TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_tanggapan_laporan FOREIGN KEY (laporan_id) REFERENCES laporan(id) ON DELETE CASCADE,
    CONSTRAINT fk_tanggapan_petugas FOREIGN KEY (petugas_id) REFERENCES petugas(id) ON DELETE SET NULL
);