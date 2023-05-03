migrate((db) => {
  const collection = new Collection({
    "id": "9tnrdt78ftbbatv",
    "created": "2023-05-03 08:23:36.435Z",
    "updated": "2023-05-03 08:23:36.435Z",
    "name": "items",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "sc0ix1vf",
        "name": "name",
        "type": "text",
        "required": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "djjnhdtk",
        "name": "createdAt",
        "type": "text",
        "required": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      }
    ],
    "indexes": [],
    "listRule": "",
    "viewRule": "",
    "createRule": "",
    "updateRule": "",
    "deleteRule": "",
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("9tnrdt78ftbbatv");

  return dao.deleteCollection(collection);
})
