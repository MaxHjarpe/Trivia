import Lottie from 'lottie-react-native';
import React from "react";


export const Loading = () => {
    return (
        <Lottie source={require('../lottie/loading.json')} autoPlay loop/>
    )
}