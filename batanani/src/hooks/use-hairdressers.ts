'use client';

import { getHairdressers } from '@/lib/actions/hairdressers';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createHairdressers } from '@/lib/actions/hairdressers';
import { updateHairdressers } from '../lib/actions/hairdressers';

// query

export function useGetHairdressers() {
	const result = useQuery({
		queryKey: ['hairdressers'],
		queryFn: getHairdressers,
	});
	return result;
}

// mutation

export function useCreateHairdressers() {
	// update the cache on the client side
	const queryClient = useQueryClient();

	const result = useMutation({
		mutationFn: createHairdressers,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['gethairdressers'] });
		},
		onError: (error) => console.log('Error creating hairdresser:'),
	});
	return result;
}

export function useUpdateHairdressers() {
	// update the cache on the client side
	const queryClient = useQueryClient();

	const result = useMutation({
		mutationFn: updateHairdressers,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['gethairdressers'] });
			queryClient.invalidateQueries({ queryKey: ['getAvailableHairdressers'] });
		},
		onError: (error) => console.log('Error creating hairdresser:'),
	});
	return result;
}
