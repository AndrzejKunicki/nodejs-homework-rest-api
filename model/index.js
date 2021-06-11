const fs = require("fs/promises");
// const contacts = require("./contacts.json");
const path = require("path");
const { v4: uuid } = require("uuid");

const readData = async () => {
  const data = await fs.readFile(path.join(__dirname, "contacts.json"), "utf8");
  console.log(data);
  return JSON.parse(data);
};

const listContacts = async () => {
  return await readData();
};

const getContactById = async (contactId) => {
  const data = await readData();
  const [result] = data.filter((contact) => contactId === contact.id);
  return result;
};

const removeContact = async (contactId) => {
  const data = await readData();
  const index = data.findIndex((contact) => contactId === contact.id);
  //const result = await getContactById(contactId);
  //const newData = data.filter((contact) => contactId !== contact.id);
  if (index !== -1) {
    const result = data.splice(index, 1);
    await fs.writeFile(
      path.join(__dirname, "contacts.json"),
      JSON.stringify(data)
    );
  }
  return null;
};

const addContact = async (body) => {
  const id = uuid();
  const record = {
    id,
    ...body,
  };
  const data = await readData();
  data.push(record);
  await fs.writeFile(
    path.join(__dirname, "contacts.json"),
    JSON.stringify(data, null, 2)
  );
  return record;
};

const updateContact = async (contactId, body) => {
  const data = await readData();
  const [result] = data.filter((contact) => contactId === contact.id);

  if (result) {
    Object.assign(result, body);
    await fs.writeFile(
      path.join(__dirname, "contacts.json"),
      JSON.stringify(data, null, 2)
    );
  }

  return result;
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
