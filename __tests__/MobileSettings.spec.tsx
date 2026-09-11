import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MobileSettings from "@/components/settings/MobileSettings";

vi.mock("@/lib/toast", () => ({
  toastSuccess: vi.fn(),
  toastError: vi.fn(),
}));

const mockPairingPayload = {
  version: 1,
  appName: "NudgePath",
  serverUrl: "http://192.168.1.50:3737",
  token: "mock-jwt-token-xyz.abc.123",
  user: {
    id: "user-test-1",
    name: "Janre",
    email: "janre@nudgepath.com",
  },
  createdAt: "2026-09-11T12:00:00.000Z",
};

function mockFetchPairing(ok = true, payload = mockPairingPayload) {
  const fn = vi.fn().mockResolvedValue({
    ok,
    json: async () => ({ success: ok, pairing: payload }),
  });
  global.fetch = fn as unknown as typeof fetch;
  return fn;
}

describe("MobileSettings Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows skeleton loading state while fetching pairing info", () => {
    mockFetchPairing();
    const { container } = render(<MobileSettings />);
    const skeletons = container.querySelectorAll(".animate-pulse");
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it("renders QR code, server address, and pairing token on success", async () => {
    mockFetchPairing();
    render(<MobileSettings />);

    await waitFor(() => {
      expect(screen.getByText(/connect mobile app/i)).toBeInTheDocument();
      expect(screen.getByDisplayValue("http://192.168.1.50:3737")).toBeInTheDocument();
      expect(screen.getByDisplayValue("mock-jwt-token-xyz.abc.123")).toBeInTheDocument();
      expect(screen.getByText(/scan in nudgepath mobile/i)).toBeInTheDocument();
    });
  });

  it("allows updating custom server address", async () => {
    const user = userEvent.setup();
    mockFetchPairing();
    render(<MobileSettings />);

    await waitFor(() => {
      expect(screen.getByDisplayValue("http://192.168.1.50:3737")).toBeInTheDocument();
    });

    const input = screen.getByDisplayValue("http://192.168.1.50:3737");
    await user.clear(input);
    await user.type(input, "https://nudgepath.railway.app");

    expect(screen.getByDisplayValue("https://nudgepath.railway.app")).toBeInTheDocument();
  });

  it("renders error message if fetching pairing credentials fails", async () => {
    mockFetchPairing(false);
    render(<MobileSettings />);

    await waitFor(() => {
      expect(screen.getByText(/unable to generate pairing data/i)).toBeInTheDocument();
    });
  });
});
