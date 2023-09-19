import React, { useState, useEffect } from 'react';
import Question from '../components/test/Question';
import QuestionBar from '../components/test/QuestionBar';
import { BiLeftArrowAlt } from 'react-icons/bi';
import { MdOutlineTimer } from 'react-icons/md';
import { Container } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import { toast, Toaster } from 'react-hot-toast';
import { useParams } from "react-router-dom";
import { useNavigate } from 'react-router-dom';

import { shuffle }  from '../utils/functions.js';
import modules from '../backend/json/modules.json';
import questions from '../backend/json/questions.json';

export default function Test() {
    const navigate = useNavigate();

    const [module, setModule] = useState(null);
    const [chapter, setChapter] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [questionsList, setQuestionList] = useState([]);

    const { moduleCode, chapterCode } = useParams();
    const isExam = false;

    useEffect(() => {
        // Set the initial state once the data is loaded
        if(modules && moduleCode) {
            setModule(modules.data[0]);
        }

        if(questions && moduleCode && chapterCode) {
            setChapter(questions.module[moduleCode].chapters[chapterCode]);
            if(chapter?.questions) {
                var question = shuffle(chapter?.questions, 6);
                var list = [];

                question.forEach(element => {
                    var questionInstance = new QuestionInstance(element);
                    list.push(questionInstance);
                });

                list[0].active = true;
                setQuestionList(list);
            }
        }

    }, [moduleCode, chapterCode, chapter]);

    const MoveToNext = () => {
        if(currentQuestion < questionsList.length - 1) {
            questionsList[currentQuestion].active = false;
            setCurrentQuestion(currentQuestion + 1);
            questionsList[currentQuestion + 1].active = true;
            setQuestionList(questionsList);
        }
    }

    const MoveToPrev = () => {
        if(currentQuestion > 0) {
            questionsList[currentQuestion].active = false;
            setCurrentQuestion(currentQuestion - 1);
            questionsList[currentQuestion - 1].active = true;
            setQuestionList(questionsList);
        }
    }

    const MoveToIndex = (index) => {
        if(index >= 0 && index < questionsList.length) {
            questionsList[currentQuestion].active = false;
            questionsList[index].active = true;
            setCurrentQuestion(index);
            setQuestionList(questionsList);
        }
    }

    const SetCompleted = (index) => {
        if(index >= 0 && index < questionsList.length) {
            questionsList[index].completed = true;
            setQuestionList(questionsList);
        }
    }

    const FinishQuiz = () => {
        //check that all questions are completed
        var completed = true;
        questionsList.forEach(element => {
            if(!element.completed) {
                completed = false;
            }
        });

        if(completed) {
        }
        else{
            toast.error('Please complete all questions before submitting.', {
                style: {
                  padding: '16px',
                  color: '#4e5662',
                },
                iconTheme: {
                  primary: '#e07b7b',
                },
                duration: 3000,
            });
        }
    }

    class QuestionInstance{
        question;
        selectedAnswer;
        completed;
        active;

        constructor(question) {
            this.question = question;
            this.selectedAnswer = null;
            this.completed = false;
            this.active =false;
        }
    }

    return (
        <div className="bg-light vh-100">
            <div><Toaster/></div>
            <div className="p-5">
                {/* <div>{deadline}</div> */}
                {/* Test header */}
                <div className='d-flex justify-content-between'>
                    <div>
                        <h4 className='text-secondary'>{isExam ? "Exam" : "Practice Test"}</h4>
                        <h1 className='text-primary fw-bold display-4'>{module?.name}</h1>
                    </div>
                </div>

                {/*  Leave test */}
                <div className="d-flex align-items-center mt-4">
                    <BiLeftArrowAlt className="text-dark me-3" size={30} />
                    <h4 className='text-dark m-0 p-0 fw-bold pointer' onClick={() => navigate(-1)}>Leave Test</h4>
                </div>

                <Container className='d-flex justify-content-center'>
                    <div style={{ width: '43.0625rem' }}>
                        {/* Test heading with time bar */}
                        <div className="d-flex justify-content-center flex-column text-center">
                            <h2 className="text-primary">{chapter?.name}</h2>

                            <div className='d-flex align-items-center justify-content-center'>
                                <MdOutlineTimer className="text-primary me-2" size={30} />

                                {/* MAKE THIS TIME DYNAMIC */}
                                <p className='text-dark m-0 p-0 '>6 minutes 24 seconds left</p>
                            </div>

                            {/*  Progress bar */}
                            <div className="progress mt-3" style={{ height: '5px' }}>
                                <div className="progress-bar bg-primary" role="progressbar" style={{ width: '25%' }} aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
                            </div>
                        </div>

                        {/* Question */}
                        {chapter
                            ? <Question question={chapter?.questions[currentQuestion]} questionIndex={currentQuestion} SetCompleteCallback={SetCompleted}/>
                            : <p>No Questions found for chapter</p>
                        }
                        
                        {/* Next question button */}
                        <div className="d-flex justify-content-between align-items-center mt-4">
                            <p className='text-primary m-0 p-0 fs-5 pointer' onClick={() => MoveToPrev()}>previous</p>
                            {/* current question out of total */}
                            <p className="text-secondary fw-bold m-0 p-0">{currentQuestion+1} / 6</p>
                            {
                                (currentQuestion !== questionsList.length - 1) ? 
                                <Button size="lg" className="text-white fw-bold" onClick={() => MoveToNext()}>Next</Button>
                                :
                                <Button size="lg" className="text-white fw-bold" onClick={() => FinishQuiz()}>Submit</Button>
                            }
                        </div>

                        {/* Question bar */}
                        <QuestionBar questionData={questionsList} SelectEvent={MoveToIndex} />

                        {/* Logo */}
                        <div className="d-flex justify-content-center mt-5">
                            <img src="/images/logo.svg" alt="logo" style={{ width: '4rem' }} />
                        </div>
                    </div>
                </Container>
            </div>
        </div>
    )
}