import { Time } from "@internationalized/date";

export const generateTimeString = (value: Time) =>
	`${value.hour < 10 ? "0" + value.hour.toString() : value.hour} : ${value.minute < 10 ? "0" + value.minute.toString() : value.minute}`;

export const uuidv4 = () =>
	"10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c) =>
		(+c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (+c / 4)))).toString(16)
	);

// sick code from xenozauros/hex2hsl.js
export const hexToAccessibilityTextHsl = (hex: string, valuesOnly = false) => {
	const threshold = 50;
	const [, red, green, blue] = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex) ?? [
		"#000000",
		"00",
		"00",
		"00"
	];
	const r = parseInt(red, 16) / 255;
	const g = parseInt(green, 16) / 255;
	const b = parseInt(blue, 16) / 255;
	const max = Math.max(r, g, b);
	const min = Math.min(r, g, b);

	let cssString = "";
	let h,
		s,
		l = (max + min) / 2;

	if (max == min) {
		h = s = 0; // achromatic
	} else {
		const d = max - min;
		s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
		switch (max) {
			case r:
				h = (g - b) / d + (g < b ? 6 : 0);
				break;
			case g:
				h = (b - r) / d + 2;
				break;
			case b:
				h = (r - g) / d + 4;
				break;
		}
		h /= 6;
	}

	h = Math.round(h * 360);
	s = Math.round(s * 100);
	l = Math.round(l * 100);

	cssString = `${h}, ${s}%, calc(${l - threshold} * -100%)`;
	cssString = !valuesOnly ? "hsl(" + cssString + ")" : cssString;

	return cssString;
};
