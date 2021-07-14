const { Subscription } = require("../../helpers/constants");

const newContact = {
  name: "Alexqwer",
  email: "alex@gmail.com",
  phone: "123456789",
};

const newUser = {
  password: "12qwqd3456",
  email: "qwerty@gmail.com",
  subscription: Subscription.STARTER,
};

const newTestUser = {
  password: "12test3456",
  email: "qwertytest@gmail.com",
  subscription: Subscription.STARTER,
};

module.exports = { newContact, newUser, newTestUser };
