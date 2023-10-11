import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/Feather";
import Home from "./screens/Home";
import Statistics from "./screens/Statistics";
import Setting from "./screens/Setting";
import { useFonts } from "expo-font";
import { Text } from "react-native";
import { db } from "./db";





const Tab = createBottomTabNavigator();

function MyTabs() {
  return (

    <Tab.Navigator
      initialRouteName="Feed"
      screenOptions={{
        tabBarActiveTintColor: "#e91e63",
        headerTitleAlign: "center",
      }}
    >
      <Tab.Screen
        name="خانه"
        component={Home}
        options={{
          headerShown: false,
          tabBarLabel: "خانه",
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="آمار"
        component={Statistics}
        options={{
          tabBarLabel: "آمار",
          tabBarIcon: ({ color, size }) => (
            <Icon name="bar-chart-2" color={color} size={size} />
          ),
        }}
      />

      <Tab.Screen
        name="تنظیمات"
        component={Setting}
        options={{
          tabBarLabel: "تنظیمات",
          tabBarIcon: ({ color, size }) => (
            <Icon name="settings" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>

  );
}


export default function App() {

  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        "create table if not exists practice1 (id integer primary key autoincrement, device text, totalProduct text, productionSuccess text, productionLame text, productionCorrective text, productionRepkon text, productionAbortion text, StopElectricity text, StopMechanic text, StopConwire text, StopWelding text, StopLathing text, StopQualityControl text, StopRepkon text, StopShortageDisk text, StopToghe text, created_at DATETIME DEFAULT CURRENT_TIMESTAMP, product text)"
      )});

    
    setLoading(false)
  })


  const [fontsLoaded] = useFonts({
    YekanBakh: require("./assets/fonts/YekanBakh-Regular.ttf"),
  });

  const onLayoutRootView = React.useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  if(loading == true) {
    return (
 
      <Text> Loading . . . </Text>
    
    )
  }

  
  return (
  
      <NavigationContainer>
      <MyTabs />
    </NavigationContainer>
 
  )


}
