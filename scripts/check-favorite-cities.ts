/// <reference types="node" />

import { strict as assert } from "node:assert";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import { listFavoriteCitiesInputSchema } from "../src/schemas/list-favorite-cities.js";
import { saveFavoriteCityInputSchema } from "../src/schemas/save-favorite-city.js";
import {
  listFavoriteCities,
  saveFavoriteCity,
} from "../src/lib/favorite-cities.js";

async function main() {
  const tempDirectory = await fs.mkdtemp(
    path.join(os.tmpdir(), "weather-favorite-cities-"),
  );
  const storagePath = path.join(tempDirectory, "favorite-cities.json");

  const emptyList = await listFavoriteCities({ storagePath });
  assert.deepEqual(emptyList.favorites, []);
  console.log("1/6 empty list ok");

  const validSave = await saveFavoriteCity("Hebron", { storagePath });
  assert.equal(validSave.success, true);
  assert.equal(validSave.savedCity, "Hebron");
  assert.equal(validSave.duplicate, false);
  assert.deepEqual(validSave.favorites, ["Hebron"]);
  console.log("2/6 valid save ok");

  const duplicateSave = await saveFavoriteCity("hebron", { storagePath });
  assert.equal(duplicateSave.success, true);
  assert.equal(duplicateSave.savedCity, "Hebron");
  assert.equal(duplicateSave.duplicate, true);
  assert.deepEqual(duplicateSave.favorites, ["Hebron"]);
  console.log("3/6 duplicate handling ok");

  const listedFavorites = await listFavoriteCities({ storagePath });
  assert.deepEqual(listedFavorites.favorites, ["Hebron"]);
  console.log("4/6 valid list ok");

  assert.equal(
    saveFavoriteCityInputSchema.safeParse({ city: "" }).success,
    false,
  );
  assert.equal(
    saveFavoriteCityInputSchema.safeParse({ city: "   " }).success,
    false,
  );
  assert.equal(
    saveFavoriteCityInputSchema.safeParse({ city: 42 }).success,
    false,
  );
  assert.equal(
    saveFavoriteCityInputSchema.safeParse({ city: "Hebron" }).success,
    true,
  );
  assert.equal(listFavoriteCitiesInputSchema.safeParse({}).success, true);
  console.log("5/6 schema validation ok");

  const malformedStoragePath = path.join(
    tempDirectory,
    "malformed-favorite-cities.json",
  );
  await fs.writeFile(malformedStoragePath, "{", "utf8");

  await assert.rejects(
    () => listFavoriteCities({ storagePath: malformedStoragePath }),
    /FAVORITE_CITIES_DATA_ERROR/,
  );
  console.log("6/6 malformed storage rejected");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});