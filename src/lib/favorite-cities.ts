import fs from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { fileURLToPath } from "node:url";

import * as z from "zod/v4";

const dataDirectory = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../data",
);

const FAVORITE_CITIES_FILE = "favorite-cities.json";

const CITY_NAME_PATTERN =
  /^[\p{L}\p{M}]+(?:[ .\-’'][\p{L}\p{M}]+)*$/u;

const favoriteCityEntrySchema = z
  .string()
  .trim()
  .min(1)
  .max(100)
  .regex(
    CITY_NAME_PATTERN,
    "City can only include letters, spaces, periods, apostrophes, and hyphens.",
  );

const favoriteCitiesStoreSchema = z.object({
  favorites: z.array(favoriteCityEntrySchema).default([]),
});

type FavoriteCitiesStore = z.infer<typeof favoriteCitiesStoreSchema>;

export interface FavoriteCitiesStorageOptions {
  storagePath?: string;
}

function resolveFavoriteCitiesPath(storagePath?: string): string {
  if (storagePath) {
    return path.resolve(storagePath);
  }

  return path.resolve(dataDirectory, FAVORITE_CITIES_FILE);
}

function normalizeCityName(city: string): string {
  return city.trim().replace(/\s+/g, " ");
}

function dedupeFavoriteCities(favorites: string[]): string[] {
  const seen = new Set<string>();
  const uniqueFavorites: string[] = [];

  for (const favorite of favorites) {
    const normalizedFavorite = normalizeCityName(favorite);

    if (!normalizedFavorite) {
      continue;
    }

    const key = normalizedFavorite.toLowerCase();

    if (seen.has(key)) {
      continue;
    }

    seen.add(key);
    uniqueFavorites.push(normalizedFavorite);
  }

  return uniqueFavorites;
}

function isMissingFileError(error: unknown): boolean {
  return (
    error instanceof Error &&
    "code" in error &&
    String((error as NodeJS.ErrnoException).code ?? "") === "ENOENT"
  );
}

async function readFavoriteCitiesStore(
  storagePath?: string,
): Promise<FavoriteCitiesStore> {
  const filePath = resolveFavoriteCitiesPath(storagePath);

  try {
    const rawText = await fs.readFile(filePath, "utf8");

    if (rawText.trim() === "") {
      return { favorites: [] };
    }

    const parsed = JSON.parse(rawText) as unknown;
    const store = favoriteCitiesStoreSchema.parse(parsed);

    return {
      favorites: dedupeFavoriteCities(store.favorites),
    };
  } catch (error) {
    if (isMissingFileError(error)) {
      return { favorites: [] };
    }

    if (error instanceof SyntaxError) {
      throw new Error("FAVORITE_CITIES_DATA_ERROR");
    }

    if (error instanceof z.ZodError) {
      throw new Error("FAVORITE_CITIES_DATA_ERROR");
    }

    throw new Error("FAVORITE_CITIES_STORAGE_ERROR");
  }
}

async function writeFavoriteCitiesStore(
  storagePath: string | undefined,
  store: FavoriteCitiesStore,
): Promise<void> {
  const filePath = resolveFavoriteCitiesPath(storagePath);
  const fileDirectory = path.dirname(filePath);
  const temporaryPath = `${filePath}.${randomUUID()}.tmp`;

  await fs.mkdir(fileDirectory, { recursive: true });

  try {
    await fs.writeFile(
      temporaryPath,
      `${JSON.stringify({ favorites: dedupeFavoriteCities(store.favorites) }, null, 2)}\n`,
      "utf8",
    );
    await fs.rename(temporaryPath, filePath);
  } catch {
    await fs.rm(temporaryPath, { force: true });
    throw new Error("FAVORITE_CITIES_STORAGE_ERROR");
  }
}

export async function listFavoriteCities(
  options: FavoriteCitiesStorageOptions = {},
): Promise<{ favorites: string[] }> {
  const store = await readFavoriteCitiesStore(options.storagePath);

  return {
    favorites: store.favorites,
  };
}

export async function saveFavoriteCity(
  city: string,
  options: FavoriteCitiesStorageOptions = {},
): Promise<{
  success: boolean;
  savedCity: string;
  favorites: string[];
  duplicate: boolean;
}> {
  const favoriteCity = normalizeCityName(city);

  if (!favoriteCity) {
    throw new Error("INVALID_FAVORITE_CITY");
  }

  const store = await readFavoriteCitiesStore(options.storagePath);
  const existingFavorite = store.favorites.find(
    (favorite) => favorite.toLowerCase() === favoriteCity.toLowerCase(),
  );

  if (existingFavorite) {
    return {
      success: true,
      savedCity: existingFavorite,
      favorites: store.favorites,
      duplicate: true,
    };
  }

  const updatedStore: FavoriteCitiesStore = {
    favorites: [...store.favorites, favoriteCity],
  };

  await writeFavoriteCitiesStore(options.storagePath, updatedStore);

  return {
    success: true,
    savedCity: favoriteCity,
    favorites: dedupeFavoriteCities(updatedStore.favorites),
    duplicate: false,
  };
}