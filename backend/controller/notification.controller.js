const {NotificationModel} = require("../models/notification.model");
const mongoose = require("mongoose");
const {UsersModel} = require("../models/user.model");
const {WatchingProductModel} = require("../models/watching.model");


class NotificationsService {
  constructor() {}

  updateNotifications = async () => {
    await NotificationModel.deleteMany();
    const users = await UsersModel.find();
    for (let user of users) {
      const abnormalWatchingItems = await WatchingProductModel.find({
        owner: new mongoose.mongo.ObjectId(user.id),
        diffIndex: {
          $gte: user.alterThreshold
        }
      });

      for (let item of abnormalWatchingItems) {
        await NotificationModel.create({
          message: `${item.name} price diff index is ${item.diffIndex}`,
          watchingItem: item._id,
          user: user._id
        });
      }


    }
  }
}

class NotificationController {
  constructor() {}

  readNotification = async (req, res) => {
    try {
      const {notificationId} = req.params;
      await NotificationModel.findByIdAndUpdate(notificationId, {
        alreadyRead: true
      });
      res.status(200).send();
    } catch (err) {
      console.log(err);
      res.status(500).send(err);
    }
  }

  getNotifications = async (req, res) => {
    try {
      const user = req.user;
      const notifications = await NotificationModel.find({
        user: new mongoose.mongo.ObjectId(user.id),
        alreadyRead: false
      }).sort({createdAt: -1}).populate('watchingItem');
      res.status(200).json(notifications);
    } catch (err) {
      console.log(err);
      res.status(500).send(err);
    }
  }

  getAllNotifications = async (req, res) => {
    try {
      const user = req.user;
      const notifications = await NotificationModel.find({
        user: new mongoose.mongo.ObjectId(user.id),
      }).sort({createdAt: -1}).populate('watchingItem');
      res.status(200).json(notifications);
    } catch (err) {
      console.log(err);
      res.status(500).send(err);
    }
  }

  getMarkedNotifications = async (req, res) => {
    try {
      const user = req.user;
      const notifications = await NotificationModel.find({
        user: new mongoose.mongo.ObjectId(user.id),
        marked: true
      }).sort({createdAt: -1}).populate('watchingItem');
      res.status(200).json(notifications);
    } catch (err) {
      console.log(err);
      res.status(500).send(err);
    }
  }


  markNotification = async (req, res) => {
    try {
      const {notificationId} = req.params;
      await NotificationModel.findByIdAndUpdate(notificationId, {
        marked: true
      });
      res.status(200).send();
    } catch (err) {
      console.log(err);
      res.status(500).send(err);
    }
  }

  unMarkNotification = async (req, res) => {
    try {
      const {notificationId} = req.params;
      await NotificationModel.findByIdAndUpdate(notificationId, {
        marked: false
      });
      res.status(200).send();
    } catch (err) {
      console.log(err);
      res.status(500).send(err);
    }
  }
}

module.exports = {
  NotificationController: new NotificationController(),
  NotificationsService: new NotificationsService()
}