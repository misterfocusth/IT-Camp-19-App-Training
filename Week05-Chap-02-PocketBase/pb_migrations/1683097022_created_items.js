migrate((db) => {
  const collection = new Collection({
    "id": "qgby7r1ijod4i3i",
    "created": "2023-05-03 06:57:02.975Z",
    "updated": "2023-05-03 06:57:02.975Z",
    "name": "items",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "h3o8t6bo",
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
        "id": "oxnmjquj",
        "name": "createdAt",
        "type": "date",
        "required": false,
        "unique": false,
        "options": {
          "min": "",
          "max": ""
        }
      }
    ],
    "indexes": [],
    "listRule": null,
    "viewRule": null,
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("qgby7r1ijod4i3i");

  return dao.deleteCollection(collection);
})
