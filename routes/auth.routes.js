const express = require('express');
const router = express.Router();
const { login, registration } = require('../controllers/auth.controller');
const  upload  = require('../middleware/multer')

router.route('/api/login').post(login);
router.route("/api/register").post(upload.single('file'),registration);

module.exports = router;
