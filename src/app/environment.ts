export type FlightEnvironment="SUNRISE"|"DAY"|"SUNSET"|"NIGHT"|"CLOUDS"|"STORM"|"RUNWAY";
export type EnvironmentMode="AUTO"|"MANUAL";
export interface EnvironmentState{mode:EnvironmentMode;environment:FlightEnvironment;intensity:number;}
export function environmentForMultiplier(m:number):FlightEnvironment{if(m<1.5)return"SUNRISE";if(m<2.5)return"DAY";if(m<4)return"CLOUDS";if(m<7)return"SUNSET";return"NIGHT";}
export function nextEnvironment(state:EnvironmentState,m:number):EnvironmentState{return state.mode==="MANUAL"?state:{...state,environment:environmentForMultiplier(m),intensity:Math.min(1,Math.max(.15,(m-1)/8))};}
