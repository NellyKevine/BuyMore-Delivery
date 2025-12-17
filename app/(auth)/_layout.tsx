import { useLg } from '@/components/langue/MyLanguageProvider';
import { useTheme } from '@/components/theme/MyThemeProvider';
import { Stack, useRouter } from 'expo-router';
import { Platform } from 'react-native';
import { useUser } from "@/components/user/MyUserProvider";

export default function StackLayout() {
  const { isDark } = useTheme();
  const { isLoggedIn } = useUser();
  const { t } = useLg();
  const router = useRouter();

  const goToProfil = () => {
    router.push('/profile');
  };

  

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: isDark ? '#021c29ff' : '#fcfdfdff',
        },
        headerTitleStyle: {
          color: isDark ? '#fcfdfdff' : '#155FDC',
        },
        headerTintColor: isDark ? '#fcfdfdff' : '#155FDC',
        ...Platform.select({
          android: {
            navigationBarColor: isDark ? '#ffffff' : '#000000',
          },
        }),
      }}
    >
      {/* Login */}
      <Stack.Screen
        name="login"
        options={{
          headerShown: false,
        }}
      />

      {/* Signup */}
      <Stack.Screen
        name="signup"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
