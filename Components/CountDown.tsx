import React, { useEffect, useRef } from 'react';
import Lottie from 'lottie-react-native';
import { StyleSheet, Animated, View } from 'react-native';
import LottieView from 'lottie-react-native';


type Props = {
    durationInSeconds: number,
    width: number,
    trigger: React.SetStateAction<number>
}

export const CountDown = ({ durationInSeconds, width, trigger }: Props) => {
    let milliSeconds = durationInSeconds * 1000;
    const barWidth = useRef(new Animated.Value(width)).current;
    const finalWidth = 0;

    useEffect(() => {
        animateTimeLeftBar();
    }, []);

    useEffect(() => {
        if (trigger)
            resetAnimation();
    }, [trigger])

    const resetAnimation = () => {
        barWidth.resetAnimation();
        animateTimeLeftBar();
    }

    const animateTimeLeftBar = () => {
        Animated.timing(barWidth, {
            toValue: finalWidth,
            duration: milliSeconds,
            useNativeDriver: false,
        }).start();
    }

    return <Animated.View style={[styles.timer, { width: barWidth }]} />
    // return (

    //     <View>
    //         <LottieView  loop style={{width:100, height: 100, backgroundColor: 'pink'.}} source={require('../lottie/countdown.json')} autoPlay />

    //     </View>
    // )
}

const styles = StyleSheet.create({
    timer: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 40,
        borderRadius: 5,
        backgroundColor: '#764B8E'
    },
})


