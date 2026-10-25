const express = require("express");

const router = express.Router();

const profileController = require("../controllers/profileController");

const auth = require("../middleware/auth");



// ==========================
// Swagger Tags
// ==========================

/**
 * @swagger
 * tags:
 *   name: Profile
 *   description: User profile management APIs
 */



// ==========================
// Authentication
// ==========================

router.use(auth);




// ==========================
// Profile Routes
// ==========================



/**
 * @swagger
 * /api/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     description: Fetch logged-in user's profile details
 *     responses:
 *       200:
 *         description: Profile fetched successfully
 *       401:
 *         description: Unauthorized
 */
router.get(
    "/",
    profileController.getProfile
);







/**
 * @swagger
 * /api/profile:
 *   put:
 *     summary: Update user profile
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     description: Update personal profile information
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         description: Invalid data
 *       401:
 *         description: Unauthorized
 */
router.put(
    "/",
    profileController.updateProfile
);








/**
 * @swagger
 * /api/profile/photo:
 *   post:
 *     summary: Upload profile photo
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     description: Upload user profile image
 *     responses:
 *       200:
 *         description: Profile photo uploaded successfully
 *       401:
 *         description: Unauthorized
 */
router.post(
    "/photo",
    profileController.uploadPhoto
);








/**
 * @swagger
 * /api/profile/photo:
 *   delete:
 *     summary: Delete profile photo
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     description: Remove existing profile photo
 *     responses:
 *       200:
 *         description: Profile photo deleted successfully
 *       401:
 *         description: Unauthorized
 */
router.delete(
    "/photo",
    profileController.deletePhoto
);



module.exports = router;