const express = require("express");
const {verifyUser} = require("../middlewares/verifyAuth");
const {NotificationController} = require("../controller/notification.controller");
const {protectedRoute} = require("../middlewares/passport");

const router = express.Router();

router.get('', protectedRoute, NotificationController.getNotifications);
router.get('/all', protectedRoute, NotificationController.getAllNotifications);
router.get('/marked', protectedRoute, NotificationController.getMarkedNotifications);
router.put('/:notificationId', protectedRoute, NotificationController.readNotification);
router.put('/:notificationId/mark', protectedRoute, NotificationController.markNotification);
router.put("/:notificationId/unmark", protectedRoute, NotificationController.unMarkNotification);

module.exports = router;