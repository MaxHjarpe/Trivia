import React, { useEffect, useLayoutEffect, useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Text, StyleSheet, View, Pressable, ScrollView } from "react-native";
import axios, { AxiosResponse } from "axios";
import { Loading } from "../Components/Loading";
import { Error } from "../Components/Error";
import { Correct } from "../Components/Correct";
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
export const HomeScreen = () => {
    // const [triviaQuestions, setTriviaQuestions] = useState<Trivia>();
    const [answers, setAnswers] = useState<string[]>([]);
    const [maxHeight, setMaxHeight] = useState(0);

    const queryClient = useQueryClient()

    const { isLoading, error, data, isFetching } = useQuery({
        queryKey: ["question"],
        queryFn: () =>
            axios.get<Trivia[]>("https://the-trivia-api.com/api/questions?limit=1&difficulty=medium")
            .then((res: AxiosResponse<Trivia[]>) => 
            {
                if (res.data[0].question.length > 100 || res.data[0].incorrectAnswers.find(x => x.length > 50) || res.data[0].correctAnswer.length > 50) 
                    queryClient.invalidateQueries();
                return res.data;
            }),
    });


    useEffect(() => {
        if (!isLoading) {
            data?.forEach((item) => {
                item.incorrectAnswers.push(item.correctAnswer);
            })
            setAnswers(data![0].incorrectAnswers)
        }
    }, [isLoading, data])

    const validateAnswer = (answer: string): boolean => {
        if (data![0].correctAnswer === answer) {
            
            setTimeout(() => {
                queryClient.invalidateQueries();
            }, 1000)
            return true;
        }
        return false;
    }

    const shuffleArray = (answers: string[]) => {
        for (var i = answers.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = answers[i];
            answers[i] = answers[j];
            answers[j] = temp;
        }
        return answers;
    }


    if (isLoading) return <Loading  />

    if (error) return <Error />


    return (
        <>
            <ScrollView contentContainerStyle={{ alignItems: 'center', justifyContent: 'space-evenly', flex: 1 }} style={styles.container}>
                {data?.map((q) => {
                    return (
                        <>
                            {/* <View style={styles.container}>
                                <Text style={styles.text}>
                                    {q.category}
                                </Text>
                            </View> */}
                            <View style={styles.container}>
                                <Text style={styles.text}>
                                    {q.question}
                                </Text >
                            </View>
                        </>
                    )
                })}
                <View style={[styles.answersContainer]}>
                    {answers && shuffleArray(answers) ? answers.map((answer, index) => {
                        return (
                            <View style={{width: '100%'}}>

                                <Pressable key={index} onPress={() => validateAnswer(answer)}>
                                    {({ pressed }) => (
                                        <Text style={[{ backgroundColor: pressed && validateAnswer(answer) ? '#00FF00' : '#e9e9e9' }, styles.answerText]}>{answer}</Text>
                                    )}
                                </Pressable>
                            </View>
                        );
                    }) : (
                        <Loading />
                    )}
                </View>
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
        marginTop: 20
    },
    answerText: {
        fontSize: 16,
        padding: 10,
        margin: 10,
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 5,
        textAlign: 'center'
    }

});


