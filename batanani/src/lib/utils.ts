import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function generateAvatar(name: string, gender: 'MALE' | 'FEMALE') {
	const username = name.replace(/\s+/g, '').toLowerCase();
	const base = 'https://avatar.iran.liara.run/public';
	if (gender === 'FEMALE') return `${base}/girl?username=${username}`;
	// default to boy
	return `${base}/boy?username=${username}`;
}

export const formatPhoneNumber = (value: string) => {
	if (!value) return value;

	const digits = value.replace(/[^\d]/g, '');

	if (digits.startsWith('267')) {
		return `+${digits.slice(0, 3)} ${digits.slice(3, 5)} ${digits.slice(
			5,
			8
		)} ${digits.slice(8)}`;
	} else if (digits.startsWith('7')) {
		return `+267 ${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(
			5
		)}`;
	} else {
		return number; // not a valid Botswana number
	}
};
