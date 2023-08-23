
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {UsersModel} = require("../models/user.model");
const mongoose = require("mongoose");
const {signUpConfirmEmail, resetPasswordLinkEmail} = require("../services/sendEmailService");
const {WatchingProductModel} = require("../models/watching.model");
class UsersController {
  constructor() {}

  getProfile = async (req, res) => {
    try {
      const user = req.user;
      const profile = await UsersModel.findById(user.id);
      res.status(200).json(profile);
    } catch (err) {
      res.status(500).send(err);
    }
  }

  updateProfile = async (req, res) => {
    try {
      const user = req.user;
      const {username, email, password, phoneNumber, avatar} = req.body;
      const userObject = await UsersModel.findById(user.id);
      userObject.username = username;
      userObject.email = email;
      userObject.phoneNumber = phoneNumber;
      userObject.avatar = avatar;
      if (password) {
        userObject.passwordHash = await bcrypt.hash(password, 10)
      }
      await userObject.save();
      res.status(200).send();

    } catch (err) {
      res.status(500).send(err);
    }
  }

  async confirmEmail(req, res) {
    try {
      const {token} = req.query;
      if (!token) {
        return res.status(403).send('Forbidden');
      }
      const confirmData = jwt.verify(token, process.env.JWT_SECRET);
      const email = confirmData.email;
      await UsersModel.findOneAndUpdate({
        email
      }, {
        $set: {
          active: true
        }
      });
      res.status(200).send("Confirm successfully!");

    } catch (err) {
      res.status(500).send(err.message);
    }
  }

  async getProfile(req, res) {
    try {
      const user = req.user;
      const profile = await UsersModel.findById(user.id.toString());
      if (!profile) {
        return res.status(401).send('Invalid token');
      }
      res.status(200).json(profile);
    } catch (err) {
      res.status(500).send(err.message);
    }
  }

  async signUp(req, res) {
    try {
      let newUser;
      const user = req.body;
      let oldUser = await UsersModel.findOne({
        email: user.email
      });
      // check user if exist
      if (oldUser) {

        if (oldUser.active) {
          return res.status(409).send("User already exist. Please login.");
        } else {
          return res.status(410).send("User already exist but not active.");
        }
      }


      // create new user
      user.passwordHash = await bcrypt.hash(user.password, 10);
      newUser = await UsersModel.create(user);
      const confirmToken = jwt.sign({
        email: newUser.email
      }, process.env.JWT_SECRET);
      await signUpConfirmEmail(user.email, confirmToken);
      let token = jwt.sign({
        email: newUser.email,
        username: newUser.username,
        id: newUser._id
      }, process.env.JWT_SECRET)
      res.status(201).json({
        token
      });
    } catch (err) {
      console.log(err)
      res.status(500).send(err.message);
    }
  }

  async signIn(req, res) {
    try {
      let oldUser,
        token;
      const {email, password} = req.body;
      // check user if exist
      oldUser = await UsersModel.findOne({
        email
      })
      if (!oldUser) {
        return res.status(400).send("Invalid Credentials");
      }

      if (!oldUser.active) {
        return res.status(401).send("Please go to your email and active your account!");
      }

      // check password if correct
      if (await bcrypt.compare(password, oldUser.passwordHash)) {
        token = jwt.sign({
          email: oldUser.email,
          username: oldUser.username,
          id: oldUser._id
        }, process.env.JWT_SECRET)
      } else {
        return res.status(400).send("Invalid Credentials");
      }
      res.status(200).json({
        token,
        userData: oldUser
      });
    } catch (err) {
      res.status(500).send(err);
    }
  }

  async generateResetPasswordLink(req, res) {
    try {
      const {email} = req.body;
      const user = await UsersModel.findOne({
        email
      });
      if (!user) {
        return res.status(404).send();
      }
      const resetToken = jwt.sign({
        id: user._id,
      }, process.env.JWT_SECRET);

      await resetPasswordLinkEmail(email, resetToken);
      res.status(200).send();

    } catch (err) {
      return res.status(500).send(err);
    }
  }

  async resetPassword(req, res) {
    try {
      const {email, newPassword, resetToken} = req.body;
      const resetData = jwt.verify(resetToken, process.env.JWT_SECRET);
      const user = await UsersModel.findById(resetData.id);
      if (!user || user.email !== email) {
        return res.status(403).send();
      }
      user.passwordHash = await bcrypt.hash(newPassword, 10);
      await user.save();
      res.status(200).send();
    } catch (err) {
      console.log(err)
      return res.status(500).send(err);
    }
  }

  updateSetting = async (req, res) => {
    try {
      const user = req.user;
      const {notification, alterThreshold, mode} = req.body;
      await UsersModel.findByIdAndUpdate(user.id, {
        notification,
        alterThreshold,
        mode
      });
      res.status(200).send();
    } catch (err) {
      console.log(err)
      return res.status(500).send(err);
    }
  }

  getNotification = async (req, res) => {
    try {
      const user = req.user;
      const settings = await UsersModel.findById(user.id);
      const abnormalWatchingItems = await WatchingProductModel.find({
        owner: new mongoose.mongo.ObjectId(user.id),
        diffIndex: {
          $gte: settings.alterThreshold
        }
      });
      res.status(200).json(abnormalWatchingItems);
    } catch (err) {
      console.log(err)
      return res.status(500).send(err);
    }
  }
}

module.exports = {
  UsersController: new UsersController()
};
