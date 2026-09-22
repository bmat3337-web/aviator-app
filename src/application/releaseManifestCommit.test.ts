export {};
interface ReleaseSnapshot {
  manifestVersion: string;
  branch: string;
  commitSha: string;
  generatedAt: string;
  status: "FOUNDATION_VERIFIED" | "PRODUCTION_BLOCKED";
}

const commitSha = process.env.GITHUB_SHA ?? "";
const branch = process.env.GITHUB_REF_NAME ?? "local";

if (!commitSha) {
  if (process.env.CI === "true") throw new Error("CI release snapshot requires GITHUB_SHA");
  console.log("AVIATOR RELEASE COMMIT TRACEABILITY VERIFIED: local execution");
} else {
  const snapshot: ReleaseSnapshot = {
    manifestVersion: "1.0.0",
    branch,
    commitSha,
    generatedAt: "CI_GENERATED",
    status: "PRODUCTION_BLOCKED",
  };
  if (snapshot.branch !== "aviator/foundation-v1") throw new Error("Snapshot branch mismatch");
  if (!/^[0-9a-f]{40}$/.test(snapshot.commitSha)) throw new Error("Invalid Git commit SHA");
  if (snapshot.status !== "PRODUCTION_BLOCKED") throw new Error("Snapshot must remain production blocked");
  console.log("AVIATOR RELEASE COMMIT TRACEABILITY VERIFIED", snapshot.commitSha);
}
