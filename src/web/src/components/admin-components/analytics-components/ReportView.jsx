import React from 'react'
import styled from 'styled-components'

export default function ReportView(props) {
    return (

        <Container>
            {
                props
            }
        </Container>
    )
}

const Container = styled.div`
    width: 100%;
    height: 100%;
    background-color: aliceblue;
    position: absolute;
`;
