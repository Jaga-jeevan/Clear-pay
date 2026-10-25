const express = require("express");

const router = express.Router();

const settingsController = require("../controllers/settingsController");

const auth = require("../middleware/auth");



// ==========================
// Swagger Tags
// ==========================

/**
 * @swagger
 * tags:
 *   name: Settings
 *   description: User security and preference settings APIs
 */



// ==========================
// Authentication
// ==========================

router.use(auth);




// ==========================
// Settings Routes
// ==========================





/**
 * @swagger
 * /api/settings:
 *   get:
 *     summary: Get user settings
 *     tags: [Settings]
 *     security:
 *       - bearerAuth: []
 *     description: Fetch logged-in user's application settings
 *     responses:
 *       200:
 *         description: Settings fetched successfully
 *       401:
 *         description: Unauthorized
 */
router.get(
    "/",
    settingsController.getSettings
);








/**
 * @swagger
 * /api/settings:
 *   put:
 *     summary: Update user settings
 *     tags: [Settings]
 *     security:
 *       - bearerAuth: []
 *     description: Update notification and security preferences
 *     responses:
 *       200:
 *         description: Settings updated successfully
 *       400:
 *         description: Invalid settings data
 *       401:
 *         description: Unauthorized
 */
router.put(
    "/",
    settingsController.updateSettings
);








/**
 * @swagger
 * /api/settings/reset:
 *   post:
 *     summary: Reset settings
 *     tags: [Settings]
 *     security:
 *       - bearerAuth: []
 *     description: Restore settings to default values
 *     responses:
 *       200:
 *         description: Settings reset successfully
 *       401:
 *         description: Unauthorized
 */
router.post(
    "/reset",
    settingsController.resetSettings
);








/**
 * @swagger
 * /api/settings/two-factor:
 *   patch:
 *     summary: Toggle two factor authentication
 *     tags: [Settings]
 *     security:
 *       - bearerAuth: []
 *     description: Enable or disable two factor authentication
 *     responses:
 *       200:
 *         description: Two factor authentication updated successfully
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 */
router.patch(
    "/two-factor",
    settingsController.toggleTwoFactor
);



module.exports = router;