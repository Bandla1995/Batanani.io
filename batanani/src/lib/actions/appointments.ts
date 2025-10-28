'use server';

import { prisma } from '@/lib/prisma'; // Adjust the import path as needed

export async function getAppointments() {
	try {
		const appointments = await prisma.appointment.findMany({
			include: {
				user: {
					select: {
						firstName: true,
						lastName: true,
						email: true,
					},
				},
				hairDresser: {
					select: {
						name: true,
						imageUrl: true,
					},
				},
			},
			orderBy: {
				createdAt: 'desc',
			},
		});

		return appointments;
	} catch (error) {
		console.log('Error fetching appointments:', error);
		throw new Error('Could not fetch appointments');
	}
}
