import Lottie from 'lottie-react-native';
import React from "react";
import { Text } from 'react-native';


export const Loading = () => {
    return (
        <Lottie source={require('../lottie/loading.json')}/>
    )
}