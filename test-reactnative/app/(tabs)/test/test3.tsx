import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    Button,
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Dimensions,
} from "react-native";

import AsyncStorage from '@react-native-async-storage/async-storage';
/* ローカルストレージにデータを保存するライブラリ。ドキュメント→https://react-native-async-storage.github.io/2.0/ */
/*'async-storage 'が使えない場合、"git pull" の後に　"expo install" を実行 */

import { modalStyles } from "../styles";

const screenWidth = Dimensions.get("window").width; //画面横のサイズを取得　https://reactnative.dev/docs/dimensions

const debug = { //<view>の階層を可視化するための線 style={{ ...debug, borderColor: 'blue' }で可視化
    borderWidth: 1,
    borderColor: 'red',
};

type MonthData = {
    id: string;
    budget: number;
    balance: number;
    expenses: [];
}




function BudgetInput({
    MonthData,
    onBudgetInput,
    onChangeBudget,

}) {


    return (
        <View style={{ justifyContent: "center", alignItems: "center" }}>
            <Text style={{ fontSize: 24 }}>予算設定</Text>
            <TextInput
                placeholder="金額を入力"
                keyboardType="numeric"
                value={MonthData.budget}
                onChangeText={onChangeBudget}
            //TODO
            />
            <Button
                onPress={onBudgetInput}
                title="OK"
                color="#841584"
            />
        </View>
    );

}

function ExpenseInput({ }) {

    return (
        <View style={{ justifyContent: "center", alignItems: "center" }}>
            <Text style={{ fontSize: 24 }}>支出記入</Text>
            <TextInput
                placeholder="支出を入力"
                keyboardType="numeric"
                value={expense}
                onChangeText={newValue => setExpense(newValue)}
            />
            <Button
                onPress={() => {
                    //TODO

                }}
                title="OK"
                color="#841584"
            />
        </View>
    );

}

function AlertDetector({ alert, setAlert }) {

    /*modalstyles is imported from app/styles.tsx*/

    return (
        <Modal
            transparent={true}
            visible={alert}
        >
            <View style={modalStyles.backdrop}>
                <View style={modalStyles.popup}>
                    <Text>残金が1000円を切っています</Text>
                    <Pressable
                        onPress={() => setAlert(false)}
                    >
                        <Text>閉じる</Text>
                    </Pressable>
                </View>
            </View>
        </Modal>
    )
}

function ResetButton({ onReset }) {
    return (
        <View style={{ flex: 1, justifyContent: "flex-end", alignItems: "flex-start" }}>

            <Button
                title='リセット'
                onPress={onReset}
            >

            </Button>
        </View>
    )

}

//export default function Test3Screen() {
function Test3Screen() {


    //const [budget, setBudget] = useState('');
    //const [balance, setBalance] = useState(0);
    //const [expense, setExpense] = useState('');
    const [alert, setAlert] = useState(false);
    const [loaded, setLoaded] = useState(false);

    const createMonthlyData = (year): MonthData[] => { //MonthData[]が返されるとtypescriptに期待させている
        return Array.from({ length: 12 }, (_, i) => { //,(_, i)連番の生成
            const monthNumber = String(i + 1).padStart(2, "0");
            return {
                id: `${year}-${monthNumber}`, //注意：`` と　''　は別物
                budget: 0,
                balance: 0,
                expenses: [],
            };
        });
    };

    const [monthlyDataList, setMonthlyDataList] = useState(createMonthlyData(2025));
    const [currentMonthIndex, setCurrentMonthIndex] = useState(new Date().getMonth());

    const handleScrollEnd = (event) => {
        const offsetX = event.nativeEvent.contentOFFset.x;
        const pageIndex = Math.round(offsetX / screenWidth);
        setCurrentMonthIndex(pageIndex);
        //TODO
    }


    useEffect(() => {
        const loadData = async () => {
            try {
                const stored = await AsyncStorage.getItem('STORAGE_KEY');
                if (stored !== null) {
                    const parsed = JSON.parse(stored);
                    setMonthlyDataList(parsed);
                }

            } catch (e) {
                console.log("読み込みエラー:", e);
            } finally {
                setLoaded(true);
            }
        };

        loadData();
    }, []);

    useEffect(() => {
        const SaveData = async () => {
            try {
                await AsyncStorage.setItem(STORAGE_KEY, Stringify(monthlyDataList));
            } catch (e) {
                console.log("保存エラー:", e);
            }
        };

        SaveData();
    }, [monthlyDataList, loaded]);


    const handleAddBudget = (index) => {
        setMonthlyDataList((prev) => {
            const updatedList = [...prev];
            const current = updatedList[index];
            const amount = Number(current.balance ?? 0) + Number(current.budget ?? 0);
            updatedList[currentMonthIndex] = {
                ...current,
                balance: amount,
            }
            return updated;
        })
    }

    const handleAddExpense = (index, amount) => {
        setMonthlyDataList((prev) => {
            const updated = [...prev];
            const target = updated[index];
            const newBalance = target.balance - amount;

            updated[index] = {
                ...target,
                balance: newBalance,
                expenses: [...target.expenses, amount],
            }

            return updated;

        });
    }

    const handleReset = async () => {
        //
    }


    return (




        <View style={{ flex: 1, }}>
            <Text>☆{currentMonthIndex + 1}月☆</Text>
            <ScrollView
                style={{ ...debug, borderColor: 'green', flex: 1 }}//外側のスタイル
                contentContainerStyle={{ borderWidth: 2, borderColor: 'red', alignItems: 'center', justifyContent: "flex-end" }} //内側のスタイル
                horizontal //軸を反転
                pagingEnabled
                showsHorizontalScrollIndicator={true}
                onMomentumScrollEnd={handleScrollEnd}
                //disableIntervalMomentum={true} //スライド時に区切りで停止
                contentOffset={{ x: 0, y: screenWidth * (currentMonthIndex + 1) }}//TODO 初期の位置


            >
                {monthlyDataList.map((monthData, index) => (
                    <View
                        key={monthData.id}
                        style={{
                            width: screenWidth,
                            //padding: 200,
                            justifyContent: 'space-around',
                            alignItems: 'center',
                            flex: 1,
                            ...debug, borderColor: 'blue' //後で消す
                        }}


                    >
                        <Text>{index + 1}月のページ</Text>

                        <Text>現在の残高は{monthData.balance}円です</Text>

                        <AlertDetector alert={alert} setAlert={setAlert} />

                        <BudgetInput
                            monthData={monthData}
                            onChangeBudget={(value) => {
                                setMonthlyDataList((prev) => {
                                    const updated = [...prev];
                                    updated[index] = { ...updated[index], budget: value };
                                    return updated;
                                })
                            }}
                            onBudgetInput={() => handleAddBudget((index))}
                        />
                        <ExpenseInput onExpenseInput={(amount) => { handleAddExpense(amount, index) }} />
                    </View>
                ))}
            </ScrollView>
            <View>
                <ResetButton onReset={handleReset} />
            </View>

        </View >









    )

}

