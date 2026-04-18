import { describe, it, expect } from "vitest";
import { getWeatherSuggestions } from "../weatherPredictor";

describe("weatherPredictor utility", () => {
  it("suggests warm clothes for cold weather (< 15°C)", () => {
    expect(getWeatherSuggestions(10)).toBe("Pack warm clothes! 🧥");
    expect(getWeatherSuggestions(14)).toBe("Pack warm clothes! 🧥");
  });

  it("suggests light clothes for hot weather (> 28°C)", () => {
    expect(getWeatherSuggestions(30)).toBe("Pack light! ☀️");
    expect(getWeatherSuggestions(35)).toBe("Pack light! ☀️");
  });

  it("suggests layers for moderate weather (15°C - 28°C)", () => {
    expect(getWeatherSuggestions(20)).toBe("Pack comfortable layers! 👕");
    expect(getWeatherSuggestions(15)).toBe("Pack comfortable layers! 👕");
    expect(getWeatherSuggestions(28)).toBe("Pack comfortable layers! 👕");
  });
});
