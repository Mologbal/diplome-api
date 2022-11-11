const router = require('express').Router();
const { updateUserValidation } = require('../validation/users');

const {
  getUserInfo,
  updateUserInfo,
} = require('../controllers/users');

router.get('/users/me', getUserInfo);
router.patch('/users/me', updateUserValidation, updateUserInfo);

module.exports = router;
