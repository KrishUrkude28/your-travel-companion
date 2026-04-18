import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import TripPlanner from "../../pages/TripPlanner";
import { BrowserRouter } from "react-router-dom";

// Mock the utilities
vi.mock("../../utils/weatherPredictor", () => ({
  fetchDestinationWeather: vi.fn().mockResolvedValue({ temp: 25, desc: "Pack light! ☀️" })
}));

vi.mock("../../utils/itineraryExport", () => ({
  generateWhatsAppLink: vi.fn(),
  exportToPDF: vi.fn()
}));

// Mock supabase
vi.mock("../../integrations/supabase/client", () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      maybeSingle: vi.fn().mockResolvedValue({ data: null }),
      insert: vi.fn().mockResolvedValue({ error: null })
    }))
  }
}));

// Mock useAuth
vi.mock("../../contexts/AuthContext", () => ({
  useAuth: () => ({ user: { id: "test-user" }, loading: false }),
  AuthProvider: ({ children }: any) => <div>{children}</div>
}));

// Mock useToast
vi.mock("../../hooks/use-toast", () => ({
  useToast: () => ({ toast: vi.fn() })
}));

// Mock i18next
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: "en", changeLanguage: vi.fn() }
  }),
  initReactI18next: {
    type: "3rdParty",
    init: vi.fn()
  }
}));

describe("TripPlanner Component", () => {
  it("renders the initial form", () => {
    render(
      <BrowserRouter>
        <TripPlanner />
      </BrowserRouter>
    );
    expect(screen.getByText("planner.title")).toBeInTheDocument();
  });
});
