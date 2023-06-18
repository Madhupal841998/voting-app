const express = require('express');
const router = express.Router();
const con = require('../db');
const bcrypt = require('bcrypt');

function generateId(type) {
  const genId = new Date().getTime().toString(36).toUpperCase();
  if (genId.length === 8) {
    return (type + '0' + genId).toUpperCase();
  } else if (genId.length === 9) {
    return (type + genId).toUpperCase();
  }
}

// => localhost:3000/api
router.post('/login', async (req, res) => {
  try {
    const { name, password } = req.body;
    const query = 'SELECT * FROM user WHERE name = ?';
    const [rows, _] = await con.promise().query(query, [name]);

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    res.json({ status: true, id: user.id, email: user.email });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/register', async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    const id = generateId('US');
    const created_date = new Date();
    const updated_date = new Date();
    const query = 'SELECT * FROM user WHERE email = ?';
    const [rows, _] = await con.promise().query(query, [email]);

    if (rows.length > 0) {
      return res.status(200).json({ message: 'User email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const insertQuery = 'INSERT INTO user (`id`, `name`, `email`, `password`, `phone`,`created_date`,`updated_date`) VALUES (?, ?, ?, ?, ?,?,?)';
    const values = [id, name, email, hashedPassword, phone, created_date, updated_date];
    await con.promise().query(insertQuery, values);

    res.json({ status: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { name, email, password, phone } = req.body;
    const updateQuery = 'UPDATE user SET `name` = ?, `email` = ?, `password` = ?, `phone` = ? WHERE id = ?';

    const values = [
      name,
      email,
      password,
      phone,
      id
    ];

    await con.promise().query(updateQuery, values);
    res.json({ message: 'Registered successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const deleteQuery = 'DELETE FROM user WHERE id = ?';

    await con.promise().query(deleteQuery, [userId]);
    res.json({ message: 'User has been deleted successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/vote', async (req, res) => {
  try {
    if (!req.body.userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const checkQuery = 'SELECT * FROM vote WHERE userId = ?';
    const [checkRows, _] = await con.promise().query(checkQuery, [req.body.userId]);

    if (checkRows.length > 0) {
      return res.json({ message: 'You have already voted', status: true, voted: false });
    }
    const created_date = new Date();
    const updated_date = new Date();
    const id = generateId('VS');
    const insertQuery = 'INSERT INTO vote (`id`, `userId`, `candidateId`, `created_date`,`updated_date`) VALUES (?, ?, ?, ?, ?)';
    const values = [
      id,
      req.body.userId,
      req.body.candidateId,
      created_date,
      updated_date
    ];

    await con.promise().query(insertQuery, values);
    res.json({ status: true, voted: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/admin', async (req, res) => {
  try {
    const query = `SELECT candidateId, COUNT(DISTINCT userId) AS voteCount FROM vote GROUP BY candidateId`;
    const [rows, _] = await con.promise().query(query);
    res.json({ message: 'Got Vote list successfully.', data: rows ,status:true});
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
