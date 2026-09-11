import React from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer, DefaultTheme, DarkTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { ActivityIndicator, View } from "react-native";
import { AuthProvider, useAuth } from "./src/context/AuthContext";
import { RootStackParamList, MainTabParamList } from "./src/types";

// Screens
import LoginScreen from "./src/screens/LoginScreen";
import QrScanScreen from "./src/screens/QrScanScreen";
import JobsListScreen from "./src/screens/JobsListScreen";
import AddJobScreen from "./src/screens/AddJobScreen";
import JobDetailsScreen from "./src/screens/JobDetailsScreen";
import SettingsScreen from "./src/screens/SettingsScreen";

// Icons
import { Briefcase, PlusCircle, Settings } from "lucide-react-native";

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

const NudgePathTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: "#38bdf8",
    background: "#090d16",
    card: "#0f172a",
    text: "#f8fafc",
    border: "#1e293b",
  },
};

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "#0f172a" },
        headerTintColor: "#f8fafc",
        tabBarStyle: {
          backgroundColor: "#0f172a",
          borderTopColor: "#1e293b",
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: "#38bdf8",
        tabBarInactiveTintColor: "#64748b",
      }}
    >
      <Tab.Screen
        name="Jobs"
        component={JobsListScreen}
        options={{
          title: "Pipeline",
          tabBarIcon: ({ color, size }) => <Briefcase color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="AddJobTab"
        component={AddJobScreen}
        options={{
          title: "New Job",
          tabBarIcon: ({ color, size }) => <PlusCircle color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: "Instance",
          tabBarIcon: ({ color, size }) => <Settings color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
}

function RootNavigator() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: "#090d16", alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator color="#38bdf8" size="large" />
      </View>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "#0f172a" },
        headerTintColor: "#f8fafc",
      }}
    >
      {!isAuthenticated ? (
        <>
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="QrScan"
            component={QrScanScreen}
            options={{ headerShown: false, presentation: "fullScreenModal" }}
          />
        </>
      ) : (
        <>
          <Stack.Screen
            name="Main"
            component={MainTabs}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="JobDetails"
            component={JobDetailsScreen}
            options={{ title: "Application Details" }}
          />
          <Stack.Screen
            name="AddJob"
            component={AddJobScreen}
            options={{ title: "Track New Application", presentation: "modal" }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <NavigationContainer theme={NudgePathTheme}>
          <StatusBar style="light" />
          <RootNavigator />
        </NavigationContainer>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
