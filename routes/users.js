const router = require('express').Router();
const { updateUserValidation } = require('../validation/users');

const {
  getCurrentUser,
  updateUser,
} = require('../controllers/users');

router.get('/users/me', getCurrentUser);
router.patch('/users/me', updateUserValidation, updateUser);

module.exports = router;
