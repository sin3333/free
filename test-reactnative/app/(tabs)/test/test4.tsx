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
    NativeSyntheticEvent,
    NativeScrollEvent,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { modalStyles } from '../styles';

const screenWidth = Dimensions.get('window').width;
const STORAGE_KEY = 'MONTHLY_DATA_2025';

type MonthData = {
    id: string;
    budget: string;
    balance: number;
    expenses: number[];
};

function BudgetInput({
    monthData,
    onChangeBudget,
    onApplyBudget,
}: {
    monthData: MonthData;
    onChangeBudget: (value: string) => void;
    onApplyBudget: () => void;
}) {
    return (
        <View style={{ justifyContent: 'center', alignItems: 'center', marginVertical: 16 }}>
            <Text style={{ fontSize: 24 }}>予算設定</Text>
            <TextInput
                placeholder="金額を入力"
                keyboardType="numeric"
                value={monthData.budget}
                onChangeText={onChangeBudget}
                style={{
                    borderWidth: 1,
                    borderColor: '#ccc',
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    width: 200,
                    marginVertical: 8,
                }}
            />
            <Button onPress={onApplyBudget} title="OK" color="#841584" />
        </View>
    );
}

function ExpenseInput({ onAddExpense }: { onAddExpense: (amount: number) => void }) {
    const [expense, setExpense] = useState('');

    return (
        <View style={{ justifyContent: 'center', alignItems: 'center', marginVertical: 16 }}>
            <Text style={{ fontSize: 24 }}>支出記入</Text>
            <TextInput
                placeholder="支出を入力"
                keyboardType="numeric"
                value={expense}
                onChangeText={setExpense}
                style={{
                    borderWidth: 1,
                    borderColor: '#ccc',
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    width: 200,
                    marginVertical: 8,
                }}
            />
            <Button
                onPress={() => {
                    const amount = Number(expense || 0);
                    if (!isNaN(amount) && amount !== 0) {
                        onAddExpense(amount);
                    }
                    setExpense('');
                }}
                title="OK"
                color="#841584"
            />
        </View>
    );
}

function AlertDetector({
    alert,
    setAlert,
}: {
    alert: boolean;
    setAlert: (v: boolean) => void;
}) {
    return (
        <Modal transparent visible={alert}>
            <View style={modalStyles.backdrop}>
                <View style={modalStyles.popup}>
                    <Text>残金が1000円を切っています</Text>
                    <Pressable onPress={() => setAlert(false)} style={{ marginTop: 16 }}>
                        <Text>閉じる</Text>
                    </Pressable>
                </View>
            </View>
        </Modal>
    );
}

function ResetButton({ onReset }: { onReset: () => void }) {
    return (
        <View style={{ justifyContent: 'flex-end', alignItems: 'flex-start', margin: 16 }}>
            <Button title="リセット" onPress={onReset} />
        </View>
    );
}

const createMonthlyData = (year: number): MonthData[] => {
    return Array.from({ length: 12 }, (_, i) => {
        const monthNumber = String(i + 1).padStart(2, '0');
        return {
            id: `${year}-${monthNumber}`,
            budget: '',
            balance: 0,
            expenses: [],
        };
    });
};

export default function Test4Screen() {
    const [monthlyDataList, setMonthlyDataList] = useState<MonthData[]>(() =>
        createMonthlyData(2025)
    );
    const [currentMonthIndex, setCurrentMonthIndex] = useState<number>(new Date().getMonth());
    const [alert, setAlert] = useState(false);
    const [loaded, setLoaded] = useState(false);

    const handleScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const offsetX = event.nativeEvent.contentOffset.x;
        const pageIndex = Math.round(offsetX / screenWidth);
        setCurrentMonthIndex(pageIndex);
    };

    // -----------------------------
    // ① 保存データ読み込み
    // -----------------------------
    useEffect(() => {
        const loadData = async () => {
            try {
                const stored = await AsyncStorage.getItem(STORAGE_KEY);
                if (stored) {
                    const parsed: MonthData[] = JSON.parse(stored);
                    if (Array.isArray(parsed) && parsed.length === 12) {
                        setMonthlyDataList(parsed);
                    }
                }
            } catch (e) {
                console.log('読み込みエラー:', e);
            } finally {
                setLoaded(true);
            }
        };

        loadData();
    }, []);

    // -----------------------------
    // ② state変更時に保存
    // -----------------------------
    useEffect(() => {
        if (!loaded) return;

        const saveData = async () => {
            try {
                await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(monthlyDataList));
            } catch (e) {
                console.log('保存エラー:', e);
            }
        };

        saveData();
    }, [monthlyDataList, loaded]);

    // ★ useEffectでのアラート自動発火は削除！
    // 入力のたびに出てしまうため

    // -----------------------------
    // ③ 予算 OK ボタン
    // -----------------------------
    const handleApplyBudget = (index: number) => {
        setMonthlyDataList((prev) => {
            const updated = [...prev];
            const target = updated[index];
            const amount = Number(target.budget || 0);
            if (isNaN(amount) || amount === 0) return prev;

            const newBalance = target.balance + amount;

            updated[index] = {
                ...target,
                balance: newBalance,
                budget: '',
            };

            // ★ ボタンを押した時だけアラート
            if (newBalance < 1000) {
                setAlert(true);
            }

            return updated;
        });
    };

    // -----------------------------
    // ④ 支出 OK ボタン
    // -----------------------------
    const handleAddExpense = (index: number, amount: number) => {
        setMonthlyDataList((prev) => {
            const updated = [...prev];
            const target = updated[index];
            const newBalance = target.balance - amount;

            updated[index] = {
                ...target,
                balance: newBalance,
                expenses: [...target.expenses, amount],
            };

            // ★ ボタンを押した時のみアラート
            if (newBalance < 1000) {
                setAlert(true);
            }

            return updated;
        });
    };

    // -----------------------------
    // ⑤ リセット
    // -----------------------------
    const handleReset = async () => {
        try {
            await AsyncStorage.removeItem(STORAGE_KEY);
        } catch (e) {
            console.log('リセットエラー', e);
        }
        setMonthlyDataList(createMonthlyData(2025));
        setCurrentMonthIndex(new Date().getMonth());
        setAlert(false);
    };

    // -----------------------------
    // UI
    // -----------------------------
    return (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
            <AlertDetector alert={alert} setAlert={setAlert} />

            <Text style={{ fontSize: 20, textAlign: 'center', marginTop: 16 }}>
                {currentMonthIndex + 1}月
            </Text>

            <ScrollView
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator
                onMomentumScrollEnd={handleScrollEnd}
            >
                {monthlyDataList.map((monthData, index) => (
                    <View
                        key={monthData.id}
                        style={{
                            width: screenWidth,
                            padding: 16,
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                        }}
                    >
                        <Text style={{ fontSize: 18, marginBottom: 8 }}>
                            {index + 1}月のページ
                        </Text>

                        <Text style={{ marginBottom: 16 }}>
                            現在の残高は {monthData.balance} 円です
                        </Text>

                        <BudgetInput
                            monthData={monthData}
                            onChangeBudget={(value) => {
                                setMonthlyDataList((prev) => {
                                    const updated = [...prev];
                                    updated[index] = { ...updated[index], budget: value };
                                    return updated;
                                });
                            }}
                            onApplyBudget={() => handleApplyBudget(index)}
                        />

                        <ExpenseInput onAddExpense={(amount) => handleAddExpense(index, amount)} />
                    </View>
                ))}
            </ScrollView>

            <ResetButton onReset={handleReset} />
        </View>
    );
}
