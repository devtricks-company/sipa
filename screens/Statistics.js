import {
  View,
  Text,
  Modal,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
  ToastAndroid,
  ActivityIndicator,

} from "react-native";
import { FAB } from "@rneui/themed";
import SelectDropdown from "react-native-select-dropdown";
import { useFormik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import Icon from "react-native-vector-icons/Feather";
import IconMaterial from "react-native-vector-icons/MaterialCommunityIcons";
import { Button, Divider } from "@rneui/base";
import moment from "jalali-moment";
import FilterStatistics from "../components/FilterStatistics";
import { db } from "../db";
import { StatisticsValidation } from "../components/ValidationSchema/StatisticsValidation";

export default function Statistics() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [modalStatus, setModelStatus] = useState(false);
  const [lampOptional, setLameOptional] = useState(false);
  const [stopOptional, setStopOptional] = useState(false);

  const [editModal, setEditModal] = useState(false);
  const [editItems, setEditItems] = useState([]);
  const [editLoading, setEditLoading] = useState(true);

  const [loadingShow, setLoadingShow] = useState(true);
  const [showItem, setShowItem] = useState([]);
  const [showModal, setShowModal] = useState(false);
  

  const handleScroll = (event) => {
    const currentOffset = event.nativeEvent.contentOffset.y;
    const scrollingUp = currentOffset < prevScrollY; // Compare with previous scroll position
    scrollY.setValue(currentOffset);
    setIsScrollingUp(scrollingUp);
    setPrevScrollY(currentOffset); // Update the previous scroll position
  };


  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        "create table if not exists practice1 (id integer primary key autoincrement, device text, totalProduct text, productionSuccess text, productionLame text, productionCorrective text, productionRepkon text, productionAbortion text, StopElectricity text, StopMechanic text, StopConwire text, StopWelding text, StopLathing text, StopQualityControl text, StopRepkon text, StopShortageDisk text, StopToghe text, created_at DATETIME DEFAULT CURRENT_TIMESTAMP, product text)"
      );

      db.transaction((tx) => {
        tx.executeSql(
          `select * from practice1 order by id DESC`,
          null,
          (_,  rows ) => { 

              setItems(rows.rows._array);
          }
        );
      });
    });

    setLoading(false);
  }, []);

  const handleFabClick = () => {
    setModelStatus(true);
  };

  const checkPercent = (second) => {
    if (formik.values.totalProduct != "") {
      const calculatedPercentage = (second / formik.values.totalProduct) * 100;
      return <Text> {calculatedPercentage.toFixed(0)} % </Text>;
    }
  };

  const showCheckPercent = (first, second) => {
    if (first != "") {
      const calculatedPercentage = (second / first) * 100;
      return <Text> {calculatedPercentage.toFixed(0)} % </Text>;
    }
  };

  function calcProductSuccess() {
    if (
      formik.values.totalProduct &&
      formik.values.productionCorrective &&
      formik.values.productionAbortion !== ""
    ) {
      const calc =
        formik.values.totalProduct -
        (parseInt(formik.values.productionCorrective) +
          parseInt(formik.values.productionAbortion));

      formik.values.productionSuccess = calc.toFixed(0);
      return <Text> {calc.toFixed(0)} </Text>;
    }
  }

  function calcRepkon() {
    if (formik.values.totalProduct && formik.values.productionLame !== "") {
      const calc =
        formik.values.totalProduct - parseInt(formik.values.productionLame);

      formik.values.productionRepkon = calc.toFixed(0);
      return <Text> {calc.toFixed(0)} </Text>;
    }
  }

  const checkPercentEdit = (second) => {
    if (editFormik.values.totalProduct != undefined) {
      const calculatedPercentage =
        (second / editFormik.values.totalProduct) * 100;
      return <Text> {calculatedPercentage.toFixed(0)} % </Text>;
    }
  };

  function calcProductSuccessEdit() {
    if (
      editFormik.values.totalProduct &&
      editFormik.values.productionCorrective &&
      editFormik.values.productionAbortion !== ""
    ) {
      const calc =
        editFormik.values.totalProduct -
        (parseInt(editFormik.values.productionCorrective) +
          parseInt(editFormik.values.productionAbortion));

      editFormik.values.productionSuccess = calc.toFixed(0);
      return <Text> {calc.toFixed(0)} </Text>;
    }
  }

  function calcRepkonEdit() {
    if (
      editFormik.values.totalProduct &&
      editFormik.values.productionLame !== ""
    ) {
      const calc =
        editFormik.values.totalProduct -
        parseInt(editFormik.values.productionLame);

      editFormik.values.productionRepkon = calc.toFixed(0);
      return <Text> {calc.toFixed(0)} </Text>;
    }
  }

  const style = StyleSheet.create({
    inputs: {
      backgroundColor: "#efefef",
      padding: 4,
      // margin: 1,
      borderRadius: 10,
      width: "99%",
      textAlign: "right",
      fontFamily: "YekanBakh",
      marginTop: 4,
      height: 37,
    },
  });

  const formik = useFormik({
    validationSchema: StatisticsValidation,
    initialValues: {
      device: "",
      totalProduct: "",
      productionSuccess: "",
      productionLame: "",
      productionCorrective: "",
      productionRepkon: "",
      productionAbortion: "",
      StopElectricity: "",
      StopMechanic: "",
      StopConwire: "",
      StopWelding: "",
      StopLathing: "",
      StopQualityControl: "",
      StopRepkon: "",
      StopShortageDisk: "",
      StopToghe: "",
      created_at: "",
      product: "",
    },

    onSubmit: (values) => {
      db.transaction((tx) => {
        tx.executeSql(
          "create table if not exists practice1 (id integer primary key autoincrement, device text, totalProduct text, productionSuccess text, productionLame text, productionCorrective text, productionRepkon text, productionAbortion text, StopElectricity text, StopMechanic text, StopConwire text, StopWelding text, StopLathing text, StopQualityControl text, StopRepkon text, StopShortageDisk text, StopToghe text, created_at DATETIME DEFAULT CURRENT_TIMESTAMP, product text)"
        );

        tx.executeSql(
          "insert into practice1 (device, totalProduct, productionSuccess, productionLame, productionRepkon, productionCorrective, productionAbortion, StopElectricity, StopMechanic, StopConwire, StopWelding, StopLathing, StopQualityControl, StopRepkon, StopShortageDisk, StopToghe, created_at, product) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
          [
            values.device,
            values.totalProduct,
            values.productionSuccess,
            values.productionLame,
            values.productionRepkon,
            values.productionCorrective,
            values.productionAbortion,
            values.StopElectricity,
            values.StopMechanic,
            values.StopConwire,
            values.StopWelding,
            values.StopLathing,
            values.StopQualityControl,
            values.StopRepkon,
            values.StopShortageDisk,
            values.StopToghe,
            Date.now(),
            values.product,
          ],
          (_, result) => {
            if (result.rowsAffected > 0) {
              const newItem = [
                ...items,
                {
                  id: result.insertId,
                  device: values.device,
                  totalProduct: values.totalProduct,
                  productionSuccess: values.productionSuccess,
                  productionLame: values.productionLame,
                  productionRepkon: values.productionRepkon,
                  productionCorrective: values.productionCorrective,
                  productionAbortion: values.productionAbortion,
                  StopElectricity: values.StopElectricity,
                  StopMechanic: values.StopMechanic,
                  StopConwire: values.StopConwire,
                  StopWelding: values.StopWelding,
                  StopLathing: values.StopLathing,
                  StopQualityControl: values.StopQualityControl,
                  StopRepkon: values.StopRepkon,
                  StopShortageDisk: values.StopShortageDisk,
                  StopToghe: values.StopToghe,
                  created_at: Date.now(),
                  product: values.product,
                },
              ];
              setItems(newItem);
              setModelStatus(false);
              formik.resetForm();
              ToastAndroid.showWithGravity(
                "آمار با موفقیت ثبت شد.",
                2500,
                2500
              );
            }
          },
          (_, error) => console.log(error)
        );
      }, null);
    },
  });

  const editFormik = useFormik({
    validationSchema: StatisticsValidation,
    initialValues: {
      id: "",
      device: "",
      totalProduct: "",
      productionSuccess: "",
      productionLame: "",
      productionCorrective: "",
      productionRepkon: "",
      productionAbortion: "",
      StopElectricity: "",
      StopMechanic: "",
      StopConwire: "",
      StopWelding: "",
      StopLathing: "",
      StopQualityControl: "",
      StopRepkon: "",
      StopShortageDisk: "",
      StopToghe: "",
      created_at: "",
      product: "",
    },

    onSubmit: (values) => {
      db.transaction((tx) => {
        tx.executeSql(
          `UPDATE practice1 SET
           device = ?,
           totalProduct = ?,
           productionSuccess = ?,
           productionLame = ?,
           productionRepkon = ?,
           productionCorrective = ?,
           productionAbortion = ?,
           StopElectricity = ?,
           StopMechanic = ?,
           StopConwire = ?,
           StopWelding = ?,
           StopLathing = ?,
           StopQualityControl = ?,
           StopRepkon = ?,
           StopShortageDisk = ?,
           StopToghe = ?,
           product = ?
           WHERE id = ?`,
          [
            values.device,
            values.totalProduct,
            values.productionSuccess,
            values.productionLame,
            values.productionRepkon,
            values.productionCorrective,
            values.productionAbortion,
            values.StopElectricity,
            values.StopMechanic,
            values.StopConwire,
            values.StopWelding,
            values.StopLathing,
            values.StopQualityControl,
            values.StopRepkon,
            values.StopShortageDisk,
            values.StopToghe,
            values.product,
            values.id,
          ],
          (_, result) => {
            if (result.rowsAffected > 0) {
              // Update the state with the new values
              const updatedItems = items.map((item) => {
                if (item.id === values.id) {
                  return { ...item, ...values };
                } else {
                  return item;
                }
              });

              setItems(updatedItems);

              setEditModal(false);
              formik.resetForm();

              ToastAndroid.showWithGravity(
                "ویرایش با موفقیت انجام شد",
                ToastAndroid.LONG,
                ToastAndroid.CENTER
              );
            }
          },
          (_, error) => console.log(error)
        );
      }, null);
    },
  });

  if (loading) {
    return (
      <ActivityIndicator size="large" color="black" style={{ marginTop: 30 }} />
    );
  }

  const edit = async (id) => {
    try {
      const result = await new Promise((resolve, reject) => {
        db.transaction((tx) => {
          tx.executeSql(
            `SELECT * FROM practice1 WHERE id = ?`,
            [id],
            (_, queryResult) => {
              resolve(queryResult);
            },
            (_, error) => {
              reject(error);
            }
          );
        });
      });

      if (result.rows.length > 0) {
        // Data is fetched successfully
        const editItem = result.rows.item(0);
        setEditItems(editItem);
        setEditModal(true);

        // Set the initial values for editFormik using the fetched data
        editFormik.setValues({
          id: id,
          device: editItem.device,
          totalProduct: editItem.totalProduct,
          productionLame: editItem.productionLame,
          productionCorrective: editItem.productionCorrective,
          productionAbortion: editItem.productionAbortion,
          StopElectricity: editItem.StopElectricity,
          StopMechanic: editItem.StopMechanic,
          StopConwire: editItem.StopConwire,
          StopWelding: editItem.StopWelding,
          StopLathing: editItem.StopLathing,
          StopQualityControl: editItem.StopQualityControl,
          StopRepkon: editItem.StopRepkon,
          StopShortageDisk: editItem.StopShortageDisk,
          StopToghe: editItem.StopToghe,
          created_at: editItem.created_at,
          product: editItem.product,
        });
        setEditLoading(false);
      } else {
        // Handle the case when no data is found for the given ID
        console.log("No data found for ID:", id);
        setEditLoading(false);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setEditLoading(false);
    }
  };

  const show = (id) => {
    db.transaction((tx) => {
      tx.executeSql(
        `select * from practice1 where id = ${id}`,
        null,
        (_, result) => {
          setShowItem(result.rows._array[0]),
            (_, error) => {
              console.log(error);
            };
        }
      );
      setLoadingShow(false);
      setShowModal(true);
    });
  };

  return (
    <>
      <Modal
        visible={showModal}
        animationType="slide"
        onRequestClose={() => {
          setShowModal(!showModal);
        }}
      >
        <View className="p-3 bg-blue-400 flex flex-row justify-between">
          <TouchableOpacity>
            <Icon
              onPress={() => {
                setShowModal(false);
              }}
              name="x"
              style={{ color: "white", fontSize: 24 }}
            />
          </TouchableOpacity>
          <Text className="font-medium text-white text-base font-yekan">
            مشاهده امار
          </Text>
          <Text> </Text>
        </View>

        {loadingShow ? (
          <ActivityIndicator size="large" color={"black"} />
        ) : (
          <ScrollView>
            <View className="bg-slate-100 p-2 m-2">
              <Text className="font-yekan text-red-500 text-lg">
                اطلاعات کامل امار ثبت شده
              </Text>
              <Divider />

              <View className="flex flex-col mt-2">
                <Text className="text-lg font-yekan text-orange-500">
                  امار های تولیدی
                </Text>

                <View className="flex flex-row-reverse justify-between m-2">
                  <Text className="font-yekan"> دستگاه : </Text>
                  <Text className="font-yekan"> {showItem.device} </Text>
                </View>

                <View className="flex flex-row-reverse justify-between m-2">
                  <Text className="font-yekan"> محصول : </Text>
                  <Text className="font-yekan"> {showItem.product} </Text>
                </View>

                <View className="flex flex-row-reverse justify-between m-2">
                  <Text className="font-yekan"> تعداد تولید کل : </Text>
                  <Text className="font-yekan"> {showItem.totalProduct} </Text>
                </View>

                <View className="flex flex-row-reverse justify-between m-2">
                  <Text className="font-yekan"> تعداد اصلاحی : </Text>
                  <Text className="font-yekan">
                    {showItem.productionCorrective}
                  </Text>
                </View>

                <View className="flex flex-row-reverse justify-between m-2">
                  <Text className="font-yekan"> تعداد اسقاطی : </Text>
                  <Text className="font-yekan">
                    {showItem.productionAbortion}
                  </Text>
                </View>

                <View className="flex flex-row-reverse justify-between m-2">
                  <Text className="font-yekan"> تعداد تولید OK : </Text>
                  <Text className="font-yekan">
                    {showItem.productionSuccess}
                  </Text>
                </View>

                <View className="flex flex-row-reverse justify-between m-2">
                  <Text className="font-yekan"> تاب و لنگی : </Text>
                  <Text className="font-yekan">{showItem.productionLame}</Text>
                </View>

                <View className="flex flex-row-reverse justify-between m-2">
                  <Text className="font-yekan"> رپکن OK : </Text>
                  <Text className="font-yekan">
                    {showItem.productionRepkon}
                  </Text>
                </View>

                <Divider />

                <Text className="text-lg font-yekan text-orange-500 mt-2">
                  آمار بر اساس درصد
                </Text>

                <View className="flex flex-row-reverse justify-center mt-2 flex-wrap">
                  <View className="flex flex-row-reverse">
                    <Text className="font-yekan"> تعداد اصلاحی : </Text>
                    <Text className="font-yekan">
                      {showCheckPercent(
                        showItem.totalProduct,
                        showItem.productionCorrective
                      )}
                    </Text>
                    <Divider orientation="vertical" />
                  </View>

                  <View className="flex flex-row-reverse">
                    <Text className="font-yekan"> تعداد اسقاط : </Text>
                    <Text className="font-yekan">
                      {showCheckPercent(
                        showItem.totalProduct,
                        showItem.productionAbortion
                      )}
                    </Text>
                    <Divider orientation="vertical" />
                  </View>

                  <View className="flex flex-row-reverse">
                    <Text className="font-yekan"> تعداد OK :</Text>
                    <Text className="font-yekan">
                      {showCheckPercent(
                        showItem.totalProduct,
                        showItem.productionSuccess
                      )}
                    </Text>
                    <Divider orientation="vertical" />
                  </View>

                  <View className="flex flex-row-reverse">
                    <Text className="font-yekan"> تاب و لنگی :</Text>
                    <Text className="font-yekan">
                      {showCheckPercent(
                        showItem.totalProduct,
                        showItem.productionLame
                      )}
                    </Text>
                    <Divider orientation="vertical" />
                  </View>

                  <View className="flex flex-row-reverse">
                    <Text className="font-yekan"> رپکن OK : </Text>
                    <Text className="font-yekan">
                      {showCheckPercent(
                        showItem.totalProduct,
                        showItem.productionRepkon
                      )}
                    </Text>
                    <Divider orientation="vertical" />
                  </View>
                </View>

                <Divider style={{ marginTop: 12 }} />

                <Text className="text-lg font-yekan text-orange-500 mt-2">
                  آمار توقفات
                </Text>

                <View className="flex flex-row-reverse justify-between m-2">
                  <Text className="font-yekan"> توقفات مکانیک : </Text>
                  <Text className="font-yekan">{showItem.StopMechanic}</Text>
                </View>

                <View className="flex flex-row-reverse justify-between m-2">
                  <Text className="font-yekan"> توقفات جوشکاری : </Text>
                  <Text className="font-yekan">{showItem.StopWelding}</Text>
                </View>

                <View className="flex flex-row-reverse justify-between m-2">
                  <Text className="font-yekan"> توقفات برقی : </Text>
                  <Text className="font-yekan">{showItem.StopElectricity}</Text>
                </View>

                <View className="flex flex-row-reverse justify-between m-2">
                  <Text className="font-yekan"> توقفات تراشکاری : </Text>
                  <Text className="font-yekan">{showItem.StopLathing}</Text>
                </View>

                <View className="flex flex-row-reverse justify-between m-2">
                  <Text className="font-yekan"> توقفات کانوایر : </Text>
                  <Text className="font-yekan">{showItem.StopConwire}</Text>
                </View>

                <View className="flex flex-row-reverse justify-between m-2">
                  <Text className="font-yekan"> توقفات کانوایر : </Text>
                  <Text className="font-yekan">{showItem.StopConwire}</Text>
                </View>

                <View className="flex flex-row-reverse justify-between m-2">
                  <Text className="font-yekan"> توقفات کنترل کیفیت : </Text>
                  <Text className="font-yekan">
                    {showItem.StopQualityControl}
                  </Text>
                </View>

                <View className="flex flex-row-reverse justify-between m-2">
                  <Text className="font-yekan"> توقفات کبود طوقه : </Text>
                  <Text className="font-yekan">{showItem.StopToghe}</Text>
                </View>
              </View>
            </View>
          </ScrollView>
        )}
      </Modal>

      {editModal ? (
        <Modal
          visible={editModal}
          animationType="slide"
          onRequestClose={() => {
            // Alert.alert("افزودن لغو شد");
            editFormik.resetForm();
            setEditModal(!editModal);
          }}
        >
          <ScrollView>
            {editLoading ? (
              <ActivityIndicator
                size="large"
                color="black"
                style={{ marginTop: 20 }}
              />
            ) : (
              <SafeAreaView>
                <View className="p-3 bg-blue-400 flex flex-row justify-between">
                  <TouchableOpacity>
                    <Icon
                      onPress={() => {
                        // Alert.alert("Modal has been closed");
                        editFormik.resetForm();
                        setEditModal(false);
                      }}
                      name="x"
                      style={{ color: "white", fontSize: 24 }}
                    />
                  </TouchableOpacity>
                  <Text className="font-medium text-white text-base font-yekan">
                    ویرایش آمار
                  </Text>
                  <Text> </Text>
                </View>

                <View className="p-2">
                  <Text className="text-xs font-yekan text-gray-600">
                    دستگاه :
                  </Text>
                  <SelectDropdown
                    buttonStyle={style.inputs}
                    buttonTextStyle={{ textAlign: "right", fontSize: 12 }}
                    defaultButtonText={
                      <Text className="font-yekan text-md text-gray-500">
                        دستگاه
                      </Text>
                    }
                    data={["ARC3", "ARC4"]}
                    value={editFormik.values.device}
                    onSelect={editFormik.handleChange("device")}
                    defaultValue={editFormik.values.device}
                    onChangeText={editFormik.handleChange("device")}
                  />

                  {editFormik.errors.device && (
                    <Text
                      style={{ fontSize: 12 }}
                      className="text-red-500  mb-2 font-yekan"
                    >
                      *{editFormik.errors.device}
                    </Text>
                  )}

                  <Text className="text-xs font-yekan text-gray-600 mt-2">
                    محصول :
                  </Text>
                  <SelectDropdown
                    buttonStyle={style.inputs}
                    buttonTextStyle={{ textAlign: "right", fontSize: 12 }}
                    defaultButtonText={
                      <Text className="font-yekan text-md text-gray-500">
                        محصول
                      </Text>
                    }
                    data={["پراید", "ساینا", "تیبا", "پژو ۴۰۵", "پژو ۲۰۶"]}
                    value={editFormik.values.product}
                    defaultValue={editFormik.values.product}
                    onSelect={editFormik.handleChange("product")}
                    onChangeText={editFormik.handleChange("product")}
                  />

                  {editFormik.errors.product && (
                    <Text
                      style={{ fontSize: 12 }}
                      className="text-red-500  mb-2 font-yekan"
                    >
                      *{editFormik.errors.product}
                    </Text>
                  )}

                  <Text className="text-xs font-yekan text-gray-600 mt-2">
                    تولید کل :
                  </Text>
                  <TextInput
                    keyboardType="numeric"
                    style={style.inputs}
                    placeholder="تولید کل"
                    onChangeText={editFormik.handleChange("totalProduct")}
                    onBlur={editFormik.handleBlur("totalProduct")}
                    value={editFormik.values.totalProduct}
                  />
                  {editFormik.errors.totalProduct && (
                    <Text
                      style={{ fontSize: 12 }}
                      className="text-red-500 mb-2 font-yekan"
                    >
                      *{editFormik.errors.totalProduct}
                    </Text>
                  )}

                  <Text className="text-xs font-yekan text-gray-600 mt-2">
                    تعداد اصلاحی :
                  </Text>
                  <TextInput
                    keyboardType="numeric"
                    style={style.inputs}
                    placeholder="تعداد اصلاحی"
                    onChangeText={editFormik.handleChange(
                      "productionCorrective"
                    )}
                    onBlur={editFormik.handleBlur("productionCorrective")}
                    value={editFormik.values.productionCorrective}
                  />
                  {editFormik.errors.productionCorrective && (
                    <Text
                      style={{ fontSize: 12 }}
                      className="text-red-500 font-yekan mb-2"
                    >
                      *{editFormik.errors.productionCorrective}
                    </Text>
                  )}
                  {editFormik.values.productionCorrective != ""
                    ? checkPercentEdit(editFormik.values.productionCorrective)
                    : null}

                  <Text className="text-xs font-yekan text-gray-600 mt-2">
                    تعداد اسقاط :
                  </Text>
                  <TextInput
                    style={style.inputs}
                    keyboardType="numeric"
                    placeholder="تعداد اسقاط"
                    onChangeText={editFormik.handleChange("productionAbortion")}
                    onBlur={editFormik.handleBlur("productionAbortion")}
                    value={editFormik.values.productionAbortion}
                  />
                  {editFormik.errors.productionAbortion && (
                    <Text
                      style={{ fontSize: 12 }}
                      className="text-red-500 font-yekan mb-2"
                    >
                      *{editFormik.errors.productionAbortion}
                    </Text>
                  )}

                  {editFormik.values.productionAbortion != ""
                    ? checkPercentEdit(editFormik.values.productionAbortion)
                    : null}

                  <Text className="text-xs font-yekan text-gray-600 mt-2">
                    تعداد تولید صحیح :
                  </Text>
                  <View className="flex justify-between flex-row-reverse mt-2 h-9 bg-gray-200 p-2 rounded-lg">
                    <View>{calcProductSuccessEdit()}</View>

                    <View>
                      {editFormik.values.productionSuccess != ""
                        ? checkPercentEdit(editFormik.values.productionSuccess)
                        : null}
                    </View>
                  </View>

                  {!lampOptional ? (
                    <Button
                      size="sm"
                      onPress={() => setLameOptional(true)}
                      type="outline"
                      buttonStyle={{ margin: 6, borderRadius: 10 }}
                    >
                      <Text className="font-yekan text-blue-500">
                        مایل به وارد کردن تعداد تاب لنگی هستید ؟
                      </Text>
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      onPress={() => setLameOptional(false)}
                      type="outline"
                      buttonStyle={{ margin: 6, borderRadius: 10 }}
                    >
                      <Text className="font-yekan text-blue-500">
                        پنهان کردن تاب لنگی
                      </Text>
                    </Button>
                  )}

                  {lampOptional ? (
                    <>
                      <Text className="text-xs font-yekan text-gray-600 mt-2">
                        تعداد تاب لنگی :
                      </Text>
                      <TextInput
                        style={style.inputs}
                        keyboardType="numeric"
                        placeholder="تعداد تاب لنگی (اختیاری)"
                        onChangeText={editFormik.handleChange("productionLame")}
                        onBlur={editFormik.handleBlur("productionLame")}
                        value={editFormik.values.productionLame}
                      />
                      {editFormik.values.productionLame != ""
                        ? checkPercentEdit(editFormik.values.productionLame)
                        : null}

                      <Text className="text-xs font-yekan text-gray-600 mt-2">
                        تعداد رپکن OK :
                      </Text>
                      <View className="flex justify-between flex-row-reverse mt-2 h-9 bg-gray-200 p-2 rounded-lg">
                        <View>{calcRepkonEdit()}</View>

                        <View>
                          {editFormik.values.productionRepkon != ""
                            ? checkPercentEdit(
                                editFormik.values.productionRepkon
                              )
                            : null}
                        </View>
                      </View>
                    </>
                  ) : null}

                  {!stopOptional ? (
                    <Button
                      size="sm"
                      onPress={() => setStopOptional(true)}
                      type="outline"
                      buttonStyle={{ margin: 6, borderRadius: 10 }}
                    >
                      <Text className="font-yekan text-blue-500">
                        مایل به وارد کردن تعداد توقفات هستید ؟
                      </Text>
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      onPress={() => setStopOptional(false)}
                      type="outline"
                      buttonStyle={{ margin: 6, borderRadius: 10 }}
                    >
                      <Text className="font-yekan text-blue-500">
                        پنهان کردن توقفات
                      </Text>
                    </Button>
                  )}

                  {stopOptional ? (
                    <>
                      <Text className="text-xs font-yekan text-gray-600 mt-2">
                        توقف برقی :
                      </Text>
                      <TextInput
                        style={style.inputs}
                        keyboardType="numeric"
                        placeholder="برقی"
                        onChangeText={editFormik.handleChange(
                          "StopElectricity"
                        )}
                        onBlur={editFormik.handleBlur("StopElectricity")}
                        value={editFormik.values.StopElectricity}
                      />
                      {editFormik.errors.StopElectricity && (
                        <Text
                          style={{ fontSize: 12 }}
                          className="text-red-500 mb-2 font-yekan"
                        >
                          *{editFormik.errors.StopElectricity}
                        </Text>
                      )}

                      <Text className="text-xs font-yekan text-gray-600 mt-2">
                        توقفات مکانیک :
                      </Text>
                      <TextInput
                        keyboardType="numeric"
                        style={style.inputs}
                        placeholder="مکانیک"
                        onChangeText={editFormik.handleChange("StopMechanic")}
                        onBlur={editFormik.handleBlur("StopMechanic")}
                        value={editFormik.values.StopMechanic}
                      />
                      {editFormik.errors.StopMechanic && (
                        <Text
                          style={{ fontSize: 12 }}
                          className="text-red-500 mb-2 font-yekan"
                        >
                          *{editFormik.errors.StopMechanic}
                        </Text>
                      )}

                      <Text className="text-xs font-yekan text-gray-600 mt-2">
                        توقفات کانوایر :
                      </Text>
                      <TextInput
                        keyboardType="numeric"
                        style={style.inputs}
                        placeholder="کانوایر"
                        onChangeText={editFormik.handleChange("StopConwire")}
                        onBlur={editFormik.handleBlur("StopConwire")}
                        value={editFormik.values.StopConwire}
                      />

                      {editFormik.errors.StopConwire && (
                        <Text
                          style={{ fontSize: 12 }}
                          className="text-red-500 mb-2 font-yekan"
                        >
                          *{editFormik.errors.StopConwire}
                        </Text>
                      )}

                      <Text className="text-xs font-yekan text-gray-600 mt-2">
                        توقفات جوشکاری :
                      </Text>
                      <TextInput
                        keyboardType="numeric"
                        style={style.inputs}
                        placeholder="جوشکاری"
                        onChangeText={editFormik.handleChange("StopWelding")}
                        onBlur={editFormik.handleBlur("StopWelding")}
                        value={editFormik.values.StopWelding}
                      />
                      {editFormik.errors.StopWelding && (
                        <Text
                          style={{ fontSize: 12 }}
                          className="text-red-500 mb-2 font-yekan"
                        >
                          *{editFormik.errors.StopWelding}
                        </Text>
                      )}

                      <Text className="text-xs font-yekan text-gray-600 mt-2">
                        توقفات تراشکاری :
                      </Text>
                      <TextInput
                        keyboardType="numeric"
                        style={style.inputs}
                        placeholder="جوشکاری"
                        onChangeText={editFormik.handleChange("StopLathing")}
                        onBlur={editFormik.handleBlur("StopLathing")}
                        value={editFormik.values.StopLathing}
                      />
                      {editFormik.errors.StopLathing && (
                        <Text
                          style={{ fontSize: 12 }}
                          className="text-red-500 mb-2 font-yekan"
                        >
                          *{editFormik.errors.StopLathing}
                        </Text>
                      )}

                      <Text className="text-xs font-yekan text-gray-600 mt-2">
                        توقفات واحد کنترل کیفیت :
                      </Text>
                      <TextInput
                        keyboardType="numeric"
                        style={style.inputs}
                        placeholder="کنترل کیفیت"
                        onChangeText={editFormik.handleChange(
                          "StopQualityControl"
                        )}
                        onBlur={editFormik.handleBlur("StopQualityControl")}
                        value={editFormik.values.StopQualityControl}
                      />
                      {editFormik.errors.StopQualityControl && (
                        <Text
                          style={{ fontSize: 12 }}
                          className="text-red-500 mb-2 font-yekan"
                        >
                          *{editFormik.errors.StopQualityControl}
                        </Text>
                      )}

                      <Text className="text-xs font-yekan text-gray-600 mt-2">
                        توقفات رپکن :
                      </Text>
                      <TextInput
                        keyboardType="numeric"
                        style={style.inputs}
                        placeholder="رپکن"
                        onChangeText={editFormik.handleChange("StopRepkon")}
                        onBlur={editFormik.handleBlur("StopRepkon")}
                        value={editFormik.values.StopRepkon}
                      />
                      {editFormik.errors.StopRepkon && (
                        <Text
                          style={{ fontSize: 12 }}
                          className="text-red-500 mb-2 font-yekan"
                        >
                          *{editFormik.errors.StopRepkon}
                        </Text>
                      )}

                      <Text className="text-xs font-yekan text-gray-600 mt-2">
                        توقفات کمبود دیسک :
                      </Text>
                      <TextInput
                        keyboardType="numeric"
                        style={style.inputs}
                        placeholder="دیسک"
                        onChangeText={editFormik.handleChange(
                          "StopShortageDisk"
                        )}
                        onBlur={editFormik.handleBlur("StopShortageDisk")}
                        value={editFormik.values.StopShortageDisk}
                      />
                      {editFormik.errors.StopShortageDisk && (
                        <Text
                          style={{ fontSize: 12 }}
                          className="text-red-500 mb-2 font-yekan"
                        >
                          *{editFormik.errors.StopShortageDisk}
                        </Text>
                      )}

                      <Text className="text-xs font-yekan text-gray-600 mt-2">
                        توقفات طوقه :
                      </Text>
                      <TextInput
                        keyboardType="numeric"
                        style={style.inputs}
                        placeholder="طوقه"
                        onChangeText={editFormik.handleChange("StopToghe")}
                        onBlur={editFormik.handleBlur("StopToghe")}
                        value={editFormik.values.StopToghe}
                      />
                      {editFormik.errors.StopToghe && (
                        <Text
                          style={{ fontSize: 12 }}
                          className="text-red-500 mb-2 font-yekan"
                        >
                          *{editFormik.errors.StopToghe}
                        </Text>
                      )}

                      <Text className="p-2 text-red-600 font-yekan text-xs">
                        توقفات را بر حسب دقیقه وارد کنید .
                      </Text>
                    </>
                  ) : null}

                  <Button
                    style={{ marginTop: 10 }}
                    containerStyle={{ marginTop: 12 }}
                    onPress={editFormik.handleSubmit}
                    radius={"sm"}
                    type="solid"
                    size="sm"
                  >
                    <Text className="font-yekan text-white"> ویرایش آمار </Text>
                    {/* <Icon name="save" color="white" /> */}
                  </Button>
                </View>
              </SafeAreaView>
            )}
          </ScrollView>
        </Modal>
      ) : null}

      <Modal
        visible={modalStatus}
        animationType="slide"
        onRequestClose={() => {
          // Alert.alert("افزودن لغو شد");
          formik.resetForm();
          setModelStatus(!modalStatus);
        }}
      >
        <ScrollView>
          <SafeAreaView>
            <View className="p-3 bg-blue-400 flex flex-row justify-between">
              <TouchableOpacity>
                <Icon
                  onPress={() => {
                    // Alert.alert("Modal has been closed");
                    formik.resetForm();
                    setModelStatus(false);
                  }}
                  name="x"
                  style={{ color: "white", fontSize: 24 }}
                />
              </TouchableOpacity>
              <Text className="font-medium text-white text-base font-yekan">
                افزودن آمار
              </Text>
              <Text> </Text>
            </View>

            <View className="p-2">
              <Text className="text-xs font-yekan text-gray-600">دستگاه :</Text>
              <SelectDropdown
                buttonStyle={style.inputs}
                buttonTextStyle={{ textAlign: "right", fontSize: 12 }}
                defaultButtonText={
                  <Text className="font-yekan text-md text-gray-500">
                    دستگاه
                  </Text>
                }
                data={["ARC3", "ARC4"]}
                value={formik.values.device}
                onSelect={formik.handleChange("device")}
                onChangeText={formik.handleChange("device")}
              />

              {formik.errors.device && (
                <Text
                  style={{ fontSize: 12 }}
                  className="text-red-500  mb-2 font-yekan"
                >
                  *{formik.errors.device}
                </Text>
              )}

              <Text className="text-xs font-yekan text-gray-600 mt-2">
                محصول :
              </Text>
              <SelectDropdown
                buttonStyle={style.inputs}
                buttonTextStyle={{ textAlign: "right", fontSize: 12 }}
                defaultButtonText={
                  <Text className="font-yekan text-md text-gray-500">
                    محصول
                  </Text>
                }
                data={["پراید", "ساینا", "تیبا", "پژو ۴۰۵", "پژو ۲۰۶"]}
                value={formik.values.product}
                onSelect={formik.handleChange("product")}
                onChangeText={formik.handleChange("product")}
              />

              {formik.errors.product && (
                <Text
                  style={{ fontSize: 12 }}
                  className="text-red-500  mb-2 font-yekan"
                >
                  *{formik.errors.product}
                </Text>
              )}

              <Text className="text-xs font-yekan text-gray-600 mt-2">
                تولید کل :
              </Text>
              <TextInput
                keyboardType="numeric"
                style={style.inputs}
                placeholder="تولید کل"
                onChangeText={formik.handleChange("totalProduct")}
                onBlur={formik.handleBlur("totalProduct")}
                value={formik.values.totalProduct}
              />
              {formik.errors.totalProduct && (
                <Text
                  style={{ fontSize: 12 }}
                  className="text-red-500 mb-2 font-yekan"
                >
                  *{formik.errors.totalProduct}
                </Text>
              )}

              <Text className="text-xs font-yekan text-gray-600 mt-2">
                تعداد اصلاحی :
              </Text>
              <TextInput
                keyboardType="numeric"
                style={style.inputs}
                placeholder="تعداد اصلاحی"
                onChangeText={formik.handleChange("productionCorrective")}
                onBlur={formik.handleBlur("productionCorrective")}
                value={formik.values.productionCorrective}
              />
              {formik.errors.productionCorrective && (
                <Text
                  style={{ fontSize: 12 }}
                  className="text-red-500 font-yekan mb-2"
                >
                  *{formik.errors.productionCorrective}
                </Text>
              )}
              {formik.values.productionCorrective != ""
                ? checkPercent(formik.values.productionCorrective)
                : null}

              <Text className="text-xs font-yekan text-gray-600 mt-2">
                تعداد اسقاط :
              </Text>
              <TextInput
                style={style.inputs}
                keyboardType="numeric"
                placeholder="تعداد اسقاط"
                onChangeText={formik.handleChange("productionAbortion")}
                onBlur={formik.handleBlur("productionAbortion")}
                value={formik.values.productionAbortion}
              />
              {formik.errors.productionAbortion && (
                <Text
                  style={{ fontSize: 12 }}
                  className="text-red-500 font-yekan mb-2"
                >
                  *{formik.errors.productionAbortion}
                </Text>
              )}

              {formik.values.productionAbortion != ""
                ? checkPercent(formik.values.productionAbortion)
                : null}

              <Text className="text-xs font-yekan text-gray-600 mt-2">
                تعداد تولید صحیح :
              </Text>
              <View className="flex justify-between flex-row-reverse mt-2 h-9 bg-gray-200 p-2 rounded-lg">
                <View>{calcProductSuccess()}</View>

                <View>
                  {formik.values.productionSuccess != ""
                    ? checkPercent(formik.values.productionSuccess)
                    : null}
                </View>
              </View>

              {!lampOptional ? (
                <Button
                  size="sm"
                  onPress={() => setLameOptional(true)}
                  type="outline"
                  buttonStyle={{ margin: 6, borderRadius: 10 }}
                >
                  <Text className="font-yekan text-blue-500">
                    مایل به وارد کردن تعداد تاب لنگی هستید ؟
                  </Text>
                </Button>
              ) : (
                <Button
                  size="sm"
                  onPress={() => setLameOptional(false)}
                  type="outline"
                  buttonStyle={{ margin: 6, borderRadius: 10 }}
                >
                  <Text className="font-yekan text-blue-500">
                    پنهان کردن تاب لنگی
                  </Text>
                </Button>
              )}

              {lampOptional ? (
                <>
                  <Text className="text-xs font-yekan text-gray-600 mt-2">
                    تعداد تاب لنگی :
                  </Text>
                  <TextInput
                    style={style.inputs}
                    keyboardType="numeric"
                    placeholder="تعداد تاب لنگی (اختیاری)"
                    onChangeText={formik.handleChange("productionLame")}
                    onBlur={formik.handleBlur("productionLame")}
                    value={formik.values.productionLame}
                  />
                  {formik.values.productionLame != ""
                    ? checkPercent(formik.values.productionLame)
                    : null}

                  <Text className="text-xs font-yekan text-gray-600 mt-2">
                    تعداد رپکن OK :
                  </Text>
                  <View className="flex justify-between flex-row-reverse mt-2 h-9 bg-gray-200 p-2 rounded-lg">
                    <View>{calcRepkon()}</View>

                    <View>
                      {formik.values.productionRepkon != ""
                        ? checkPercent(formik.values.productionRepkon)
                        : null}
                    </View>
                  </View>
                </>
              ) : null}

              {!stopOptional ? (
                <Button
                  size="sm"
                  onPress={() => setStopOptional(true)}
                  type="outline"
                  buttonStyle={{ margin: 6, borderRadius: 10 }}
                >
                  <Text className="font-yekan text-blue-500">
                    مایل به وارد کردن تعداد توقفات هستید ؟
                  </Text>
                </Button>
              ) : (
                <Button
                  size="sm"
                  onPress={() => setStopOptional(false)}
                  type="outline"
                  buttonStyle={{ margin: 6, borderRadius: 10 }}
                >
                  <Text className="font-yekan text-blue-500">
                    پنهان کردن توقفات
                  </Text>
                </Button>
              )}

              {stopOptional ? (
                <>
                  <Text className="text-xs font-yekan text-gray-600 mt-2">
                    توقف برقی :
                  </Text>
                  <TextInput
                    style={style.inputs}
                    keyboardType="numeric"
                    placeholder="برقی"
                    onChangeText={formik.handleChange("StopElectricity")}
                    onBlur={formik.handleBlur("StopElectricity")}
                    value={formik.values.StopElectricity}
                  />
                  {formik.errors.StopElectricity && (
                    <Text
                      style={{ fontSize: 12 }}
                      className="text-red-500 mb-2 font-yekan"
                    >
                      *{formik.errors.StopElectricity}
                    </Text>
                  )}

                  <Text className="text-xs font-yekan text-gray-600 mt-2">
                    توقفات مکانیک :
                  </Text>
                  <TextInput
                    keyboardType="numeric"
                    style={style.inputs}
                    placeholder="مکانیک"
                    onChangeText={formik.handleChange("StopMechanic")}
                    onBlur={formik.handleBlur("StopMechanic")}
                    value={formik.values.StopMechanic}
                  />
                  {formik.errors.StopMechanic && (
                    <Text
                      style={{ fontSize: 12 }}
                      className="text-red-500 mb-2 font-yekan"
                    >
                      *{formik.errors.StopMechanic}
                    </Text>
                  )}

                  <Text className="text-xs font-yekan text-gray-600 mt-2">
                    توقفات کانوایر :
                  </Text>
                  <TextInput
                    keyboardType="numeric"
                    style={style.inputs}
                    placeholder="کانوایر"
                    onChangeText={formik.handleChange("StopConwire")}
                    onBlur={formik.handleBlur("StopConwire")}
                    value={formik.values.StopConwire}
                  />

                  {formik.errors.StopConwire && (
                    <Text
                      style={{ fontSize: 12 }}
                      className="text-red-500 mb-2 font-yekan"
                    >
                      *{formik.errors.StopConwire}
                    </Text>
                  )}

                  <Text className="text-xs font-yekan text-gray-600 mt-2">
                    توقفات جوشکاری :
                  </Text>
                  <TextInput
                    keyboardType="numeric"
                    style={style.inputs}
                    placeholder="جوشکاری"
                    onChangeText={formik.handleChange("StopWelding")}
                    onBlur={formik.handleBlur("StopWelding")}
                    value={formik.values.StopWelding}
                  />
                  {formik.errors.StopWelding && (
                    <Text
                      style={{ fontSize: 12 }}
                      className="text-red-500 mb-2 font-yekan"
                    >
                      *{formik.errors.StopWelding}
                    </Text>
                  )}

                  <Text className="text-xs font-yekan text-gray-600 mt-2">
                    توقفات تراشکاری :
                  </Text>
                  <TextInput
                    keyboardType="numeric"
                    style={style.inputs}
                    placeholder="جوشکاری"
                    onChangeText={formik.handleChange("StopLathing")}
                    onBlur={formik.handleBlur("StopLathing")}
                    value={formik.values.StopLathing}
                  />
                  {formik.errors.StopLathing && (
                    <Text
                      style={{ fontSize: 12 }}
                      className="text-red-500 mb-2 font-yekan"
                    >
                      *{formik.errors.StopLathing}
                    </Text>
                  )}

                  <Text className="text-xs font-yekan text-gray-600 mt-2">
                    توقفات واحد کنترل کیفیت :
                  </Text>
                  <TextInput
                    keyboardType="numeric"
                    style={style.inputs}
                    placeholder="کنترل کیفیت"
                    onChangeText={formik.handleChange("StopQualityControl")}
                    onBlur={formik.handleBlur("StopQualityControl")}
                    value={formik.values.StopQualityControl}
                  />
                  {formik.errors.StopQualityControl && (
                    <Text
                      style={{ fontSize: 12 }}
                      className="text-red-500 mb-2 font-yekan"
                    >
                      *{formik.errors.StopQualityControl}
                    </Text>
                  )}

                  <Text className="text-xs font-yekan text-gray-600 mt-2">
                    توقفات رپکن :
                  </Text>
                  <TextInput
                    keyboardType="numeric"
                    style={style.inputs}
                    placeholder="رپکن"
                    onChangeText={formik.handleChange("StopRepkon")}
                    onBlur={formik.handleBlur("StopRepkon")}
                    value={formik.values.StopRepkon}
                  />
                  {formik.errors.StopRepkon && (
                    <Text
                      style={{ fontSize: 12 }}
                      className="text-red-500 mb-2 font-yekan"
                    >
                      *{formik.errors.StopRepkon}
                    </Text>
                  )}

                  <Text className="text-xs font-yekan text-gray-600 mt-2">
                    توقفات کمبود دیسک :
                  </Text>
                  <TextInput
                    keyboardType="numeric"
                    style={style.inputs}
                    placeholder="دیسک"
                    onChangeText={formik.handleChange("StopShortageDisk")}
                    onBlur={formik.handleBlur("StopShortageDisk")}
                    value={formik.values.StopShortageDisk}
                  />
                  {formik.errors.StopShortageDisk && (
                    <Text
                      style={{ fontSize: 12 }}
                      className="text-red-500 mb-2 font-yekan"
                    >
                      *{formik.errors.StopShortageDisk}
                    </Text>
                  )}

                  <Text className="text-xs font-yekan text-gray-600 mt-2">
                    توقفات طوقه :
                  </Text>
                  <TextInput
                    keyboardType="numeric"
                    style={style.inputs}
                    placeholder="طوقه"
                    onChangeText={formik.handleChange("StopToghe")}
                    onBlur={formik.handleBlur("StopToghe")}
                    value={formik.values.StopToghe}
                  />
                  {formik.errors.StopToghe && (
                    <Text
                      style={{ fontSize: 12 }}
                      className="text-red-500 mb-2 font-yekan"
                    >
                      *{formik.errors.StopToghe}
                    </Text>
                  )}

                  <Text className="p-2 text-red-600 font-yekan text-xs">
                    توقفات را بر حسب دقیقه وارد کنید .
                  </Text>
                </>
              ) : null}

              <Button
                style={{ marginTop: 10 }}
                containerStyle={{ marginTop: 12 }}
                onPress={formik.handleSubmit}
                radius={"sm"}
                type="solid"
                size="sm"
              >
                <Text className="font-yekan text-white"> ثبت آمار </Text>
                {/* <Icon name="save" color="white" /> */}
              </Button>

              <Text className="mt-5 mx-1 text-red-600 font-yekan">
                * دقت داشته باشید که ساعت ثبت ؛ ثبت کننده و شیفت جاری بصورت
                اتوماتیک در سیستم ثبت میشود .
              </Text>
            </View>
          </SafeAreaView>
        </ScrollView>
      </Modal>

        <FAB
          onPress={handleFabClick}
          style={{
            position: "absolute",
            bottom: 15,
            right: 15,
            transition: "0.3s",

          }}
          color="#3085C3"
          icon={{ name: "add", color: "white" }}
        />


      <View className="p-2">
        <ScrollView
        onScroll={handleScroll}
        onScrollEndDrag={handleScroll}
        onMomentumScrollEnd={handleScroll}
        >
          <FilterStatistics />

            
         { items.map((item) => (
            <View className="bg-neutral-200 rounded-lg p-2 mt-2" key={item.id}>
              <View className="flex flex-row items-center justify-between flex-wrap">
                <View className="flex flex-row items-center bg-cyan-400 p-2 rounded-3xl">
                  <Text>
                    {moment(item.created_at).format("jYYYY-jMM-jDD")}
                    {/* {moment(item.created_at, 'jYYY')} */}
                    {/* {item.created_at} */}
                  </Text> 
                  <Icon name="calendar" />
                </View>

                <View className="flex flex-row justify-evenly">
                  <Button
                    color={"warning"}
                    size="lg"
                    radius={100}
                    onPress={() => {
                      edit(item.id);
                    }}
                  >
                    <Icon color={"white"} name="edit" />
                  </Button>

                  <Button
                    color={"success"}
                    size="lg"
                    radius={100}
                    onPress={() => show(item.id)}
                  >
                    <Icon color={"white"} name="eye" />
                  </Button>
                </View>
              </View>

              {/* Statistic Summary */}

              <View className="flex flex-col">
                <View className="mt-1 flex-row justify-between mx-2">
                  <Text className="font-yekan"> دستگاه </Text>
                  <Text className="font-yekan"> {item.device} </Text>
                </View>

                <View className="mt-1 flex-row justify-between mx-2">
                  <Text className="font-yekan"> محصول </Text>
                  <Text className="font-yekan"> {item.product} </Text>
                </View>

                <View className="mt-1 flex-row justify-between mx-2">
                  <Text className="font-yekan"> تولید کل </Text>
                  <Text className="font-yekan"> {item.totalProduct} </Text>
                </View>

                <View className="mt-1 flex-row justify-between mx-2">
                  <Text className="font-yekan"> تعداد اصلاحی </Text>
                  <Text className="font-yekan">
                    {item.productionCorrective}
                  </Text>
                </View>

                <View className="mt-1 flex-row justify-between mx-2">
                  <Text className="font-yekan"> تعداد اسقاط </Text>
                  <Text className="font-yekan">{item.productionAbortion}</Text>
                </View>

                <View className="mt-1 flex-row justify-between mx-2">
                  <Text className="font-yekan"> تعداد OK </Text>
                  <Text className="font-yekan"> {item.productionSuccess} </Text>
                </View>

                <View className="mt-1 flex-row justify-between mx-2">
                  <Text className="font-yekan"> تعداد تاب لنگی </Text>
                  <Text className="font-yekan"> {item.productionLame} </Text>
                </View>

                <View className="mt-1 flex-row justify-between mx-2">
                  <Text className="font-yekan"> رپکن OK </Text>
                  <Text className="font-yekan"> {item.productionRepkon} </Text>
                </View>
              </View>

              <View className="flex flex-row m-1 justify-evenly items-center">
                <Button
                  color={"primary"}
                  size="md"
                  radius={100}
                  onPress={() => {
                    ToastAndroid.showWithGravity(
                      "در ورژن افلاین در دسترس نیست.",
                      ToastAndroid.SHORT,
                      ToastAndroid.BOTTOM
                    );
                  }}
                >
                  <Text className="font-yekan text-xs text-white">
                    دانلود سند PDF
                  </Text>
                  <IconMaterial color={"white"} name="download" />
                </Button>
              </View>
            </View>
          ))}

        </ScrollView>
      </View>
    </>
  );
}
