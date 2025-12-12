import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Pressable } from "react-native";

function Square({ display, onClick }) {
    return (
        <Pressable
            onPress={onClick}
            style={{ padding: 16, borderWidth: 1, borderColor: "#000" }}
        >
            <Text>{display}</Text>

        </Pressable>
    )
}

export default function Board() {
    const [value, setValue] = useState(false);

    const [squares, setSquares] = useState(Array(9).fill(null));

    const rows = [
        squares.slice(0, 3),
        squares.slice(3, 6),
        squares.slice(6, 9),
    ];

    function handleClick(index) {
        const check = squares.slice();
        check[index] = "✓";
        setSquares(check);
    }





    return (


        <View style={{ flex: 1, justifyContent: "center", backgroundColor: '#fff' }}>

            {rows.map((row, rowIndex) => (
                <View key={rowIndex} style={{ flexDirection: 'row', justifyContent: "center" }}>
                    {row.map((value, colIndex) => {
                        const index = rowIndex * 3 + colIndex;

                        return (
                            <Square key={index} display={squares[index]} onClick={() => handleClick(index)} />
                        )
                    }
                    )}
                </View>
            ))}

        </View >


    )
}