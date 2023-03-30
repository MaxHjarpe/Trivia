import React from "react";
import { Text } from 'react-native';

type Prop = {
    loadingText : string,
}

export const Loading = ({loadingText}: Prop) => {
    return (
        <Text>{loadingText}...</Text>
    )
}