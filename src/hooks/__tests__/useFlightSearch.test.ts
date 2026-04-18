import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useFlightSearch } from "../useFlightSearch";

describe("useFlightSearch hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  it("returns simulated flights when the live API fails", async () => {
    // Mock failure
    global.fetch = vi.fn().mockImplementation(() => Promise.reject("API Error"));

    const { result } = renderHook(() => useFlightSearch());
    
    // Trigger search and wait (will take ~1s)
    await result.current.searchFlights("Delhi", "Mumbai", "2024-12-01");
    
    await waitFor(() => {
      expect(result.current.flights.length).toBeGreaterThan(0);
    });
    
    expect(result.current.flights[0].airline).toBe("IndiGo"); 
    expect(result.current.loading).toBe(false);
  });

  it("handles empty results by throwing or falling back", async () => {
    // Mock empty response
    global.fetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve({ data: [] })
    });

    const { result } = renderHook(() => useFlightSearch());
    await result.current.searchFlights("NY", "LA", "2024-12-01");
    
    await waitFor(() => {
      expect(result.current.flights.length).toBe(4);
    });
  });
});
