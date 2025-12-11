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
} from "react-native";

import AsyncStorage from '@react-native-async-storage/async-storage';
/* ローカルストレージにデータを保存するライブラリ。ドキュメント→https://react-native-async-storage.github.io/2.0/ */
/*'async-storage 'が使えない場合、"git pull" の後に　"expo install" を実行 */

import { modalStyles } from "../styles";


function BudgetInput({ balance, budget, setBudget, setBalance, monthlyDataList, setMonthlyDataList, currentMonthIndex, setCurrentMonthIndex }) {


    return (
        <View style={{ justifyContent: "center", alignItems: "center" }}>
            <Text style={{ fontSize: 24 }}>予算設定</Text>
            <TextInput
                placeholder="金額を入力"
                keyboardType="numeric"
                value={budget}
                onChangeText={(newValue) => {
                    setBudget(newValue);

                    const updatedList = [...monthlyDataList];
                    updatedList[currentMonthIndex].budget = newValue;
                    setMonthlyDataList(updatedList);
                }}
            //TODO
            />
            <Button
                onPress={() => {
                    const updatedList = [...monthlyDataList];
                    const current = updatedList[currentMonthIndex];
                    const newBalance = Number(current.balance ?? 0) + Number(current.budget ?? 0);
                    updatedList[currentMonthIndex] = {
                        ...current,
                        balance: newBalance,

                    }
                    setMonthlyDataList(updatedList);
                    setBalance(newBalance);
                    setBudget("");
                }}
                title="OK"
                color="#841584"
            />
        </View>
    );

}

function ExpenseInput({ balance, expense, setExpense, setBalance }) {

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
                    setBalance(Number(balance) - Number(expense));
                    setExpense("");
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

function ResetButton({ setBalance }) {
    return (
        <View style={{ flex: 1, justifyContent: "flex-end", alignItems: "flex-start" }}>

            <Button
                title='リセット'
                onPress={async () => {
                    try {
                        await AsyncStorage.clear()
                        setBalance(0);
                    } catch (e) {
                        console.log("リセットエラー", e);
                    }
                    console.log('Done.')
                }
                }
            >

            </Button>
        </View>
    )

}

export default function Test3Screen() {
    const [budget, setBudget] = useState('');
    const [balance, setBalance] = useState(0);
    const [expense, setExpense] = useState('');
    const [alert, setAlert] = useState(false);
    const [loaded, setLoaded] = useState(false);

    const createMonthlyData = (year) => {
        return Array.from({ length: 12 }, (_, i) => {
            const monthNumber = String(i + 1).padStart(2, "0");
            return {
                id: "${year}-${monthNumber}",
                budget: 0,
                balance: 0,
                expenses: []
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
        const loadBalance = async () => {
            try {
                const stored = await AsyncStorage.getItem('BALANCE');
                if (stored !== null) {
                    setBalance(Number(stored));
                }
                setLoaded(true);
            } catch (e) {
                console.log("読み込みエラー:", e);
            }
        };

        loadBalance();
    }, []);

    useEffect(() => {
        const SaveBalance = async () => {
            try {
                await AsyncStorage.setItem('BALANCE', String(balance));
            } catch (e) {
                console.log("保存エラー:", e);
            }
        };

        SaveBalance();
    }, [balance]);

    useEffect(() => {
        if (!loaded) return;
        if (balance < 1000) {
            setAlert(true);
        }
    }, [balance]);


    return (


        <View>

            <View style={{ flex: 1 }}>
                <Text>{currentMonthIndex + 1}月</Text>
                <ScrollView //TODO
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={true}
                    onMomentumScrollEnd={handleScrollEnd}

                >
                    {monthlyDataList.map((monthData, index) => (
                        <View key={monthData.id}>
                            <Text>{index + 1}月のページ</Text>

                            <Text>現在の残高は{monthData.balance}円です</Text>

                            <AlertDetector alert={alert} setAlert={setAlert} />

                            <BudgetInput
                                balance={balance}
                                budget={budget}
                                setBudget={setBudget}
                                setBalance={setBalance}

                                monthlyDataList={monthlyDataList}
                                setMonthlyDataList={setMonthlyDataList}
                                currentMonthIndex={currentMonthIndex}
                                setCurrentMonthIndex={setCurrentMonthIndex}
                            />
                            <ExpenseInput balance={balance} expense={expense} setExpense={setExpense} setBalance={setBalance} />
                        </View>
                    ))}
                </ScrollView>
            </View>



            <View>
                <ResetButton setBalance={setBalance} />
            </View>


        </View>
    )

}

