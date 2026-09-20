import { SimulatorProvider } from "./domain/simulator";
import { FlightScreen } from "./app/FlightScreen";
import {
  createApplicationShellState,
  navigate,
  type ApplicationShellState,
} from "./app/applicationShell";

const provider = new SimulatorProvider("AVIATOR-DEMO-001", 0);
let shell: ApplicationShellState = createApplicationShellState();

document.title = "AVIATOR";

const root = document.getElementById("app");
if (!root) {
  throw new Error("AVIATOR application root was not found");
}

const navigation = document.createElement("nav");
navigation.className = "aviator-shell-nav";
navigation.setAttribute("aria-label", "Primary navigation");

const routes = [
  ["flight", "Flight"],
  ["challenge", "Challenge"],
  ["social", "Social"],
  ["history", "History"],
  ["profile", "Profile"],
] as const;

for (const [route, label] of routes) {
  const button = document.createElement("button");
  button.type = "button";
  button.textContent = label;
  button.dataset.route = route;
  button.addEventListener("click", () => {
    shell = navigate(shell, route);
    navigation.querySelectorAll("button").forEach((item) => {
      item.setAttribute("aria-current", item === button ? "page" : "false");
    });
    // Flight remains the live game surface; other routes are shell placeholders
    // until their domain modules are implemented.
  });
  navigation.appendChild(button);
}

const flight = FlightScreen(provider);
root.appendChild(flight);
root.appendChild(navigation);

provider.start();

const timer = window.setInterval(() => {
  provider.advance();
  const snapshot = provider.snapshot();
  if (snapshot.round.state === "RESULT") {
    provider.advance();
  }
}, 350);

window.addEventListener("beforeunload", () => {
  window.clearInterval(timer);
  provider.stop();
});
