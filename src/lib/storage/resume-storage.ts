/**
 * Local persistence for the uploaded resume file.
 * Analysis JSON lives in localStorage; the binary file lives in IndexedDB.
 */

const DB_NAME = "rolefit";
const DB_VERSION = 1;
const STORE = "resumes";
const RESUME_ID = "current";

export interface SavedResumeMeta {
  name: string;
  size: number;
  type: string;
  uploadedAt: string;
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => reject(request.error ?? new Error("Failed to open storage"));
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE);
      }
    };
  });
}

export async function saveResumeFile(file: File): Promise<SavedResumeMeta> {
  const db = await openDb();
  const buffer = await file.arrayBuffer();
  const meta: SavedResumeMeta = {
    name: file.name,
    size: file.size,
    type: file.type || "application/octet-stream",
    uploadedAt: new Date().toISOString(),
  };

  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error ?? new Error("Failed to save resume"));
    tx.objectStore(STORE).put({ meta, buffer }, RESUME_ID);
  });

  db.close();
  return meta;
}

export async function loadResumeFile(): Promise<{ meta: SavedResumeMeta; file: File } | null> {
  try {
    const db = await openDb();
    const record = await new Promise<{ meta: SavedResumeMeta; buffer: ArrayBuffer } | undefined>(
      (resolve, reject) => {
        const tx = db.transaction(STORE, "readonly");
        const req = tx.objectStore(STORE).get(RESUME_ID);
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error ?? new Error("Failed to load resume"));
      },
    );
    db.close();

    if (!record?.meta || !record.buffer) return null;

    const file = new File([record.buffer], record.meta.name, {
      type: record.meta.type,
      lastModified: Date.parse(record.meta.uploadedAt) || Date.now(),
    });

    return { meta: record.meta, file };
  } catch {
    return null;
  }
}

export async function clearResumeFile(): Promise<void> {
  try {
    const db = await openDb();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE, "readwrite");
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error ?? new Error("Failed to clear resume"));
      tx.objectStore(STORE).delete(RESUME_ID);
    });
    db.close();
  } catch {
    // ignore storage errors on clear
  }
}

/** Derive a candidate name from a resume filename when possible. */
export function nameFromResumeFilename(filename: string): string | null {
  const base = filename.replace(/\.[^.]+$/, "");
  const cleaned = base
    .replace(/[_-]+/g, " ")
    .replace(/\b(resume|cv|curriculum|vitae|final|updated|new|copy|draft|pdf|doc|docx)\b/gi, " ")
    .replace(/\d+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!cleaned) return null;

  const words = cleaned.split(" ").filter((w) => w.length > 1);
  if (words.length < 2 || words.length > 4) return null;

  return words
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}
