import React, { useEffect, useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Text, StyleSheet, View, Pressable, ScrollView } from "react-native";
import axios, { AxiosResponse } from "axios";
import { Loading } from "../Components/Loading";
import { Error } from "../Components/Error";
import { Correct } from "../Components/Correct";

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

    const queryClient = useQueryClient()

    const { isLoading, error, data, isFetching } = useQuery({
        queryKey: ["question"],
        queryFn: () =>
            axios.get<Trivia[]>("https://the-trivia-api.com/api/questions?limit=1&difficulty=medium").then((res: AxiosResponse<Trivia[]>) => {
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

    const validateAnswer = (answer: string) : boolean => {
        if (data![0].correctAnswer === answer) {
            queryClient.invalidateQueries();
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


    if (isLoading) return <Loading loadingText={'Loading'} />

    if (error) return <Error />


    return (
        <>
            <ScrollView contentContainerStyle={{ alignItems: 'center', justifyContent: 'space-between' }} style={styles.container}>
                {data?.map((q) => {
                    return (
                        <>
                            <View style={styles.container}>
                                <Text style={styles.text}>
                                    {q.category}
                                </Text>
                            </View>
                            <View style={styles.container}>
                                <Text style={styles.text}>
                                    {q.question}
                                </Text >
                            </View>
                        </>
                    )
                })}
                <View style={styles.container}>
                    { }
                    {shuffleArray(answers) ? answers.map((answer, index) => {
                        return (
                            <View style={styles.answersContainer}>
                                <Pressable key={index} onPress={() => validateAnswer(answer)}>
                                    {({ pressed }) => (
                                        <Text style={[{backgroundColor: pressed && validateAnswer(answer) ? 'green' : 'white'}, styles.answerText]}>{answer}</Text>
                                    )}
                                </Pressable>
                            </View>
                        );
                    }) : (
                        <Loading loadingText={'Loading'} />
                    )}

                </View>
            </ScrollView>
        </>

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 35,
        backgroundColor: '#fff',
    },
    separator: {

    },
    text: {
        color: 'red',
        fontWeight: 'bold',
        fontSize: 20
    },
    answersContainer: {
        maxWidth: '50%',
        borderColor: 'red',
        borderWidth: 1,
        fontSize: 30,
        flexDirection: "row"
    },
    answerText: {
        fontSize: 30,
    }

});


