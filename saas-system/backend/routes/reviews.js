// routes/reviews.js
const express = require('express');
const router = express.Router();
const Review = require('../models/Review'); // Importujemy model Review
const { body, validationResult } = require('express-validator');
const verifyToken = require('../middleware/verifyToken');

router.post(
    '/',
    verifyToken,
    [
        body('service_id').isInt().withMessage('Service ID musi być liczbą całkowitą.'),
        body('user_id').isInt().withMessage('User ID musi być liczbą całkowitą.'),
        body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating musi być liczbą całkowitą od 1 do 5.'),
        body('comment').isString().withMessage('Comment musi być ciągiem znaków.'),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { service_id, user_id, rating, comment } = req.body;

            if (req.user.id !== user_id) {
                return res.status(403).json({ message: 'Brak uprawnień do dodania recenzji dla tego użytkownika' });
            }

            const insertId = await Review.create({ service_id, user_id, rating, comment });
            res.status(201).json({ message: 'Recenzja dodana pomyślnie.', insertId });
        } catch (error) {
            console.error('Błąd dodawania recenzji:', error);
            res.status(500).json({ message: 'Błąd serwera.' });
        }
    }
);

router.get('/', async (req, res) => {
    try {
        const reviews = await Review.getAll();
        res.json(reviews);
    } catch (error) {
        console.error('Błąd pobierania recenzji:', error);
        res.status(500).json({ message: 'Błąd serwera.' });
    }
});

router.put('/:id/moderate', verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        await Review.moderate(id, status);
        res.json({ message: 'Recenzja zmoderowana pomyślnie.' });
    } catch (error) {
        console.error('Błąd moderowania recenzji:', error);
        res.status(500).json({ message: 'Błąd serwera.' });
    }
});

module.exports = router;