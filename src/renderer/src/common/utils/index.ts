import { Time } from "@internationalized/date";

export const generateTimeString = (value: Time) =>
	`${value.hour < 10 ? "0" + value.hour.toString() : value.hour} : ${value.minute < 10 ? "0" + value.minute.toString() : value.minute}`;

export const uuidv4 = () =>
	"10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c) =>
		(+c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (+c / 4)))).toString(16)
	);
