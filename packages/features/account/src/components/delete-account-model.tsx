import { useState } from 'react';

import { useSignOut, useUser } from '@kit/supabase';
import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Text,
} from '@kit/ui';

import { useDeleteAccountMutation } from '../lib/hooks/use-delete-account-mutation';

export function DeleteAccountModel() {
  const { data: user } = useUser();
  const deleteAccountMutation = useDeleteAccountMutation(user?.id || '');
  const signOutMutation = useSignOut();
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [feedback, setFeedback] = useState('');

  const handleDeleteAccount = async () => {
    if (!user?.id) return;

    setIsDeleting(true);
    setFeedback('');

    try {
      await deleteAccountMutation.mutateAsync();
      setFeedback(
        'Your account has been marked for deletion. You will be signed out now.',
      );

      setTimeout(() => {
        setIsOpen(false);
        signOutMutation.mutate();
      }, 10000);
    } catch (error) {
      setFeedback(
        error instanceof Error
          ? error.message
          : 'An error occurred while processing your request',
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant={'destructive'}>
          <Text>Delete Account</Text>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Account</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete your account? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>

        {feedback && (
          <Text
            className="my-2 text-center"
            style={{
              color: feedback.includes('error') ? 'red' : 'green',
            }}
          >
            {feedback}
          </Text>
        )}

        <DialogFooter>
          <DialogClose asChild className={'flex flex-row'}>
            <Button disabled={isDeleting}>
              <Text>Cancel</Text>
            </Button>
          </DialogClose>
          <Button
            variant={'destructive'}
            onPress={handleDeleteAccount}
            disabled={isDeleting || !user?.id}
          >
            <Text>{isDeleting ? 'Processing...' : 'Confirm'}</Text>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
