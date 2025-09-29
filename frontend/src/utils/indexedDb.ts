import { openDB } from "idb";
import { AssistantResult } from "@/context/useAssistantResultStore";
import { IPreparedData, JobData } from "@/types";

type AssistantResultMap = AssistantResult;

const DB_NAME = "guestAppDB";
const OPTION_STORE = "options";
const JOBDATA_STORE = "jobData";
const PREPARED_STORE = "preparedData";
const RESULTS_STORE = "results";

export async function getDb() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(OPTION_STORE)) {
        db.createObjectStore(OPTION_STORE);
      }
      if (!db.objectStoreNames.contains(JOBDATA_STORE)) {
        db.createObjectStore(JOBDATA_STORE);
      }
      if (!db.objectStoreNames.contains(PREPARED_STORE)) {
        db.createObjectStore(PREPARED_STORE);
      }
      if (!db.objectStoreNames.contains(RESULTS_STORE)) {
        db.createObjectStore(RESULTS_STORE);
      }
    },
  });
}

// --- Options ---
export async function saveOptions(data: string[]) {
  const db = await getDb();
  await db.put(OPTION_STORE, data, "options");
}

export async function getOptions(): Promise<string[] | null> {
  const db = await getDb();
  return (await db.get(OPTION_STORE, "options")) || null;
}

export async function clearOptions() {
  const db = await getDb();
  await db.delete(OPTION_STORE, "options");
}

// --- Job Data ---
export async function saveJobData(data: JobData) {
  const db = await getDb();
  await db.put(JOBDATA_STORE, data, "jobData");
}

export async function getJobData(): Promise<JobData | null> {
  const db = await getDb();
  return (await db.get(JOBDATA_STORE, "jobData")) || null;
}

export async function clearJobData() {
  const db = await getDb();
  await db.delete(JOBDATA_STORE, "jobData");
}

// --- Prepared Data ---
export async function savePreparedData(data: IPreparedData) {
  const db = await getDb();
  await db.put(PREPARED_STORE, data, "prepared");
}

export async function getPreparedData(): Promise<IPreparedData | null> {
  const db = await getDb();
  return (await db.get(PREPARED_STORE, "prepared")) || null;
}

export async function clearPreparedData() {
  const db = await getDb();
  await db.delete(PREPARED_STORE, "prepared");
}

// --- Results ---
// Save
export async function saveResult<K extends keyof AssistantResultMap>(
  option: K,
  result: AssistantResultMap[K]
) {
  const db = await getDb();
  await db.put(RESULTS_STORE, result, option);
}

// Get
export async function getResult<K extends keyof AssistantResultMap>(
  option: K
): Promise<AssistantResultMap[K] | null> {
  const db = await getDb();
  return (await db.get(RESULTS_STORE, String(option))) || null;
}

// Clear
export async function clearResults() {
  const db = await getDb();
  await db.clear(RESULTS_STORE);
}
