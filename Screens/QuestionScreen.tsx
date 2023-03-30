import React from "react";
import axios from "axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";

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

    const queryClient = useQueryClient()

    const { isLoading, error, data, isFetching } = useQuery({
        queryKey: ["repoData"],
        queryFn: () => 
          axios.get("https://api.github.com/repos/tannerlinsley/react-query").then((res) => res.data),
      });

    // if (isLoading) return "Loading...";

    // if (error) return "An error has occurred: " + error;
    
    return (
        <>
        </>
    )
}