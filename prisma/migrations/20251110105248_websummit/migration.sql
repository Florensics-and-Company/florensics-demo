/*
  Warnings:

  - You are about to alter the column `flame` on the `Sensor` table. The data in that column could be lost. The data in that column will be cast from `String` to `Float`.
  - You are about to alter the column `hum` on the `Sensor` table. The data in that column could be lost. The data in that column will be cast from `String` to `Float`.
  - You are about to alter the column `temp` on the `Sensor` table. The data in that column could be lost. The data in that column will be cast from `String` to `Float`.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Sensor" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "alert" BOOLEAN NOT NULL DEFAULT false,
    "temp" REAL,
    "hum" REAL,
    "flame" REAL,
    "flameBinary" BOOLEAN,
    "gas" REAL,
    "image" TEXT
);
INSERT INTO "new_Sensor" ("alert", "flame", "hum", "id", "image", "temp") SELECT "alert", "flame", "hum", "id", "image", "temp" FROM "Sensor";
DROP TABLE "Sensor";
ALTER TABLE "new_Sensor" RENAME TO "Sensor";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
