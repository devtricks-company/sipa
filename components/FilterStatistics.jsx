import DatePicker from "@mohamadkh75/react-native-jalali-datepicker";
import moment from "jalali-moment";
import React, { useState } from "react";
import { useFormik } from "formik";
import {
  Alert,
  Modal,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";

import { Button, Divider } from "@rneui/base";

import Icon from "react-native-vector-icons/Feather";
import { db } from "../db";
import { FilterSTatistics } from "./ValidationSchema/FilterStatistics";

const FilterStatistics = () => {
  const [openFilterModal, setOpenFilterModal] = useState(false);
  const [showStartDate, setShowStartDate] = useState(false);
  const [showEndDate, setShowEndDate] = useState(false);

  const [showResult, setShowResult] = useState(false);

  const [showArc3Details, setShowArc3Details] = useState(false);
  const [showArc4Details, setShowArc4Details] = useState(false);

  const [itemsFound, setItemsFount] = useState([]);
  const [arc3, setArc3] = useState([]);
  const [arc4, setArc4] = useState([]);

  const showCheckPercent = (first, second) => {
    if (first != "") {
      const calculatedPercentage = (second / first) * 100;
      return <Text> {calculatedPercentage.toFixed(0)} % </Text>;
    }
  };

  const [totalArc3, setTotalArc3] = useState({
    StopConwire: 0,
    StopElectricity: 0,
    StopLathing: 0,
    StopMechanic: 0,
    StopQualityControl: 0,
    StopRepkon: 0,
    StopShortageDisk: 0,
    StopToghe: 0,
    StopWelding: 0,
    productionAbortion: 0,
    productionCorrective: 0,
    productionLame: 0,
    productionRepkon: 0,
    productionSuccess: 0,
    totalProduct: 0,
  });

  const [totalArc4, setTotalArc4] = useState({
    StopConwire: 0,
    StopElectricity: 0,
    StopLathing: 0,
    StopMechanic: 0,
    StopQualityControl: 0,
    StopRepkon: 0,
    StopShortageDisk: 0,
    StopToghe: 0,
    StopWelding: 0,
    productionAbortion: 0,
    productionCorrective: 0,
    productionLame: 0,
    productionRepkon: 0,
    productionSuccess: 0,
    totalProduct: 0,
  });

  const toggleDatepickerStart = () => {
    setShowStartDate(!showStartDate);
  };

  const onChangeStart = (date) => {

    const convertDate = moment(date, "jYYYY/jMM/jDD").format("x");

    statisticsFormik.setFieldValue("startDate", date);
    statisticsFormik.setFieldValue("startDateFormat", convertDate);

    setTimeout(() => {
      setShowStartDate(!showStartDate);
    }, 500);
  };

  const onChangeEnd = (date) => {
    const convertDate = moment(date, "jYYYY/jMM/jDD").format("x");

    statisticsFormik.setFieldValue("endDate", date);
    statisticsFormik.setFieldValue("endDateFormat", convertDate);

    setTimeout(() => {
      setShowEndDate(!showEndDate);
    }, 500);
  };

  const toggleDatepickerEnd = () => {
    setShowEndDate(!showEndDate);
  };

  const handleOpenFilter = () => {
    setOpenFilterModal(true);
  };

  const statisticsFormik = useFormik({
    validationSchema: FilterSTatistics,
    initialValues: {
      startDate: "",
      endDate: "",

      startDateFormat: "",
      endDateFormat: "",
    },
    onSubmit: (value) => {
      if (value.startDate > value.endDate)
        return ToastAndroid.show(
          "تاریخ پایان نمیتواند از تاریخ شروع کمتر باشد",
          2500,
          ToastAndroid.LONG
        );

      db.transaction((tx) => {
        tx.executeSql(
          "SELECT * FROM practice1 WHERE created_at BETWEEN ? AND ?",
          [value.startDateFormat, value.endDateFormat],
          (_, { rows }) => {
            const result = rows._array;
            setItemsFount(result);

            const arc3 = result.filter((item) => item.device === "ARC3");
            const arc4 = result.filter((item) => item.device === "ARC4");

            const totalArc3 = calculateTotalProperties(arc3);
            const totalArc4 = calculateTotalProperties(arc4);

            setArc3(result.filter((item) => item.device == "ARC3"));
            setArc4(result.filter((item) => item.device == "ARC4"));

            setTotalArc3(totalArc3);
            setTotalArc4(totalArc4);

            setShowResult(true);
          },
          (_, error) => console.log("SQL error ", error)
        );
      });

      // ... your other code ...

      // Function to calculate totals
      function calculateTotalProperties(data) {
        const total = {
          StopConwire: 0,
          StopElectricity: 0,
          StopLathing: 0,
          StopMechanic: 0,
          StopQualityControl: 0,
          StopRepkon: 0,
          StopShortageDisk: 0,
          StopToghe: 0,
          StopWelding: 0,
          productionAbortion: 0,
          productionCorrective: 0,
          productionLame: 0,
          productionRepkon: 0,
          productionSuccess: 0,
          totalProduct: 0,
        };

        data.forEach((item) => {
          for (const property in total) {
            if (Object.hasOwnProperty.call(total, property)) {
              total[property] += parseFloat(item[property]) || 0;
            }
          }
        });

        return total;
      }
    },
  });

  return (
    <>
      <Modal
        visible={showResult}
        animationType="slide"
        onRequestClose={() => setShowResult(!showResult)}
      >
        <View className="p-3 bg-blue-400 flex flex-row justify-between">
          <TouchableOpacity>
            <Icon
              onPress={() => {
                setShowResult(false);
              }}
              name="x"
              style={{ color: "white", fontSize: 24 }}
            />
          </TouchableOpacity>
          <Text className="font-medium text-white text-base font-yekan">
            آمار در بازه زمانی
          </Text>
          <Text> </Text>
        </View>

        {itemsFound.length == 0 ? (
          <>
            <Text className="font-yekan text-center mt-6 text-xl">
              آماری ثبت نشده است
            </Text>
            <Text className="font-yekan text-center  text-xs">
              {statisticsFormik.values.startDate} --
              {statisticsFormik.values.endDate}
            </Text>
          </>
        ) : (
          <ScrollView>
            <View>
              <View className="p-2 bg-black">
                <Text className="font-yekan text-center text-white">
                  تاریخ : {statisticsFormik.values.startDate} --
                  {statisticsFormik.values.endDate}
                </Text>
              </View>

              <Text className="p-2 font-yekan text-center">
                مجموع آمار به تفکیک دستگاه
              </Text>

              <View className="bg-slate-100 mx-2 rounded-lg">
                <View className="flex justify-between flex-row p-2">
                  <Text className="text-orange-600"> ARC3 </Text>
                  <Text className="font-yekan text-xs text-orange-600">
                    آمار تولیدی
                  </Text>
                </View>

                <View className="flex flex-row-reverse justify-between mx-2 mt-1">
                  <Text className="font-yekan"> تعداد تولید کل </Text>
                  <Text className="font-yekan"> {totalArc3.totalProduct} </Text>
                </View>

                <View className="flex flex-row-reverse justify-between mx-2 mt-1">
                  <Text className="font-yekan"> تعداد اصلاحی </Text>
                  <Text className="font-yekan">
                    {totalArc3.productionCorrective}
                  </Text>
                </View>

                <View className="flex flex-row-reverse justify-between mx-2 mt-1">
                  <Text className="font-yekan"> تعداد اسقاطی </Text>
                  <Text className="font-yekan">
                    {totalArc3.productionAbortion}
                  </Text>
                </View>

                <View className="flex flex-row-reverse justify-between mx-2 mt-1">
                  <Text className="font-yekan"> تعداد تولید OK </Text>
                  <Text className="font-yekan">
                    {totalArc3.productionSuccess}
                  </Text>
                </View>

                <View className="flex flex-row-reverse justify-between mx-2 mt-1">
                  <Text className="font-yekan"> تاب و لنگی </Text>
                  <Text className="font-yekan">{totalArc3.productionLame}</Text>
                </View>

                <View className="flex flex-row-reverse justify-between mx-2 mt-1">
                  <Text className="font-yekan"> رپکن OK </Text>
                  <Text className="font-yekan">
                    {totalArc3.productionRepkon}
                  </Text>
                </View>

                <Text className="p-2 font-yekan text-xs text-orange-600">
                  توقفات
                </Text>

                <View className="flex flex-row-reverse justify-between mx-2 mt-1">
                  <Text className="font-yekan"> توقفات مکانیک </Text>
                  <Text className="font-yekan">{totalArc3.StopMechanic}</Text>
                </View>

                <View className="flex flex-row-reverse justify-between mx-2 mt-1">
                  <Text className="font-yekan"> توقفات جوشکاری </Text>
                  <Text className="font-yekan">{totalArc3.StopWelding}</Text>
                </View>

                <View className="flex flex-row-reverse justify-between mx-2 mt-1">
                  <Text className="font-yekan"> توقفات برقی </Text>
                  <Text className="font-yekan">
                    {totalArc3.StopElectricity}
                  </Text>
                </View>

                <View className="flex flex-row-reverse justify-between mx-2 mt-1">
                  <Text className="font-yekan"> توقفات تراشکاری </Text>
                  <Text className="font-yekan">{totalArc3.StopLathing}</Text>
                </View>

                <View className="flex flex-row-reverse justify-between mx-2 mt-1">
                  <Text className="font-yekan"> توقفات کانوایر </Text>
                  <Text className="font-yekan">{totalArc3.StopConwire}</Text>
                </View>

                <View className="flex flex-row-reverse justify-between mx-2 mt-1">
                  <Text className="font-yekan"> توقفات کانوایر </Text>
                  <Text className="font-yekan">{totalArc3.StopConwire}</Text>
                </View>

                <View className="flex flex-row-reverse justify-between mx-2 mt-1">
                  <Text className="font-yekan"> توقفات کنترل کیفیت </Text>
                  <Text className="font-yekan">
                    {totalArc3.StopQualityControl}
                  </Text>
                </View>

                <View className="flex flex-row-reverse justify-between mx-2 mt-1 mb-2">
                  <Text className="font-yekan"> توقفات کبود طوقه </Text>
                  <Text className="font-yekan">{totalArc3.StopToghe}</Text>
                </View>

                <Text className="text-xs font-yekan text-orange-500 m-2">
                  آمار بر اساس درصد
                </Text>

                <View className="flex flex-row-reverse justify-center flex-wrap">
                  <View className="flex flex-row-reverse">
                    <Text className="font-yekan"> تعداد اصلاحی : </Text>
                    <Text className="font-yekan">
                      {showCheckPercent(
                        totalArc3.totalProduct,
                        totalArc3.productionCorrective
                      )}
                    </Text>
                    <Divider orientation="vertical" />
                  </View>

                  <View className="flex flex-row-reverse">
                    <Text className="font-yekan"> تعداد اسقاط : </Text>
                    <Text className="font-yekan">
                      {showCheckPercent(
                        totalArc3.totalProduct,
                        totalArc3.productionAbortion
                      )}
                    </Text>
                    <Divider orientation="vertical" />
                  </View>

                  <View className="flex flex-row-reverse">
                    <Text className="font-yekan"> تعداد OK :</Text>
                    <Text className="font-yekan">
                      {showCheckPercent(
                        totalArc3.totalProduct,
                        totalArc3.productionSuccess
                      )}
                    </Text>
                    <Divider orientation="vertical" />
                  </View>

                  <View className="flex flex-row-reverse">
                    <Text className="font-yekan"> تاب و لنگی :</Text>
                    <Text className="font-yekan">
                      {showCheckPercent(
                        totalArc3.totalProduct,
                        totalArc3.productionLame
                      )}
                    </Text>
                    <Divider orientation="vertical" />
                  </View>

                  <View className="flex flex-row-reverse mb-3">
                    <Text className="font-yekan"> رپکن OK : </Text>
                    <Text className="font-yekan">
                      {showCheckPercent(
                        totalArc3.totalProduct,
                        totalArc3.productionRepkon
                      )}
                    </Text>
                    <Divider orientation="vertical" />
                  </View>
                </View>
              </View>

              <View className="bg-slate-100 mx-2 rounded-lg mt-2">
                <View className="flex justify-between flex-row p-2">
                  <Text className="text-orange-600"> ARC4 </Text>
                  <Text className="font-yekan text-xs text-orange-600">
                    آمار تولیدی
                  </Text>
                </View>

                <View className="flex flex-row-reverse justify-between mx-2 mt-1">
                  <Text className="font-yekan"> تعداد تولید کل </Text>
                  <Text className="font-yekan"> {totalArc4.totalProduct} </Text>
                </View>

                <View className="flex flex-row-reverse justify-between mx-2 mt-1">
                  <Text className="font-yekan"> تعداد اصلاحی </Text>
                  <Text className="font-yekan">
                    {totalArc4.productionCorrective}
                  </Text>
                </View>

                <View className="flex flex-row-reverse justify-between mx-2 mt-1">
                  <Text className="font-yekan"> تعداد اسقاطی </Text>
                  <Text className="font-yekan">
                    {totalArc4.productionAbortion}
                  </Text>
                </View>

                <View className="flex flex-row-reverse justify-between mx-2 mt-1">
                  <Text className="font-yekan"> تعداد تولید OK </Text>
                  <Text className="font-yekan">
                    {totalArc4.productionSuccess}
                  </Text>
                </View>

                <View className="flex flex-row-reverse justify-between mx-2 mt-1">
                  <Text className="font-yekan"> تاب و لنگی </Text>
                  <Text className="font-yekan">{totalArc4.productionLame}</Text>
                </View>

                <View className="flex flex-row-reverse justify-between mx-2 mt-1">
                  <Text className="font-yekan"> رپکن OK </Text>
                  <Text className="font-yekan">
                    {totalArc4.productionRepkon}
                  </Text>
                </View>

                <Text className="p-2 font-yekan text-xs text-orange-600">
                  توقفات
                </Text>

                <View className="flex flex-row-reverse justify-between mx-2 mt-1">
                  <Text className="font-yekan"> توقفات مکانیک </Text>
                  <Text className="font-yekan">{totalArc4.StopMechanic}</Text>
                </View>

                <View className="flex flex-row-reverse justify-between mx-2 mt-1">
                  <Text className="font-yekan"> توقفات جوشکاری </Text>
                  <Text className="font-yekan">{totalArc4.StopWelding}</Text>
                </View>

                <View className="flex flex-row-reverse justify-between mx-2 mt-1">
                  <Text className="font-yekan"> توقفات برقی </Text>
                  <Text className="font-yekan">
                    {totalArc4.StopElectricity}
                  </Text>
                </View>

                <View className="flex flex-row-reverse justify-between mx-2 mt-1">
                  <Text className="font-yekan"> توقفات تراشکاری </Text>
                  <Text className="font-yekan">{totalArc4.StopLathing}</Text>
                </View>

                <View className="flex flex-row-reverse justify-between mx-2 mt-1">
                  <Text className="font-yekan"> توقفات کانوایر </Text>
                  <Text className="font-yekan">{totalArc4.StopConwire}</Text>
                </View>

                <View className="flex flex-row-reverse justify-between mx-2 mt-1">
                  <Text className="font-yekan"> توقفات کانوایر </Text>
                  <Text className="font-yekan">{totalArc4.StopConwire}</Text>
                </View>

                <View className="flex flex-row-reverse justify-between mx-2 mt-1">
                  <Text className="font-yekan"> توقفات کنترل کیفیت </Text>
                  <Text className="font-yekan">
                    {totalArc4.StopQualityControl}
                  </Text>
                </View>

                <View className="flex flex-row-reverse justify-between mx-2 mt-1 mb-2">
                  <Text className="font-yekan"> توقفات کبود طوقه </Text>
                  <Text className="font-yekan">{totalArc4.StopToghe}</Text>
                </View>

                <Text className="text-xs font-yekan text-orange-500 m-2">
                  آمار بر اساس درصد
                </Text>

                <View className="flex flex-row-reverse justify-center flex-wrap">
                  <View className="flex flex-row-reverse">
                    <Text className="font-yekan"> تعداد اصلاحی : </Text>
                    <Text className="font-yekan">
                      {showCheckPercent(
                        totalArc4.totalProduct,
                        totalArc4.productionCorrective
                      )}
                    </Text>
                    <Divider orientation="vertical" />
                  </View>

                  <View className="flex flex-row-reverse">
                    <Text className="font-yekan"> تعداد اسقاط : </Text>
                    <Text className="font-yekan">
                      {showCheckPercent(
                        totalArc4.totalProduct,
                        totalArc4.productionAbortion
                      )}
                    </Text>
                    <Divider orientation="vertical" />
                  </View>

                  <View className="flex flex-row-reverse">
                    <Text className="font-yekan"> تعداد OK :</Text>
                    <Text className="font-yekan">
                      {showCheckPercent(
                        totalArc4.totalProduct,
                        totalArc4.productionSuccess
                      )}
                    </Text>
                    <Divider orientation="vertical" />
                  </View>

                  <View className="flex flex-row-reverse">
                    <Text className="font-yekan"> تاب و لنگی :</Text>
                    <Text className="font-yekan">
                      {showCheckPercent(
                        totalArc4.totalProduct,
                        totalArc4.productionLame
                      )}
                    </Text>
                    <Divider orientation="vertical" />
                  </View>

                  <View className="flex flex-row-reverse mb-3">
                    <Text className="font-yekan"> رپکن OK : </Text>
                    <Text className="font-yekan">
                      {showCheckPercent(
                        totalArc4.totalProduct,
                        totalArc4.productionRepkon
                      )}
                    </Text>
                    <Divider orientation="vertical" />
                  </View>
                </View>
              </View>

              <Text className="text-center p-2 font-yekan">
                ریز آمار روزانه
              </Text>

              {showArc3Details == false ? (
                <View className="m-1">
                  <Button
                    radius={20}
                    type="outline"
                    onPress={() => setShowArc3Details(!showArc3Details)}
                  >
                    <Text className="font-yekan text-blue-500">
                      مشاهده آمار ثبت شده روزانه ARC3
                    </Text>
                  </Button>
                </View>
              ) : (
                <View className="m-1">
                  <Button
                    radius={20}
                    type="outline"
                    onPress={() => setShowArc3Details(!showArc3Details)}
                  >
                    <Text className="font-yekan text-blue-500">
                      پنهان کردن ARC3
                    </Text>
                  </Button>
                </View>
              )}

              {showArc3Details && (
                <View>
                  {arc3.map((item) => (
                    <View
                      key={item.id}
                      className="bg-slate-200 rounded-lg p-2 m-2"
                    >
                      <Text className="text-base text-center font-yekan">
                        تاریخ
                        {moment(item.created_at).format("jYYYY-jMM-jDD")}
                      </Text>
                      <View className="flex flex-row-reverse justify-between mx-32 mt-1">
                        <Text className="font-yekan">  {item.device} </Text>
                        <Text className="font-yekan">{item.product}</Text>
                      </View>
                      
                      <View className="flex flex-row-reverse justify-between mx-2 mt-1">
                        <Text className="font-yekan"> تعداد تولید کل </Text>
                        <Text className="font-yekan">{item.totalProduct}</Text>
                      </View>

                      <View className="flex flex-row-reverse justify-between mx-2 mt-1">
                        <Text className="font-yekan"> تعداد اصلاحی </Text>
                        <Text className="font-yekan">
                          {item.productionCorrective}
                        </Text>
                      </View>

                      <View className="flex flex-row-reverse justify-between mx-2 mt-1">
                        <Text className="font-yekan"> تعداد اسقاطی </Text>
                        <Text className="font-yekan">
                          {item.productionAbortion}
                        </Text>
                      </View>

                      <View className="flex flex-row-reverse justify-between mx-2 mt-1">
                        <Text className="font-yekan"> تعداد تولید OK </Text>
                        <Text className="font-yekan">
                          {item.productionSuccess}
                        </Text>
                      </View>

                      <View className="flex flex-row-reverse justify-between mx-2 mt-1">
                        <Text className="font-yekan"> تاب و لنگی </Text>
                        <Text className="font-yekan">
                          {item.productionLame}
                        </Text>
                      </View>

                      <View className="flex flex-row-reverse justify-between mx-2 mt-1">
                        <Text className="font-yekan"> رپکن OK </Text>
                        <Text className="font-yekan">
                          {item.productionRepkon}
                        </Text>
                      </View>

                      <Text className="p-2 font-yekan text-xs text-orange-600">
                        توقفات
                      </Text>

                      <View className="flex flex-row-reverse justify-between mx-2 mt-1">
                        <Text className="font-yekan"> توقفات مکانیک </Text>
                        <Text className="font-yekan">{item.StopMechanic}</Text>
                      </View>

                      <View className="flex flex-row-reverse justify-between mx-2 mt-1">
                        <Text className="font-yekan"> توقفات جوشکاری </Text>
                        <Text className="font-yekan">{item.StopWelding}</Text>
                      </View>

                      <View className="flex flex-row-reverse justify-between mx-2 mt-1">
                        <Text className="font-yekan"> توقفات برقی </Text>
                        <Text className="font-yekan">
                          {item.StopElectricity}
                        </Text>
                      </View>

                      <View className="flex flex-row-reverse justify-between mx-2 mt-1">
                        <Text className="font-yekan"> توقفات تراشکاری </Text>
                        <Text className="font-yekan">{item.StopLathing}</Text>
                      </View>

                      <View className="flex flex-row-reverse justify-between mx-2 mt-1">
                        <Text className="font-yekan"> توقفات کانوایر </Text>
                        <Text className="font-yekan">{item.StopConwire}</Text>
                      </View>

                      <View className="flex flex-row-reverse justify-between mx-2 mt-1">
                        <Text className="font-yekan"> توقفات کانوایر </Text>
                        <Text className="font-yekan">{item.StopConwire}</Text>
                      </View>

                      <View className="flex flex-row-reverse justify-between mx-2 mt-1">
                        <Text className="font-yekan"> توقفات کنترل کیفیت </Text>
                        <Text className="font-yekan">
                          {item.StopQualityControl}
                        </Text>
                      </View>

                      <View className="flex flex-row-reverse justify-between mx-2 mt-1 mb-2">
                        <Text className="font-yekan"> توقفات کبود طوقه </Text>
                        <Text className="font-yekan">{item.StopToghe}</Text>
                      </View>

                      <Text className="text-xs font-yekan text-orange-500 m-2">
                        آمار بر اساس درصد
                      </Text>

                      <View className="flex flex-row-reverse justify-center flex-wrap">
                        <View className="flex flex-row-reverse">
                          <Text className="font-yekan"> تعداد اصلاحی : </Text>
                          <Text className="font-yekan">
                            {showCheckPercent(
                              item.totalProduct,
                              item.productionCorrective
                            )}
                          </Text>
                          <Divider orientation="vertical" />
                        </View>

                        <View className="flex flex-row-reverse">
                          <Text className="font-yekan"> تعداد اسقاط : </Text>
                          <Text className="font-yekan">
                            {showCheckPercent(
                              item.totalProduct,
                              item.productionAbortion
                            )}
                          </Text>
                          <Divider orientation="vertical" />
                        </View>

                        <View className="flex flex-row-reverse">
                          <Text className="font-yekan"> تعداد OK :</Text>
                          <Text className="font-yekan">
                            {showCheckPercent(
                              item.totalProduct,
                              item.productionSuccess
                            )}
                          </Text>
                          <Divider orientation="vertical" />
                        </View>

                        <View className="flex flex-row-reverse">
                          <Text className="font-yekan"> تاب و لنگی :</Text>
                          <Text className="font-yekan">
                            {showCheckPercent(
                              item.totalProduct,
                              item.productionLame
                            )}
                          </Text>
                          <Divider orientation="vertical" />
                        </View>

                        <View className="flex flex-row-reverse mb-3">
                          <Text className="font-yekan"> رپکن OK : </Text>
                          <Text className="font-yekan">
                            {showCheckPercent(
                              item.totalProduct,
                              item.productionRepkon
                            )}
                          </Text>
                          <Divider orientation="vertical" />
                        </View>
                      </View>
                    </View>
                  ))}
                </View>
              )}

              {showArc4Details == false ? (
                <View className="m-1">
                  <Button
                    radius={20}
                    type="outline"
                    onPress={() => setShowArc4Details(!showArc4Details)}
                  >
                    <Text className="font-yekan text-blue-500">
                      مشاهده آمار ثبت شده روزانه ARC4
                    </Text>
                  </Button>
                </View>
              ) : (
                <View className="m-1">
                  <Button
                    radius={20}
                    type="outline"
                    onPress={() => setShowArc4Details(!showArc4Details)}
                  >
                    <Text className="font-yekan text-blue-500">
                      پنهان کردن ARC4
                    </Text>
                  </Button>
                </View>
              )}

              {showArc4Details && (
                <View>
                  {arc4.map((item) => (
                    <View
                      key={item.id}
                      className="bg-slate-200 rounded-lg p-2 m-2"
                    >
                      <Text className="text-base text-center font-yekan">
                        تاریخ {moment(item.created_at).format("jYYYY-jMM-jDD")}
                      </Text>
                      
                      <View className="flex flex-row-reverse justify-between mx-32 mt-1">
                        <Text className="font-yekan">  {item.device} </Text>
                        <Text className="font-yekan">{item.product}</Text>
                      </View>
                      
                      <View className="flex flex-row-reverse justify-between mx-2 mt-1">
                        <Text className="font-yekan"> تعداد تولید کل </Text>
                        <Text className="font-yekan">{item.totalProduct}</Text>
                      </View>

                      <View className="flex flex-row-reverse justify-between mx-2 mt-1">
                        <Text className="font-yekan"> تعداد اصلاحی </Text>
                        <Text className="font-yekan">
                          {item.productionCorrective}
                        </Text>
                      </View>

                      <View className="flex flex-row-reverse justify-between mx-2 mt-1">
                        <Text className="font-yekan"> تعداد اسقاطی </Text>
                        <Text className="font-yekan">
                          {item.productionAbortion}
                        </Text>
                      </View>

                      <View className="flex flex-row-reverse justify-between mx-2 mt-1">
                        <Text className="font-yekan"> تعداد تولید OK </Text>
                        <Text className="font-yekan">
                          {item.productionSuccess}
                        </Text>
                      </View>

                      <View className="flex flex-row-reverse justify-between mx-2 mt-1">
                        <Text className="font-yekan"> تاب و لنگی </Text>
                        <Text className="font-yekan">
                          {item.productionLame}
                        </Text>
                      </View>

                      <View className="flex flex-row-reverse justify-between mx-2 mt-1">
                        <Text className="font-yekan"> رپکن OK </Text>
                        <Text className="font-yekan">
                          {item.productionRepkon}
                        </Text>
                      </View>

                      <Text className="p-2 font-yekan text-xs text-orange-600">
                        توقفات
                      </Text>

                      <View className="flex flex-row-reverse justify-between mx-2 mt-1">
                        <Text className="font-yekan"> توقفات مکانیک </Text>
                        <Text className="font-yekan">{item.StopMechanic}</Text>
                      </View>

                      <View className="flex flex-row-reverse justify-between mx-2 mt-1">
                        <Text className="font-yekan"> توقفات جوشکاری </Text>
                        <Text className="font-yekan">{item.StopWelding}</Text>
                      </View>

                      <View className="flex flex-row-reverse justify-between mx-2 mt-1">
                        <Text className="font-yekan"> توقفات برقی </Text>
                        <Text className="font-yekan">
                          {item.StopElectricity}
                        </Text>
                      </View>

                      <View className="flex flex-row-reverse justify-between mx-2 mt-1">
                        <Text className="font-yekan"> توقفات تراشکاری </Text>
                        <Text className="font-yekan">{item.StopLathing}</Text>
                      </View>

                      <View className="flex flex-row-reverse justify-between mx-2 mt-1">
                        <Text className="font-yekan"> توقفات کانوایر </Text>
                        <Text className="font-yekan">{item.StopConwire}</Text>
                      </View>

                      <View className="flex flex-row-reverse justify-between mx-2 mt-1">
                        <Text className="font-yekan"> توقفات کانوایر </Text>
                        <Text className="font-yekan">{item.StopConwire}</Text>
                      </View>

                      <View className="flex flex-row-reverse justify-between mx-2 mt-1">
                        <Text className="font-yekan"> توقفات کنترل کیفیت </Text>
                        <Text className="font-yekan">
                          {item.StopQualityControl}
                        </Text>
                      </View>

                      <View className="flex flex-row-reverse justify-between mx-2 mt-1 mb-2">
                        <Text className="font-yekan"> توقفات کبود طوقه </Text>
                        <Text className="font-yekan">{item.StopToghe}</Text>
                      </View>

                      <Text className="text-xs font-yekan text-orange-500 m-2">
                        آمار بر اساس درصد
                      </Text>

                      <View className="flex flex-row-reverse justify-center flex-wrap">
                        <View className="flex flex-row-reverse">
                          <Text className="font-yekan"> تعداد اصلاحی : </Text>
                          <Text className="font-yekan">
                            {showCheckPercent(
                              item.totalProduct,
                              item.productionCorrective
                            )}
                          </Text>
                          <Divider orientation="vertical" />
                        </View>

                        <View className="flex flex-row-reverse">
                          <Text className="font-yekan"> تعداد اسقاط : </Text>
                          <Text className="font-yekan">
                            {showCheckPercent(
                              item.totalProduct,
                              item.productionAbortion
                            )}
                          </Text>
                          <Divider orientation="vertical" />
                        </View>

                        <View className="flex flex-row-reverse">
                          <Text className="font-yekan"> تعداد OK :</Text>
                          <Text className="font-yekan">
                            {showCheckPercent(
                              item.totalProduct,
                              item.productionSuccess
                            )}
                          </Text>
                          <Divider orientation="vertical" />
                        </View>

                        <View className="flex flex-row-reverse">
                          <Text className="font-yekan"> تاب و لنگی :</Text>
                          <Text className="font-yekan">
                            {showCheckPercent(
                              item.totalProduct,
                              item.productionLame
                            )}
                          </Text>
                          <Divider orientation="vertical" />
                        </View>

                        <View className="flex flex-row-reverse mb-3">
                          <Text className="font-yekan"> رپکن OK : </Text>
                          <Text className="font-yekan">
                            {showCheckPercent(
                              item.totalProduct,
                              item.productionRepkon
                            )}
                          </Text>
                          <Divider orientation="vertical" />
                        </View>
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </View>
          </ScrollView>
        )}
      </Modal>

      <Modal
        visible={openFilterModal}
        animationType="slide"
        onRequestClose={() => {
          // Alert.alert("افزودن لغو شد");
          setOpenFilterModal(false);
        }}
      >
        <SafeAreaView>
          <View className="p-3 bg-blue-400 flex flex-row justify-between">
            <TouchableOpacity>
              <Icon
                onPress={() => {
                  setOpenFilterModal(false);
                }}
                name="x"
                style={{ color: "white", fontSize: 24 }}
              />
            </TouchableOpacity>
            <Text className="font-medium text-white text-base font-yekan">
              دریافت گزارش
            </Text>
            <Text> </Text>
          </View>

          <View>
            <Text className="font-yekan p-2 text-xs"> تاریخ شروع : </Text>

            <TouchableOpacity onPress={toggleDatepickerStart}>
              <TextInput
                className="bg-slate-200 mx-2 rounded-lg h-10 p-2"
                editable={false}
                placeholder="تاریخ شروع آمارگیری را وارد کنید"
                onChangeText={statisticsFormik.handleChange("startDate")}
                value={statisticsFormik.values.startDate}
              />
            </TouchableOpacity>

            {showStartDate && (
              <View className="h-96">
                <DatePicker
                  key={1}
                  style={{ height: "100%", marginTop: 10 }}
                  onDateChange={onChangeStart}
                />
              </View>
            )}
          </View>

          <View>
            <Text className="font-yekan p-2 text-xs"> تاریخ پایان : </Text>

            <TouchableOpacity onPress={toggleDatepickerEnd}>
              <TextInput
                className="bg-slate-200 mx-2 rounded-lg h-10 p-2"
                editable={false}
                placeholder="تاریخ پایان آمارگیری را وارد کنید"
                onChangeText={statisticsFormik.handleChange("endDate")}
                value={statisticsFormik.values.endDate}
              />
            </TouchableOpacity>

            {showEndDate && (
              <View className="h-96">
                <DatePicker
                  key={2}
                  style={{ height: "100%", marginTop: 10 }}
                  onDateChange={onChangeEnd}
                />
              </View>
            )}
          </View>

          <View className="mx-2 mt-4 ">
            <Button
              radius={8}
              // onPress={statisticsFormik.handleSubmit }
              onPress={statisticsFormik.handleSubmit}
            >
              <Text className="font-yekan text-white"> شروع آمار گیری </Text>
            </Button>

            {statisticsFormik.errors.startDate && (
              <Text
                style={{ fontSize: 12 }}
                className="text-red-500 mt-2 font-yekan"
              >
                *{statisticsFormik.errors.startDate}
              </Text>
            )}

            {statisticsFormik.errors.endDate && (
              <Text
                style={{ fontSize: 12 }}
                className="text-red-500 mt-2 font-yekan"
              >
                *{statisticsFormik.errors.endDate}
              </Text>
            )}
          </View>
        </SafeAreaView>
      </Modal>

      <Button radius={5} onPress={handleOpenFilter}>
        <Text className="font-yekan text-white">آمارگیری در بازه زمانی</Text>
      </Button>
    </>
  );
};

export default FilterStatistics;
