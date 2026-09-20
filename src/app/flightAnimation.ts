export interface FlightMotion{progress:number;angle:number;altitude:number;speed:number;}
export function flightMotion(multiplier:number,crashMultiplier:number):FlightMotion{const progress=Math.min(1,multiplier/Math.max(crashMultiplier,1.01));return{progress,angle:-10-Math.min(24,progress*24),altitude:progress*100,speed:0.6+progress*1.4};}
