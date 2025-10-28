'use server';

import { prisma } from '../prisma';
import { Gender } from '@prisma/client';
import { generateAvatar } from '../utils';
import { revalidatePath } from 'next/cache';

export async function getHairdressers() {
	try {
		const hairdressers = await prisma.hairDresser.findMany({
			include: {
				_count: { select: { appointments: true } },
			},
			orderBy: { createdAt: 'desc' },
		});

		return hairdressers.map((hairdresser) => ({
			...hairdresser,
			appointmentCount: hairdresser._count.appointments,
		}));
	} catch (error) {
		console.log('Error fetching hairdressers:', error);
		throw new Error('Could not fetch hairdressers');
	}
}

interface CreateHairdresserInput {
	name: string;
	email: string;
	phoneNumber: string;
	speciality: string;
	gender: Gender;
	isActive: boolean;
}

export async function createHairdressers(input: CreateHairdresserInput) {
	try {
		if (!input.name || !input.email) {
			throw new Error('Name and email are required');
		}

		const hairDresser = await prisma.hairDresser.create({
			data: {
				...input,
				imageUrl: generateAvatar(input.name, input.gender),
			},
		});

		revalidatePath('/admin');

		return await getHairdressers();
	} catch (error: unknown) {
		console.error('Error creating hairdresser:', error);

		// if email already exists
		if (error?.code === 'P2002')
			throw new Error(
				'A hairdresser with this email already exists. Please use a different email.'
			);

		throw new Error('Failed to create a hairdresser');
	}
}

interface UpdateHairdressersInput extends Partial<CreateHairdresserInput> {
	id: string;
}

export async function updateHairdressers(input: UpdateHairdressersInput) {
	try {
		// validate
		if (!input.name || !input.email) {
			throw new Error('Name and email are required');

			const currentHairdresser = await prisma.hairDresser.findUnique({
				where: { id: input.id },
				select: { email: true },
			});

			if (!currentHairdresser) throw new Error('Hairdresser not found');

			// if email is changing,check if email is being exsists
			if (input.email !== currentHairdresser.email) {
				const exsistingHairdresser = await prisma.hairDresser.findUnique({
					where: { email: input.email },
				});
				if (exsistingHairdresser) {
					throw new Error(
						'A hairdresser with this email already exists. Please use a different email.'
					);
				}
			}
		}

		const hairDressers = await prisma.hairDresser.update({
			where: { id: input.id },

			// ...input will trigger the unique constraint error on email
			data: {
				name: input.name,
				email: input.email,
				phoneNumber: input.phoneNumber,
				speciality: input.speciality,
				gender: input.gender,
				isActive: input.isActive,
			},
		});

		return hairDressers;
	} catch (error) {
		console.error('Error updating hairdresser:', error);
		throw new Error('Failed to update hairdresser');
	}
}
