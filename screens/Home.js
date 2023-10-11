import { Chip, Divider } from "@rneui/base";
import moment from "jalali-moment";
import React, { useEffect, useState } from "react";
import { Image, ScrollView, Text, View } from "react-native";
import Icon from "react-native-vector-icons/Feather";

export default function Home() {
  const [date, setDate] = useState("");

  useEffect(() => {
    const IntervalTime = setInterval(() => {
      const currentDate = moment().locale("fa").format("y-MM-D  h:m:s");
      setDate(currentDate);
    }, 1000);

    return () => clearInterval(IntervalTime);
  }, []);

  const devices = [
    // { id: 5, name: "ARC 5", active: true },
    { id: 4, name: "ARC 4", active: true },
    { id: 3, name: "ARC 3", active: true },
    { id: 2, name: "ARC 2", active: false },
    { id: 1, name: "ARC 1", active: false },
  ];
  const currentTime = new Date()
  const currentHour = currentTime.getHours()

  return (
    <ScrollView>

        <View className="relative">
          <Image
            className="h-40 w-full rounded-b-2xl"
            source={require("../assets/images/saipaCover.png")}
          />

        </View>
        <View className="flex flex-row justify-between  p-1 rounded-b-2xl">
          {currentHour >= 12 ? (
            <View className="flex flex-row items-center bg-slate-800 p-2 rounded-full ml-1">
              <Text className="text-white font-yekan"> شب </Text>
              <Icon color={"white"} name="moon" size={18} />
            </View>
          ) : (
            <View className="flex flex-row items-center bg-yellow-400 p-2 rounded-full ml-1">
              <Text className="text-white font-yekan"> صبح </Text>
              <Icon color={"white"} name="sun" size={18} />
            </View>
            
          )}

          {/* <View className="flex flex-row items-center bg-yellow-500 p-2 rounded-full">
            <Text className="text-white"> صبح </Text>
            <Icon color={"white"} name="sun" size={18} />
          </View>
           */}
          <View className="flex flex-row items-center p-2 rounded-full bg-red-500 mr-1">
            <Text className="text-white">{date} </Text>
            <Icon color={"white"} name="calendar" size={18} />
          </View>
        </View>

        <View>
          <Text className="text-lg p-2 font-yekan"> دستگاه های موجود </Text>

          <View className="flex flex-col font-yekan bg-white rounded-lg mx-2 p-3">
            {devices.map((items) => (
              <React.Fragment key={items.id}>
                <View className="flex flex-row justify-between mx-2 p-2 items-center font-yekan">
                  {/* <Text> {items.active ? "فعال" : "غیرفعال"} </Text> */}
                  <Chip
                    size="sm"
                    color={items.active ? "primary" : "error"}
                    title={
                      items.active ? (
                        <Text className="text-white font-yekan"> فعال </Text>
                      ) : (
                        <Text className="text-white font-yekan"> غیرفعال </Text>
                      )
                    }
                  />
                  <Text className="font-yekan"> {items.name} </Text>
                </View>
                <Divider />
              </React.Fragment>
            ))}
          </View>
        </View>

        
{/*         
        <View>
          <Text className="p-2 text-lg font-yekan"> چکیده امار روزانه </Text>

          <View className="p-2 rounded-lg mx-2 shadow-xl bg-white">
            <Text className="font-yekan text-center">
              دارنده حساب  : سجاد عبیدزاده
            </Text>

          </View>
        </View>
         */}
       



    </ScrollView>
  );
}
