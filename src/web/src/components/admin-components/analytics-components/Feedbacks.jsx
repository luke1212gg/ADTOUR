import React from 'react'
import { useState } from 'react';
import styled from 'styled-components'
import { firestore } from '../../../firebase';
import { doc, collection, getDocs, getDoc } from 'firebase/firestore';
import { useEffect } from 'react';
import { async } from '@firebase/util';

export default function Feedbacks() {
    const [destinations, setDestinations] = useState([]);
    const [comments, setComments] = useState([]);

    async function loadComments(path, name) {
        console.log(path)
        const commentsRef = collection(doc(firestore, path), 'comments');
        const newComments = []
        await getDocs(commentsRef).then(async (comments) => {
            if (comments.empty) {
                return;
            }
            const commentDocs = comments.docs
            for (const comment in commentDocs) {
                const data = commentDocs[comment].data();
                if (data.sentiment != undefined) {
                    const userRef = doc(collection(firestore, 'users'), data.user_id)
                    await getDoc(userRef).then((user) => {
                        data.name = user.data().first_name + " " + user.data().last_name
                        console.log(data)
                    })
                    newComments.push(data);
                }
            }
        });
        return { name: name, comments: newComments }
    }


    async function loadDestinations(type) {
        const destinationsReference = collection(doc(collection(firestore, 'LocationsData'), type), 'destinations');
        const additionalDestinations = [...destinations];
        await getDocs(destinationsReference).then((destinations) => {
            destinations.forEach((destination) => {
                const data = destination.data();
                const newDestination = {
                    name: data.name,
                    latestFeedback: data['latest_feedback'],
                    positive: data.positive,
                    negative: data.negative,
                    path: destination.ref.path,
                }
                additionalDestinations.push(newDestination)
            })
        });
        return additionalDestinations
    }

    useEffect(() => {
        async function fetchData() {
            const newDestinations = [...(await loadDestinations('cultural')), ...(await loadDestinations('manmade')), ...(await loadDestinations('specialinterest'))]
            setDestinations(newDestinations)
        }
        fetchData()
    }, [])

    useEffect(() => {
        async function fetchComments() {
            const newComments = []
            for (let i = 0; i < destinations.length; i++) {
                const destination = destinations[i]
                const destinationComments = await loadComments(destination.path, destination.name);
                console.log(destinationComments)
                newComments.push(destinationComments)
            }
            setComments(newComments)
        }
        fetchComments();
    }, [destinations])

    return (
        <Container>
            {
                comments.map((destination, index) => {
                    return (
                        <Destination>
                            <div key={index}>
                                {destination.name}
                            </div>
                            <Comments>
                                {
                                    destination.comments.map((comment, index) => {
                                        console.log(comment.uploaded.toDate())
                                        const str = comment.comment
                                        return (
                                            <CommentContainer key={index}>
                                                <Top>
                                                    <Commenter>{comment.name}</Commenter>
                                                    <CommentTimeStamp>{comment.uploaded.toDate().toString().split("GMT")[0]}</CommentTimeStamp>
                                                </Top>
                                                <Bottom>
                                                    <Comment>{'"' + str.charAt(0).toUpperCase() + str.slice(1) + '"'}</Comment>
                                                    {
                                                        comment.sentiment == "positive" ?
                                                            <SentimentPositive>{comment.sentiment}</SentimentPositive> : <SentimentNegative>{comment.sentiment}</SentimentNegative>
                                                    }
                                                </Bottom>
                                            </CommentContainer>
                                        )
                                    })
                                }
                            </Comments>
                        </Destination>
                    )
                })
            }

        </Container>
    )
}

const NegativeTop = styled.p`
    color: #CD0E0E;
`;

const PositiveTop = styled.p`
    color: #12CD0E;
`;

const LatestFeedbackTop = styled.p`
    width: 100px;
    color: #1B71C1;
`;

const FeedbackTop = styled.button`
    margin-right: 1em;
    border: none;
    border-radius: 10em;
    padding: 1em 2em;
    color: white;
    height: fit-content;
    background-color: white;
`;


const Title = styled.h3`
    align-self: flex-start;
`;

const SentimentNegative = styled.p`
    color: rgba(255, 0, 0, 0.63);
`;

const SentimentPositive = styled.p`
    color: #4C9EEB;
`;

const Comment = styled.p``;

const Bottom = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 0em 2em;
`;

const CommentTimeStamp = styled.p`
    opacity: 0.34;
`;

const Commenter = styled.p`
    color: #4C9EEB
`;

const Top = styled.div`
    display: flex;
    padding: 0em 2em;
    gap: 1em;
`;

const CommentContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background-color: #f3f3f3;
    margin: 1em;
    border-radius: 1em;
    border: 2px solid #d1d1d1;
`;

const Close = styled.button`
    float: right;
    width: 30px;
    height: 30px;
    border: none;
    border-radius: 50%;
`;

const Comments = styled.div`
    width: 70%;
    background-color: #dcdcdc;
    border-radius: 1em;
    padding: 2em;
`;

const Name = styled.h3`
    font-weight: normal;
    width: 300px;
    white-space: nowrap;
    overflow: hidden;

    &:hover{
        overflow: visible;
        white-space: normal;
    }
`;

const Destination = styled.div`
    display: flex;
    width: 100%;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #bababa;
    padding-bottom: 5px;
`;

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    background-color: white;
    border-radius: 10px;
    margin: 5em;
    margin-top: 0em;
    padding: 1em;
    gap: 1em;
`;