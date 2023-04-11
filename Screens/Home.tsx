import React, { useEffect, useLayoutEffect, useRef, useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Text, StyleSheet, View, Pressable, ScrollView, Animated, Dimensions } from "react-native";
import axios, { AxiosResponse } from "axios";
import { Loading } from "../Components/Loading";
import { Error } from "../Components/Error";
import { CountDown } from "../Components/CountDown";
import LottieView from "lottie-react-native"



export const HomeScreen = () => {
    const queryClient = useQueryClient()

    return (
        <View>
       <Text>HEJ</Text>

    </View>

    )
}

const styles = StyleSheet.create({
    container: {
        margin: 20,
        backgroundColor: '#fff',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    text: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: 20
    },
});




