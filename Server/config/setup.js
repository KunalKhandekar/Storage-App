import mongoose from "mongoose";
import { connectDB } from "./db.js";

await connectDB();
const db = mongoose.connection.db;
const client = mongoose.connection.getClient();

const collections = await db.listCollections().toArray();
const existing = collections.map((c) => c.name);

const validations = [
  {
    collection: "users",
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: [
          "_id",
          "name",
          "picture",
          "email",
          "rootDirId",
          "role",
          "isDeleted",
          "createdWith",
          "canLoginWithPassword",
        ],
        additionalProperties: false,
        properties: {
          _id: {
            bsonType: "objectId",
            description: "_id must be a valid ObjectId",
          },
          name: {
            bsonType: "string",
            minLength: 3,
            description: "Name must be a string with at least 3 characters",
          },
          password: {
            bsonType: "string",
            minLength: 3,
            description: "Password must be a string with at least 3 characters",
          },
          email: {
            bsonType: "string",
            pattern: "^[\\w.-]+@([\\w-]+\\.)+[\\w-]{2,4}$",
            description: "Email must be in valid format",
          },
          rootDirId: {
            bsonType: "objectId",
            description: "rootDirId must be a valid ObjectId",
          },
          picture: {
            bsonType: "string",
          },
          role: {
            bsonType: "string",
            enum: ["SuperAdmin", "Admin", "Manager", "User"],
          },
          isDeleted: {
            bsonType: "bool",
          },
          createdWith: {
            bsonType: "string",
            enum: ["email", "google", "github"],
          },
          canLoginWithPassword: {
            bsonType: "bool",
          },
          google_access_token: {
            bsonType: "string",
          },
          google_refresh_token: {
            bsonType: "string",
          },
          __v: {
            bsonType: "number",
          },
        },
      },
    },
  },
  {
    collection: "directories",
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["_id", "name", "parentDirId", "userId"],
        additionalProperties: false,
        properties: {
          _id: {
            bsonType: "objectId",
            description: "_id must be a valid ObjectId",
          },
          name: {
            bsonType: "string",
            description:
              "name must be a string representing the name of the folder",
          },
          parentDirId: {
            bsonType: ["objectId", "null"],
            description:
              "parentDirId must be a valid ObjectId or null if it's a root folder",
          },
          userId: {
            bsonType: "objectId",
            description:
              "userId must be a valid ObjectId referencing the owner user",
          },
          __v: {
            bsonType: "number",
          },
        },
      },
    },
  },
  {
    collection: "files",
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["_id", "storedName", "userId", "name", "parentDirId"],
        additionalProperties: false,
        properties: {
          _id: {
            bsonType: "objectId",
            description: "_id must be a valid ObjectId",
          },
          storedName: {
            bsonType: "string",
            description:
              "storedName must be a string representing the stored file or folder name",
          },
          userId: {
            bsonType: "objectId",
            description:
              "userId must be a valid ObjectId referencing the owner user",
          },
          name: {
            bsonType: "string",
            description:
              "name must be a string representing the original name of the file or folder",
          },
          parentDirId: {
            bsonType: "objectId",
            description:
              "parentDirId must be a valid ObjectId referencing the parent directory",
          },
          googleFileId: {
            bsonType: "string",
          },
          mimeType: {
            bsonType: "string",
          },
          sharedViaLink: {
            bsonType: "object",
            properties: {
              token: {
                bsonType: "string",
              },
              enabled: {
                bsonType: "bool",
              },
              permission: {
                bsonType: "string",
                enum: ["viewer", "editor"],
              },
              modifiedAt: {
                bsonType: "date",
              }
            },
          },
          sharedWith: {
            bsonType: "array",
            items: {
              bsonType: "object",
              properties: {
                userId: {
                  bsonType: "objectId",
                },
                permission: {
                  bsonType: "string",
                  enum: ["viewer", "editor"],
                },
                sharedAt: {
                  bsonType: "date",
                },
              },
            },
          },
          __v: {
            bsonType: "number",
          },
          createdAt: {
            bsonType: "date"
          },
          updatedAt: {
            bsonType: "date"
          }
        },
      },
    },
  },
];

for await (const v of validations) {
  try {
    if (!existing.includes(v.collection)) {
      await db.createCollection(v.collection);
    }

    await db.command({
      collMod: v.collection,
      validationAction: "error",
      validationLevel: "strict",
      validator: v.validator,
    });
    console.log(`Validation set for collection: ${v.collection}`);
  } catch (err) {
    console.error(`Failed for ${v.collection}:`, err.message);
  }
}

client.close();
