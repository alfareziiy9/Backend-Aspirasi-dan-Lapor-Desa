const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// 1. GET: Dapatkan semua data kategori
app.get('/api/kategori', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM kategori_laporan ORDER BY id ASC');
    res.status(200).json({
      status: 'success',
      data: result.rows,
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// 2. GET: Dapatkan data kategori berdasarkan ID
app.get('/api/kategori/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('SELECT * FROM kategori_laporan WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({
        status: 'fail',
        message: `Kategori dengan ID ${id} tidak ditemukan`,
      });
    }
    res.status(200).json({
      status: 'success',
      data: result.rows[0],
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// 3. POST
app.post('/api/kategori', async (req, res) => {
  const { nama_kategori, deskripsi } = req.body;
  if (!nama_kategori) {
    return res.status(400).json({
      status: 'fail',
      message: 'Field nama_kategori wajib diisi',
    });
  }

  try {
    const result = await db.query(
      'INSERT INTO kategori_laporan (nama_kategori, deskripsi) VALUES ($1, $2) RETURNING *',
      [nama_kategori, deskripsi]
    );
    res.status(201).json({
      status: 'success',
      message: 'Kategori baru berhasil ditambahkan',
      data: result.rows[0],
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// 4. PUT
app.put('/api/kategori/:id', async (req, res) => {
  const { id } = req.params;
  const { nama_kategori, deskripsi } = req.body;

  try {
    const result = await db.query(
      'UPDATE kategori_laporan SET nama_kategori = $1, deskripsi = $2 WHERE id = $3 RETURNING *',
      [nama_kategori, deskripsi, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: 'fail',
        message: `Kategori dengan ID ${id} tidak ditemukan`,
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Data kategori berhasil diperbarui',
      data: result.rows[0],
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// 5. DELETE
app.delete('/api/kategori/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query(
      'DELETE FROM kategori_laporan WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: 'fail',
        message: `Kategori dengan ID ${id} tidak ditemukan`,
      });
    }

    res.status(200).json({
      status: 'success',
      message: `Kategori dengan ID ${id} berhasil dihapus`,
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});