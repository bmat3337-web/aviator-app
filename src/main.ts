import { SimulatorProvider } from "./domain/simulator";
import { FlightScreen } from "./app/FlightScreen";
const provider=new SimulatorProvider("AVIATOR-DEMO-001",0);
document.title="AVIATOR";
document.getElementById("app")?.appendChild(FlightScreen(provider));
provider.start();
const timer=setInterval(()=>{provider.advance();const s=provider.snapshot();if(s.round.state==="RESULT")provider.advance();},350);
window.addEventListener("beforeunload",()=>{clearInterval(timer);provider.stop();});