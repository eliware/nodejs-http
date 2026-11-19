import path from "node:path";
import { Readable } from "node:stream";

export function createMemoryFileSystem() {
  const files = new Map();
  const directories = new Set([path.resolve("/")]);
  const resolved = (value) => path.resolve(String(value));
  const addDirectory = (value) => {
    const directory = resolved(value);
    directories.add(directory);
    const parent = path.dirname(directory);
    if (parent !== directory) addDirectory(parent);
    return directory;
  };
  const setFile = (value, data) => {
    const file = resolved(value);
    addDirectory(path.dirname(file));
    files.set(file, Buffer.isBuffer(data) ? Buffer.from(data) : Buffer.from(String(data)));
  };
  const statFor = (file) => {
    const data = files.get(file);
    const isDirectory = directories.has(file);
    if (!data && !isDirectory) throw Object.assign(new Error("not found"), { code: "ENOENT" });
    return {
      size: data?.length || 0,
      mtime: new Date("2026-01-01T00:00:00.000Z"),
      mtimeMs: 1767225600000,
      isFile: () => Boolean(data),
      isDirectory: () => isDirectory,
    };
  };
  return {
    files,
    directories,
    setFile,
    setDirectory: addDirectory,
    async readFile(value, encoding) {
      const data = files.get(resolved(value));
      if (!data) throw Object.assign(new Error("not found"), { code: "ENOENT" });
      return encoding ? data.toString(encoding) : Buffer.from(data);
    },
    async stat(value) {
      return statFor(resolved(value));
    },
    async lstat(value) {
      return statFor(resolved(value));
    },
    async realpath(value) {
      const file = resolved(value);
      statFor(file);
      return file;
    },
    async access(value) {
      statFor(resolved(value));
    },
    async readdir(value, options = {}) {
      const directory = resolved(value);
      if (!directories.has(directory))
        throw Object.assign(new Error("not found"), { code: "ENOENT" });
      const children = new Set();
      for (const file of [...files.keys(), ...directories]) {
        if (path.dirname(file) === directory) children.add(path.basename(file));
      }
      return [...children].map((name) => {
        const child = path.join(directory, name);
        const dir = directories.has(child);
        return options.withFileTypes ? { name, isDirectory: () => dir, isFile: () => !dir } : name;
      });
    },
    createReadStream(value, options = {}) {
      const data = files.get(resolved(value)) || Buffer.alloc(0);
      const end = options.end === undefined ? data.length : options.end + 1;
      return Readable.from([data.subarray(options.start || 0, end)]);
    },
  };
}
