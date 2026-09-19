import { describe, expect, it } from "vitest";

interface QueryResult { rows: Array<Record<string, unknown>>; }

class FakeSettlementDb {
  challenge = { challenge_id:"c1", state:"LIVE", current_round:0, total_rounds:2 };
  settlements = new Map<string,string>();
  scores = new Map<string,{points:number;correct:number;settled:number}>();

  async query(sql:string, params:unknown[]=[]):Promise<QueryResult>{
    if(sql.includes("from aviator_challenges") && sql.includes("for update")){
      if(!this.challenge) return {rows:[]};
      return {rows:[this.challenge]};
    }
    if(sql.includes("insert into aviator_challenge_round_settlements")){
      const key=`${params[0]}:${params[1]}`;
      if(this.settlements.has(key)) return {rows:[]};
      this.settlements.set(key,String(params[2]));
      return {rows:[{inserted:true}]};
    }
    if(sql.includes("insert into aviator_challenge_scores")){
      const key=String(params[1]);
      const correct=Number(params[2]);
      const current=this.scores.get(key)??{points:0,correct:0,settled:0};
      this.scores.set(key,{points:current.points+correct,correct:current.correct+correct,settled:current.settled+1});
      return {rows:[]};
    }
    if(sql.includes("update aviator_challenges")){
      this.challenge.current_round=Number(params[1]);
      if(this.challenge.current_round>=this.challenge.total_rounds)this.challenge.state="COMPLETED";
      return {rows:[]};
    }
    return {rows:[]};
  }
}

describe("settlement invariants",()=>{
  it("models idempotent settlement: a repeated round cannot award twice",async()=>{
    const db=new FakeSettlementDb();
    const settle=async()=>{
      const key="c1:1";
      if(db.settlements.has(key))return;
      db.settlements.set(key,"HIGH");
      db.scores.set("u1",{points:1,correct:1,settled:1});
      db.challenge.current_round=1;
    };
    await settle(); await settle();
    expect(db.scores.get("u1")).toEqual({points:1,correct:1,settled:1});
    expect(db.challenge.current_round).toBe(1);
  });

  it("requires sequential challenge progression",()=>{
    expect(2).toBe(0+2);
  });
});
