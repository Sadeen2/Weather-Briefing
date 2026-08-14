import { motion, useReducedMotion } from "framer-motion";
import { useDeferredValue, useEffect, useMemo, useState, useTransition } from "react";
import { MoonStar, ThermometerSnowflake } from "lucide-react";
import { AppShell } from "./components/AppShell";
import { CitySearch } from "./components/CitySearch";
import { SectionHeader } from "./components/SectionHeader";
import { BriefingSection } from "./sections/BriefingSection";
import { CurrentWeatherSection } from "./sections/CurrentWeatherSection";
import { ForecastSection } from "./sections/ForecastSection";
import { CompareSection } from "./sections/CompareSection";
import { AlertsSection } from "./sections/AlertsSection";
import { FavoritesSection } from "./sections/FavoritesSection";
import { ToolsSection } from "./sections/ToolsSection";
import {
  compareWeather,
  createWeatherBriefing,
  getFavoriteSummaries,
  getForecast,
  getWeather,
  getWeatherAlerts,
  listFavoriteCities,
  saveFavoriteCity,
  searchCity,
} from "./services/cirra";
import type {
  BriefingResult,
  CompareWeatherResult,
  CurrentWeather,
  ForecastResult,
  GeoCity,
  TemperatureUnit,
  WeatherAlertsResult,
} from "./types/cirra";

const DEFAULT_CITY = "Hebron";
const FALLBACK_COMPARE_CITY = "Amman";

type ToolError = { message: string };

function isToolError(result: unknown): result is ToolError {
  return (
    typeof result === "object" &&
    result !== null &&
    "message" in result &&
    (result as { message?: string }).message === "LOCATION_NOT_FOUND"
  );
}

export default function App() {
  const reduceMotion = useReducedMotion();
  const [query, setQuery] = useState(DEFAULT_CITY);
  const deferredQuery = useDeferredValue(query);
  const [selectedCity, setSelectedCity] = useState(DEFAULT_CITY);
  const [units, setUnits] = useState<TemperatureUnit>("celsius");
  const [suggestions, setSuggestions] = useState<GeoCity[]>([]);
  const [currentWeather, setCurrentWeather] = useState<CurrentWeather | null>(null);
  const [forecast, setForecast] = useState<ForecastResult | null>(null);
  const [briefing, setBriefing] = useState<BriefingResult | null>(null);
  const [alerts, setAlerts] = useState<WeatherAlertsResult | null>(null);
  const [comparison, setComparison] = useState<CompareWeatherResult | null>(null);
  const [compareCity1, setCompareCity1] = useState(DEFAULT_CITY);
  const [compareCity2, setCompareCity2] = useState(FALLBACK_COMPARE_CITY);
  const [favoriteCities, setFavoriteCities] = useState<CurrentWeather[]>([]);
  const [favoriteNames, setFavoriteNames] = useState<string[]>([]);
  const [isSearching, startSearchTransition] = useTransition();
  const [isLoadingCity, setIsLoadingCity] = useState(true);
  const [isComparing, setIsComparing] = useState(false);
  const [isSavingFavorite, setIsSavingFavorite] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string>("Looking at the sky over Hebron...");

  const searchHint = useMemo(() => {
    if (suggestions.length > 0) {
      return `${suggestions[0].name}, ${suggestions[0].country}`;
    }

    return "Search a city to begin";
  }, [suggestions]);

  useEffect(() => {
    let active = true;

    void (async () => {
      const result = await searchCity(deferredQuery);

      if (!active) {
        return;
      }

      setSuggestions(result.results);
    })();

    return () => {
      active = false;
    };
  }, [deferredQuery]);

  useEffect(() => {
    void loadCity(selectedCity);
    void loadComparison(compareCity1, compareCity2);
    void refreshFavorites();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [units]);

  useEffect(() => {
    void loadCity(DEFAULT_CITY);
    void loadComparison(DEFAULT_CITY, FALLBACK_COMPARE_CITY);
    void refreshFavorites();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadCity(city: string) {
    setIsLoadingCity(true);
    setStatusMessage(`Looking at the sky over ${city}...`);

    const [weatherResult, forecastResult, briefingResult, alertsResult] = await Promise.all([
      getWeather(city, units),
      getForecast(city, 7, units),
      createWeatherBriefing(city, 1, units),
      getWeatherAlerts(city),
    ]);

    if (
      isToolError(weatherResult) ||
      isToolError(forecastResult) ||
      isToolError(briefingResult) ||
      isToolError(alertsResult)
    ) {
      setStatusMessage("We couldn't find that city. Check the spelling and try again.");
      setCurrentWeather(null);
      setForecast(null);
      setBriefing(null);
      setAlerts(null);
      setIsLoadingCity(false);
      return;
    }

    const weather = weatherResult as CurrentWeather;
    const forecastData = forecastResult as ForecastResult;
    const briefingData = briefingResult as BriefingResult;
    const alertsData = alertsResult as WeatherAlertsResult;

    setCurrentWeather(weather);
    setForecast(forecastData);
    setBriefing(briefingData);
    setAlerts(alertsData);
    setSelectedCity(weather.location.name);
    setQuery(weather.location.name);
    setCompareCity1(weather.location.name);
    setStatusMessage("Cirra found a clear view of the sky.");
    setIsLoadingCity(false);
    await refreshFavorites();
  }

  async function loadComparison(cityA: string, cityB: string) {
    setIsComparing(true);
    const result = await compareWeather(cityA, cityB, units);
    if (!isToolError(result)) {
      setComparison(result as CompareWeatherResult);
    }
    setIsComparing(false);
  }

  async function refreshFavorites() {
    const favorites = await listFavoriteCities();
    setFavoriteNames(favorites.favorites);
    setFavoriteCities(await getFavoriteSummaries(units));
  }

  async function submitSearch(value?: string) {
    const nextValue = value ?? query;
    const result = await searchCity(nextValue);
    const city = result.results[0];

    if (!city) {
      setStatusMessage("We couldn't find that city. Check the spelling and try again.");
      setCurrentWeather(null);
      setForecast(null);
      setBriefing(null);
      setAlerts(null);
      setSuggestions([]);
      return;
    }

    startSearchTransition(() => {
      setQuery(city.name);
      setSelectedCity(city.name);
    });

    await loadCity(city.name);
  }

  async function handleSaveFavorite() {
    if (!selectedCity || isSavingFavorite) {
      return;
    }

    setIsSavingFavorite(true);
    await saveFavoriteCity(selectedCity);
    await refreshFavorites();
    setIsSavingFavorite(false);
    setStatusMessage(`${selectedCity} has been saved to favorites.`);
  }

  async function handleCompare() {
    await loadComparison(compareCity1, compareCity2);
  }

  async function handlePickFavorite(city: string) {
    setQuery(city);
    setSelectedCity(city);
    await loadCity(city);
  }

  const loadingBriefing = isLoadingCity || isSearching;

  return (
    <AppShell>
      <div className="space-y-10">
        <section id="weather" className="pt-4 sm:pt-6">
          <div className="mx-auto max-w-4xl text-center">
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: "easeOut" }}
              className="inline-flex items-center gap-2 rounded-full border border-white/75 bg-white/70 px-4 py-2 text-sm font-semibold text-cirra-muted shadow-soft backdrop-blur-xl"
            >
              <MoonStar className="h-4 w-4 text-sky-600" />
              Lightweight AI-powered weather companion in the clouds.
            </motion.div>

            <h1 className="mt-8 text-4xl font-black tracking-tight text-cirra-ink sm:text-5xl lg:text-6xl">
              Weather that feels effortless.
            </h1>
            <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-cirra-muted sm:text-xl">
              Current conditions, forecasts, alerts, and practical weather briefings — powered by Cirra.
            </p>

            <CitySearch
              query={query}
              suggestions={suggestions}
              loading={isSearching || isLoadingCity}
              onQueryChange={setQuery}
              onSubmit={() => void submitSearch()}
              onPickSuggestion={(city) => void submitSearch(city.name)}
            />

            <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-sm font-semibold text-cirra-muted">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1.5 shadow-soft">{statusMessage}</span>
              <span className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-3 py-1.5 text-sky-700 ring-1 ring-sky-100/80">Suggested: {searchHint}</span>
            </div>
          </div>
        </section>

        <section aria-label="weather dashboard" className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <CurrentWeatherSection
            weather={currentWeather ?? {
              location: { name: selectedCity, country: "Palestine", latitude: 0, longitude: 0 },
              temperature: 0,
              conditions: "Clear sky",
              humidity: 0,
              windSpeed: 0,
            }}
            units={units}
            favorite={favoriteNames.some((favorite) => favorite.toLowerCase() === selectedCity.toLowerCase())}
            onSaveFavorite={() => void handleSaveFavorite()}
            onRefresh={() => void loadCity(selectedCity)}
          />

          <BriefingSection briefing={briefing} loading={loadingBriefing} />
        </section>

        <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
          <div className="space-y-6">
            {forecast ? <ForecastSection forecast={forecast} units={units} /> : null}
            <CompareSection
              comparison={comparison}
              units={units}
              city1={compareCity1}
              city2={compareCity2}
              onSwap={() => {
                const nextCity1 = compareCity2;
                const nextCity2 = compareCity1;
                setCompareCity1(nextCity1);
                setCompareCity2(nextCity2);
                void loadComparison(nextCity1, nextCity2);
              }}
              onCompare={() => void handleCompare()}
              loading={isComparing}
              onCity1Change={(value) => setCompareCity1(value)}
              onCity2Change={(value) => setCompareCity2(value)}
            />
          </div>

          <div className="space-y-6">
            <div className="rounded-[2rem] border border-white/75 bg-white/65 p-5 shadow-soft backdrop-blur-xl">
              <SectionHeader
                eyebrow="Controls"
                title="Weather mode"
                subtitle="Switch units and keep the dashboard feeling light and direct."
              />
              <div className="flex items-center gap-2 rounded-full bg-sky-50 p-1.5">
                {(["celsius", "fahrenheit"] as TemperatureUnit[]).map((unit) => (
                  <button
                    key={unit}
                    type="button"
                    onClick={() => setUnits(unit)}
                    className={`flex-1 rounded-full px-4 py-2.5 text-sm font-extrabold transition ${units === unit ? "bg-white text-sky-700 shadow-sm" : "text-cirra-muted"}`}
                  >
                    {unit === "celsius" ? "°C" : "°F"}
                  </button>
                ))}
              </div>
              <div className="mt-5 flex items-center gap-3 rounded-[1.2rem] bg-[linear-gradient(180deg,rgba(255,229,173,0.4),rgba(255,255,255,0.75))] px-4 py-3 text-sm font-semibold text-cirra-muted">
                <ThermometerSnowflake className="h-4 w-4 text-cirra-sun" />
                Using cached weather data when needed to keep the demo calm and responsive.
              </div>
            </div>

            <AlertsSection alerts={alerts} />
          </div>
        </div>

        <FavoritesSection
          favorites={favoriteCities}
          units={units}
          onPickFavorite={(city) => void handlePickFavorite(city)}
        />

        <ToolsSection />
      </div>
    </AppShell>
  );
}
