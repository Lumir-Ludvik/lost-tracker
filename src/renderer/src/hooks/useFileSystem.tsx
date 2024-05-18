import { DEFAULT_FILE_PATH, DIRECTORY_PATH } from "../common/constants";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require("node:fs/promises");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const exists = require("fs").existsSync;

export const useFileSystem = () => {
	const writeToFileAsync = async (
		data: string,
		path: string = DEFAULT_FILE_PATH
	): Promise<boolean> => {
		try {
			if (!exists(DIRECTORY_PATH)) {
				await fs.mkdir(DIRECTORY_PATH);
			}

			if (exists(path)) {
				await fs.unlink(path);
			}

			await fs.writeFile(path, data, { flag: "w" });

			return true;
		} catch (err) {
			console.error(`Cannot write to file ${path}. Error: ${err}`);
			return false;
		}
	};

	const readFileAsync = async (path: string = DEFAULT_FILE_PATH): Promise<string | false> => {
		try {
			return (await fs.readFile(path)).toString();
		} catch (err) {
			console.error(`Cannot read from file ${path}. Error: ${err}`);
			return false;
		}
	};

	const updateFileAsync = async (
		data: string,
		path: string = DEFAULT_FILE_PATH
	): Promise<boolean> =>
		new Promise((resolve, reject) => {
			try {
				fs.unlinkSync(`${path}-backup`);
				fs.copyFileSync(path, `${path}-backup`, 5);
				fs.unlinkSync(path);
				fs.writeFileSync(path, data, { mode: "w" });

				resolve(true);
			} catch (err) {
				console.error(`Cannot update file ${path}. Error: ${err}`);

				reject(false);
			}
		});

	return {
		writeToFileAsync,
		readFileAsync,
		updateFileAsync
	};
};
