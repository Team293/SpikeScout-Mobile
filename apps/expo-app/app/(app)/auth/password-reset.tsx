import { LogoImage } from '@/components/logo';
import { Link } from 'expo-router';
import {
  AuthPageLayout,
  AuthPageLayoutDescription,
  AuthPageLayoutForm,
  AuthPageLayoutHeading,
  AuthPageLayoutLogo,
  AuthPageLayoutSecondaryButton,
  EmailPasswordResetForm,
} from '@kit/auth';
import { Button, Text } from '@kit/ui';

export default function PasswordResetPage() {
  return (
    <>
      <AuthPageLayout>
        <AuthPageLayoutLogo>
          <LogoImage />
        </AuthPageLayoutLogo>

        <AuthPageLayoutHeading>Hi,</AuthPageLayoutHeading>

        <AuthPageLayoutDescription>
          Let's recover your password.
        </AuthPageLayoutDescription>

        <AuthPageLayoutForm>
          <EmailPasswordResetForm />
        </AuthPageLayoutForm>

        <AuthPageLayoutSecondaryButton>
          <Button variant={'link'} asChild>
            <Link className={'text-center'} href="/auth/sign-in">
              <Text>Password Recovered? Sign In.</Text>
            </Link>
          </Button>
        </AuthPageLayoutSecondaryButton>
      </AuthPageLayout>
    </>
  );
}
