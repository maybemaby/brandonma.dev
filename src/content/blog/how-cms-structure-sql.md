---
title: How Headless CMS Structure SQL
publishedAt: 2024-11-08
previewText: PostGIS is a PostgreSQL extension that adds features for storing, indexing, and querying geospatial data. It's pretty nice that you can get these features in Postgres which is already a powerful database. I couldn't find much
metaDescription: Exploring how open source CMS structure and manage their SQL databases.
draft: true
---

# How CMS Structure SQL

Published on 2024-11-08

## Table of Contents

## Introduction


### The content model

For this post, I'll be trying to replicate the same content model across these CMS. 

I imagine representing it something like this in SQL:

```sql
CREATE table parts (
  part_number TEXT NOT NULL PRIMARY KEY,
  description TEXT NOT NULL,
  revision INT NOT NULL DEFAULT 1,
  is_assembly BOOLEAN NOT NULL DEFAULT FALSE,
  parent_part_number TEXT REFERENCES parts(part_number)
);
```

## Strapi

Strapi is a popular headless CMS which proposes to provide a high degree of customization. It provides a nice web UI for administration that translates to a REST or GraphQL API for developers to consume.

The databases it supports is MySQL, PostgreSQL, SQLite, and MariaDB. The main modeling concept in Strapi is "Content-types." These are basically a set of named fields. Most of them can be directly mapped to a SQL column type, but there are some exceptions like Components and Dynamic zones.

![Strapi Content-type builder](/strapi-fields.webp)

I found Strapi has some meta-tables which maintains information about the current state of the content-types and their fields. There's a `strapi_database_schema` table which contains a `schema` column that stores a JSON represntation of the table structure. Instead of defining foreign keys directly in the generated table,
relationships create a separate link table.

```json
{
  "tables": [
    {
      "name": "parts",
      "indexes": [
        {
          "name": "parts_documents_idx",
          "columns": ["document_id", "locale", "published_at"]
        },
        { "name": "parts_created_by_id_fk", "columns": ["created_by_id"] },
        { "name": "parts_updated_by_id_fk", "columns": ["updated_by_id"] }
      ],
      "foreignKeys": [
        {
          "name": "parts_created_by_id_fk",
          "columns": ["created_by_id"],
          "referencedTable": "admin_users",
          "referencedColumns": ["id"],
          "onDelete": "SET NULL"
        },
        {
          "name": "parts_updated_by_id_fk",
          "columns": ["updated_by_id"],
          "referencedTable": "admin_users",
          "referencedColumns": ["id"],
          "onDelete": "SET NULL"
        }
      ],
      "columns": [
        {
          "name": "id",
          "type": "increments",
          "args": [{ "primary": true, "primaryKey": true }],
          "defaultTo": null,
          "notNullable": true,
          "unsigned": false
        },
        {
          "name": "document_id",
          "type": "string",
          "args": [],
          "defaultTo": null,
          "notNullable": false,
          "unsigned": false
        },
        {
          "name": "description",
          "type": "string",
          "args": [],
          "defaultTo": null,
          "notNullable": false,
          "unsigned": false
        },
        {
          "name": "revision",
          "type": "integer",
          "args": [],
          "defaultTo": null,
          "notNullable": false,
          "unsigned": false
        },
        {
          "name": "part_number",
          "type": "string",
          "args": [],
          "defaultTo": null,
          "notNullable": false,
          "unsigned": false
        },
        {
          "name": "is_assembly",
          "type": "boolean",
          "args": [],
          "defaultTo": null,
          "notNullable": false,
          "unsigned": false
        },
        {
          "name": "created_at",
          "type": "datetime",
          "args": [{ "useTz": false, "precision": 6 }],
          "defaultTo": null,
          "notNullable": false,
          "unsigned": false
        },
        {
          "name": "updated_at",
          "type": "datetime",
          "args": [{ "useTz": false, "precision": 6 }],
          "defaultTo": null,
          "notNullable": false,
          "unsigned": false
        },
        {
          "name": "published_at",
          "type": "datetime",
          "args": [{ "useTz": false, "precision": 6 }],
          "defaultTo": null,
          "notNullable": false,
          "unsigned": false
        },
        {
          "name": "created_by_id",
          "type": "integer",
          "args": [],
          "defaultTo": null,
          "notNullable": false,
          "unsigned": true
        },
        {
          "name": "updated_by_id",
          "type": "integer",
          "args": [],
          "defaultTo": null,
          "notNullable": false,
          "unsigned": true
        },
        {
          "name": "locale",
          "type": "string",
          "args": [],
          "defaultTo": null,
          "notNullable": false,
          "unsigned": false
        }
      ]
    },
    {
      "name": "parts_parent_part_number_lnk",
      "indexes": [
        { "name": "parts_parent_part_number_lnk_fk", "columns": ["part_id"] },
        {
          "name": "parts_parent_part_number_lnk_ifk",
          "columns": ["inv_part_id"]
        },
        {
          "name": "parts_parent_part_number_lnk_uq",
          "columns": ["part_id", "inv_part_id"],
          "type": "unique"
        }
      ],
      "foreignKeys": [
        {
          "name": "parts_parent_part_number_lnk_fk",
          "columns": ["part_id"],
          "referencedColumns": ["id"],
          "referencedTable": "parts",
          "onDelete": "CASCADE"
        },
        {
          "name": "parts_parent_part_number_lnk_ifk",
          "columns": ["inv_part_id"],
          "referencedColumns": ["id"],
          "referencedTable": "parts",
          "onDelete": "CASCADE"
        }
      ],
      "columns": [
        {
          "name": "id",
          "type": "increments",
          "args": [{ "primary": true, "primaryKey": true }],
          "defaultTo": null,
          "notNullable": true,
          "unsigned": false
        },
        {
          "name": "part_id",
          "type": "integer",
          "args": [],
          "defaultTo": null,
          "notNullable": false,
          "unsigned": true
        },
        {
          "name": "inv_part_id",
          "type": "integer",
          "args": [],
          "defaultTo": null,
          "notNullable": false,
          "unsigned": true
        }
      ]
    }
  ]
}
```
