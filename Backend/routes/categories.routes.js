const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const categoriesCtrl = require('../controllers/categories.controller');

//router.post('/', auth, categoriesCtrl.create);
router.get('/', categoriesCtrl.findAll);

router.get('/', async (req, res) => {
    try {
      const allCategories = await categories.findAll();
      
      const categoriesWithAll = [{ id: 0, name: 'Tous' }, ...allCategories];
      
      res.json(categoriesWithAll);
    } catch (error) {
      console.error('Erreur lors de la récupération des catégories:', error);
      res.status(500).json({ message: 'Erreur lors de la récupération des catégories' });
    }
  });

module.exports = router;
