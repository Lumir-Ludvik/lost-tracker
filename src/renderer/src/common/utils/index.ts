import { Time } from "@internationalized/date";

export const generateTimeString = (value: Time) =>
	`${value.hour < 10 ? "0" + value.hour.toString() : value.hour} : ${value.minute < 10 ? "0" + value.minute.toString() : value.minute}`;
