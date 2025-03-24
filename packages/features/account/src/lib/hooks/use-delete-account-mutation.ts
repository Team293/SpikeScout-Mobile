import { useMutation } from '@tanstack/react-query';

import { useSupabase } from '@kit/supabase';

/**
 * This mutation is used to immediately delete a user's account
 * by calling a secure database function with proper authorization.
 */
export function useDeleteAccountMutation(accountId: string) {
  const client = useSupabase();

  const mutationKey = ['account:delete', accountId];

  const mutationFn = async () => {
    if (!accountId) {
      throw new Error('Account ID is required');
    }

    const { error } = await client.from('deletion_requests').insert({
      user_id: accountId,
    });

    if (error) {
      throw error;
    }

    await client.auth.signOut();

    return {
      success: true,
      message: 'Your account has been marked for deletion',
    };
  };

  return useMutation({
    mutationKey,
    mutationFn,
  });
}
