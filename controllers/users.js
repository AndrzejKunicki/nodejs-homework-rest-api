const jwt = require("jsonwebtoken");
const fs = require("fs/promises");
const path = require("path");
const EmailService = require("../services/email");
const Users = require("../repositories/users");
const { HttpCode } = require("../helpers/constants");
const {
  CreateSenderNodemailer,
  CreateSenderSendGrid,
} = require("../services/email-sender");
require("dotenv").config();
//const UploadAvatarService = require("../services/local-upload");
const UploadService = require("../services/cloud-upload");

const SECRET_KEY = process.env.SECRET_KEY;

const register = async (req, res, next) => {
  try {
    const user = await Users.findByEmail(req.body.email);
    if (user) {
      return res.status(HttpCode.CONFLICT).json({
        status: "error",
        code: HttpCode.CONFLICT,
        message: "This email is already used",
      });
    }

    const { id, email, subscription, avatar, verifyToken } = await Users.create(
      req.body
    );
    try {
      const emailService = new EmailService(
        process.env.NODE_ENV,
        new CreateSenderSendGrid()
      );
      const name = "Guest";
      await emailService.sendVerifyEmail(verifyToken, email, name);
    } catch (error) {
      console.log(error.message);
    }

    return res.status(HttpCode.CREATED).json({
      status: "success",
      code: HttpCode.CREATED,
      data: { id, email, subscription, avatar },
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const user = await Users.findByEmail(req.body.email);
    const isValidPassword = await user?.isValidPassword(req.body.password);
    if (!user || !isValidPassword || !user.isVerified) {
      return res.status(HttpCode.UNAUTHORIZED).json({
        status: "error",
        code: HttpCode.UNAUTHORIZED,
        message: "Email or password is wrong",
      });
    }
    const id = user.id;
    const payload = { id };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "2h" });
    await Users.updateToken(id, token);
    return res.json({ status: "success", code: 200, data: { token } });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    const id = req.user.id;
    await Users.updateToken(id, null);
    return res.status(HttpCode.NO_CONTENT).json({});
  } catch (error) {
    next(error);
  }
};

const current = async (req, res, next) => {
  try {
    const user = await Users.findByEmail(req.user.email);
    if (!user) {
      return res.status(HttpCode.UNAUTHORIZED).json({
        status: "error",
        code: HttpCode.UNAUTHORIZED,
        message: "Not authorized",
      });
    }
    const { email, subscription } = req.user;
    const payload = { email, subscription };
    return res.status(HttpCode.OK).json({
      status: "success",
      code: 200,
      data: { payload },
    });
  } catch (error) {
    next(error);
  }
};

/** Local upload
const avatars = async (req, res, next) => {
  try {
    const id = req.user.id;
    const uploads = new UploadAvatarService(process.env.AVATAR_OF_USERS);
    const avatarUrl = await uploads.saveAvatar({ idUser: id, file: req.file });
    try {
      await fs.unlink(path.join(process.env.AVATAR_OF_USERS, req.user.avatar));
    } catch (e) {
      console.log(e.message);
    }

    await Users.updateAvatar(id, avatarUrl);
    res.json({ status: "success", code: 200, data: { avatarUrl } });
  } catch (error) {}
};
 */

const avatars = async (req, res, next) => {
  try {
    const id = req.user.id;
    const uploads = new UploadService();
    const { idCloudAvatar, avatarUrl } = await uploads.saveAvatar(
      req.file.path,
      req.user.idCloudAvatar
    );
    await fs.unlink(path.join(req.file.path));

    await Users.updateAvatar(id, avatarUrl, idCloudAvatar);
    res.json({ status: "success", code: 200, data: { avatarUrl } });
  } catch (error) {
    next(error);
  }
};

const verify = async (req, res, next) => {
  try {
    const user = await Users.findByVerifyToken(req.params.token);
    if (user) {
      await Users.updateTokenVerify(user.id, true, null);
      return res.json({
        status: "success",
        code: 200,
        data: { message: "Success!" },
      });
    }
    return res.status(HttpCode.BAD_REQUEST).json({
      status: "error",
      code: HttpCode.BAD_REQUEST,
      message: "Verification token isn't valid",
    });
  } catch (error) {}
};
const repeatEmailVerification = async (req, res, next) => {
  try {
    const user = await Users.findByEmail(req.body.email);
    if (user) {
      const { email, isVerified, verifyToken } = user;
      if (!isVerified) {
        const emailService = new EmailService(
          process.env.NODE_ENV,
          new CreateSenderNodemailer()
        );
        const name = "Guest";
        await emailService.sendVerifyEmail(verifyToken, email, name);
        return res.json({
          status: "success",
          code: 200,
          data: { message: "Resubmitted success!" },
        });
      }
      return res.status(HttpCode.CONFLICT).json({
        status: "error",
        code: HttpCode.CONFLICT,
        message: "This email has been verified",
      });
    }
    return res.status(HttpCode.NOT_FOUNT).json({
      status: "error",
      code: HttpCode.NOT_FOUNT,
      message: " User not found",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  logout,
  current,
  avatars,
  verify,
  repeatEmailVerification,
};
