const Joi = require("joi");
const mongoose = require("mongoose");

const schemaCreatePerson = Joi.object({
  name: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    })
    .required(),
  phone: Joi.number().required(),
});

const schemaUpdatePerson = Joi.object({
  name: Joi.string().alphanum().min(3).max(30).optional(),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    })
    .optional(),
  phone: Joi.number().optional(),
}).or("name", "email", "phone");

const schemaUpdateStatusPerson = Joi.object({
  favorite: Joi.boolean().required(),
});

const validate = async (schema, obj, next) => {
  try {
    await schema.validateAsync(obj);
    next();
  } catch (err) {
    const value = err.details.map((item) => item.path)[0][0];
    next({
      status: 400,
      message: `missing field ${value}`,
    });
  }
};
module.exports = {
  CreatePerson: (req, res, next) => {
    return validate(schemaCreatePerson, req.body, next);
  },
  UpdatePerson: (req, res, next) => {
    return validate(schemaUpdatePerson, req.body, next);
  },
  UpdateStatusPerson: (req, res, next) => {
    return validate(schemaUpdateStatusPerson, req.body, next);
  },
  ValidateMongoId: (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.contactId)) {
      return next({
        status: 400,
        message: "Invalid ObjectId",
      });
    }
    next();
  },
};
