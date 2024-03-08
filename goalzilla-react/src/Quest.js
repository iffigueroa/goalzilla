import React, {useState, useEffect} from 'react'
import { Row, Col, ListGroup, Container, Card, Button, Dropdown, ProgressBar, Navbar} from 'react-bootstrap';

import { useParams, useLocation} from 'react-router-dom'



function QuestDisplay(){
    const params = useLocation()    
    const {journeyIdx, questIdx} =  params.state

    const [currentQuestIdx, setCurrentQuestIdx] = useState(questIdx)
    const [journeyData, setJourneyData] = useState([{}])
    const [questData, setQuestData] = useState([{}])


    useEffect(() => {
        fetch('/journeyDetails?index='+journeyIdx).then(
            res => res.json()
        ).then(
            data => {
            setJourneyData(data)
            }
        )
    }, [])

    useEffect(() => {
        fetch('/questDetails?journeyIdx='+journeyIdx+'&questIdx='+currentQuestIdx).then(
            res => res.json()
        ).then(
            data => {
                setQuestData(data)
                console.log("new quest data")
                console.log(questData)
            }
        )
    }, [currentQuestIdx])

    const updateQuestIdx = (idx) => {
        setCurrentQuestIdx(idx)
    }

    return (   
        <Container>
            <Row>
                <Col sm={3} >
                    <Row className='p-2'>
                        <Card className="w-100">
                            <Card.Body>
                                <Card.Title>{journeyData.journeyName}</Card.Title>
                                {journeyData.journeyDetail}
                                <hr/>
                                <ProgressBar now={journeyData.progress} label={`${journeyData.progress}%`}/>
                            </Card.Body>
                        </Card>
                    </Row>
                    <Row className='p-2'><h3>Quests</h3></Row>
                    <Row className='p-2'>
                        <ListGroup className="w-100">
                            {(typeof journeyData.questList === "undefined") ? (
                                <p>Loading...</p>
                            ) : (
                                journeyData.questList.map((name, i) => (
                                    <ListGroup.Item key={i} onClick={() => updateQuestIdx(i)}>{name}</ListGroup.Item>
                                ))
                            )}
                        </ListGroup>
                    </Row>
                </Col>
                <Col sm={9}>
                    <Row>
                        <Col sm={10}><h1 className='p-2'>{questData.name}</h1></Col>
                        <Col>
                            <Dropdown className="float-right p-2">
                                <Dropdown.Toggle variant="light"></Dropdown.Toggle>
                                <Dropdown.Menu>
                                <Dropdown.Item disabled onClick={() => console.log("Edit Details")}>Edit Details</Dropdown.Item>
                                <Dropdown.Item disabled onClick={() => console.log("Remove")}>Remove</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </Col>
                    </Row>
                        <Card>
                            <Card.Body>
                                {questData.description}
                            </Card.Body>
                        </Card>
                    <hr/>
                    <Row>
                        <Col sm={11}><h3 className='p-2'>Task List</h3></Col>
                        <Col><Button variant="light" className="float-right" onClick={()=>console.log("Adding New Task")}>+</Button></Col>
                    </Row>
                    <ListGroup>
                        {(typeof questData.tasks === "undefined") ? (
                            <p>Loading...</p>
                            ) : (
                                questData.tasks.map((name, i) => (
                                <ListGroup.Item key={i} onClick={()=>console.log(i)}>{name}</ListGroup.Item>
                            ))
                        )}
                    </ListGroup>
                    
                </Col>
            </Row>

        </Container>    
      )
  }
  
  export default QuestDisplay