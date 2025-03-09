import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Text,
} from '@kit/ui';

export function OfflineNotSupported() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>You must be online</CardTitle>
        <CardDescription>
          This page requires you to be connected to wifi.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Text>
          This page requires an internet connection to function. Please check
          your wifi connection and try again.
        </Text>
      </CardContent>
    </Card>
  );
}
