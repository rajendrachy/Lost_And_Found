const { body, validationResult } = require('express-validator');

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

const createItemValidation = [
    body('type').isIn(['lost', 'found']).withMessage('Type must be lost or found'),
    body('title').trim().notEmpty().withMessage('Title is required').isLength({ min: 3, max: 100 }).withMessage('Title must be 3-100 characters'),
    body('category').trim().notEmpty().withMessage('Category is required').isIn(['Electronics', 'Pets', 'Documents', 'Accessories', 'Keys', 'Bags', 'Others']),
    body('location').trim().notEmpty().withMessage('Location is required').isLength({ min: 3, max: 100 }),
    body('date').isISO8601().withMessage('Valid date is required'),
    body('description').trim().notEmpty().withMessage('Description is required').isLength({ min: 10, max: 500 }),
    body('reward').optional(),
    validate
];

const claimValidation = [
    body('message').trim().notEmpty().withMessage('Message is required').isLength({ min: 10, max: 500 }),
    body('phone').optional().trim(),
    body('email').optional().trim(),
    validate
];

const verifyClaimValidation = [
    body('claimId').notEmpty().withMessage('Claim ID is required'),
    validate
];

const confirmRecoveryValidation = [
    body('story').optional().trim().isLength({ max: 500 }),
    validate
];

module.exports = {
    createItemValidation,
    claimValidation,
    verifyClaimValidation,
    confirmRecoveryValidation,
    validate
};