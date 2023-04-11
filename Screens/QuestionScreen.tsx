import React, { useEffect, useLayoutEffect, useRef, useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Text, StyleSheet, View, Pressable, ScrollView, Animated, Dimensions } from "react-native";
import axios, { AxiosResponse } from "axios";
import { Loading } from "../Components/Loading";
import { Error } from "../Components/Error";
import { CountDown } from "../Components/CountDown";
import Lottie from 'lottie-react-native';


interface Trivia {
    category: string;
    id: string;
    correctAnswer: string;
    incorrectAnswers: string[];
    question: string;
    tags: string[];
    type: string;
    difficulty: string;
    regions: string[];
    isNiche: boolean;
}

export const QuestionScreen = () => {
    const [answers, setAnswers] = useState<string[]>([]);
    const [counter, setScore] = useState(0);
    const [trigger, setTrigger] = useState(0);
    const translateY = useRef(new Animated.Value(-1000)).current;
    const translateX = useRef(new Animated.Value(1000)).current;
    const questionTimer = 10;
    const { width } = Dimensions.get('screen');


    const queryClient = useQueryClient()

    const { isLoading, error, data } = useQuery({
        queryKey: ["question"],
        refetchInterval: questionTimer * 1000,
        queryFn: () =>
            axios.get<Trivia[]>("https://the-trivia-api.com/api/questions?limit=1&difficulty=medium")
                .then((res: AxiosResponse<Trivia[]>) => {
                    if (res.data[0].question.length > 100 || res.data[0].incorrectAnswers.find(x => x.length > 50) || res.data[0].correctAnswer.length > 50)
                        refetchQuestion();

                    slideQuestionIn();
                    return res.data;
                }),
        onSuccess: () => {
            setTrigger((trigger) => trigger + 1);
        },

    });


    useEffect(() => {
        if (!isLoading) {
            data?.forEach((item) => {
                item.incorrectAnswers.push(item.correctAnswer);
            })
            setAnswers(shuffleArray(data![0].incorrectAnswers));
            fadeIn();
        }
    }, [data])

    const updateScore = (correctAnswer: boolean) => {
        correctAnswer ? setScore(counter => counter + 1) : setScore(0);
    }

    const refetchQuestion = () => {
        slideQuestionOut();
        fadeOut();
        queryClient.invalidateQueries();
        setTrigger((trigger) => trigger + 1);
    }

    const fadeIn = () => {
        Animated.spring(translateY, {
            toValue: 0,
            bounciness: 3,
            useNativeDriver: true,
        }).start();
    }

    const fadeOut = () => {
        Animated.spring(translateY, {
            toValue: 1000,
            bounciness: 3,
            useNativeDriver: true,
        }).start();
    }

    const slideQuestionIn = () => {
        Animated.spring(translateX, {
            toValue: 0,
            bounciness: 3,
            useNativeDriver: true,
        }).start();
    }

    const slideQuestionOut = () => {
        Animated.spring(translateX, {
            toValue: -500,
            bounciness: 3,
            useNativeDriver: true,
        }).start();
    }

    const validateAnswer = (index: number) => {
        if (answers.indexOf(data![0].correctAnswer) === index) updateScore(true)
        else updateScore(false)


        refetchQuestion();
    }

    const shuffleArray = (answers: string[]): string[] => {
        for (var i = answers.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = answers[i];
            answers[i] = answers[j];
            answers[j] = temp;
        }
        return answers;
    }

    if (isLoading) return <Loading />

    if (error) return <Error />

    return (
        <>
            <ScrollView contentContainerStyle={{ alignItems: 'center', justifyContent: 'space-evenly', flex: 1 }} style={styles.container}>
                <CountDown trigger={trigger} width={width - 70} durationInSeconds={questionTimer} />
                <View><Text style={styles.score}>{counter}</Text></View>
                {data?.map((q, index) => {
                    return (
                        <Animated.View key={index} style={[styles.container, { transform: [{ translateX }] }]}>
                            <Text style={styles.text}>
                                {q.question}
                            </Text >
                        </Animated.View>
                    )
                })}
                <Animated.View style={[styles.answersContainer, { transform: [{ translateY }] }]}>
                    {answers && answers.map((answer, index) => {
                        return (
                            <View key={index} style={{ width: '100%' }}>
                                <Pressable onPress={() => {
                                    validateAnswer(index)
                                    setTrigger((trigger) => trigger + 1)
                                }}>
                                    {({ pressed }) => (
                                        <Text style={[styles.answerText,
                                        (pressed && index === answers.indexOf(data![0].correctAnswer)) ? { backgroundColor: 'rgba(0,150,0,0.5)' } : { backgroundColor: 'rgba(233,233,233,0.3)' },
                                            // pressed && index !== answers.indexOf(data![0].correctAnswer) ? { backgroundColor: 'red' } : { backgroundColor: '#e9e9e9' },
                                        ]}>{answer}</Text>
                                    )}
                                </Pressable>
                            </View>
                        );
                    })}
                </Animated.View>
            </ScrollView>
        </>

    )
}

const styles = StyleSheet.create({
    container: {
        margin: 20,
        backgroundColor: '#fff',
        flexDirection: 'row'
    },
    separator: {

    },
    text: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: 20
    },
    answersContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 20,
    },
    answerText: {
        fontSize: 16,
        padding: 10,
        margin: 10,
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 5,
        textAlign: 'center',
        color: '#764B8E',
        backgroundColor: 'rgba(0,0,0,1)'
    },
    score: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#764B8E'
    }

});




