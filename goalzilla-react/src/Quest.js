import React, {useState, useEffect} from 'react'
import { Alert, Row, Col, ListGroup, Container, Card, Button, Dropdown, ProgressBar, Form } from 'react-bootstrap';

import { useLocation, useNavigate } from 'react-router-dom'


function QuestForm({addQuest}){
    const [questName, setQuestName] = useState('')
    const [description, setDescription] = useState('')
    const handleSubmit = (e) => {
        e.preventDefault();
        addQuest(questName, description)
    }
    return (
        <Container className="text-center">
            <Card>
                <Card.Body>
                    <Card.Title>Add a new Quest!</Card.Title>
                    <Form onSubmit={handleSubmit}>
                      <Form.Group>
                        <Form.Label>Give it a name:</Form.Label>
                        <Form.Control onChange={(e) => setQuestName(e.target.value)} placeholder="Enter name here"/>
                        <Form.Label>Tell me more: </Form.Label>
                        <Form.Control onChange={(e) => setDescription(e.target.value)} placeholder="Enter a quick description here"/>
                      </Form.Group>
                      <br/>
                      <Button variant="light" type="submit">Submit</Button>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
      )
}


function QuestDisplay(){
    const navigate = useNavigate()
    const params = useLocation()    
    const {journeyIdx, questIdx} =  params.state
    const [showQuestForm, setShowQuestForm] = useState(false)

    const [currentQuestIdx, setCurrentQuestIdx] = useState(questIdx)
    const [journeyData, setJourneyData] = useState([{}])
    const [questData, setQuestData] = useState([{}])


    const toggleQuestForm = () => {
        setShowQuestForm((prev) => !prev);
    };

    const addQuest = (name, description) => {
    // Add new member to the list
    fetch('/add_quest', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({ "journeyIdx": journeyIdx, "name": name, "description":description}),
    })
        .then((res) => res.text())
        .then((message) => {
        console.log(message);
        // Refresh the list of members after adding a new member
        fetch('/journeyDetails?index='+journeyIdx).then(
            res => res.json()
        ).then(
            data => {
            setJourneyData(data)
            toggleQuestForm()
            }
        )})
    };

    const removeQuest = () => {
        fetch('/remove_quest', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({ "journeyIdx": journeyIdx, "questIdx": currentQuestIdx}),
        })
        .then((res) => res.text())
        .then((message) => {
            console.log(message);
        });
        setCurrentQuestIdx(currentQuestIdx -1)
        console.log("updated currentQuestIdx "+currentQuestIdx)
    }

    useEffect(() => {
        fetch('/journeyDetails?index='+journeyIdx).then(
            res => res.json()
        ).then(
            data => {
            setJourneyData(data)
            }
        )
       
    }, [currentQuestIdx])

    useEffect(() => {
        console.log("Refreshing Quest data "+currentQuestIdx)
        if(currentQuestIdx !== -1){
            fetch('/questDetails?journeyIdx='+journeyIdx+'&questIdx='+currentQuestIdx).then(
                res => res.json()
            ).then(
                data => {
                    setQuestData(data)
                }
            )
        }else{
            setCurrentQuestIdx(0);
        }
        if (journeyData.questList){
            console.log("Length "+ journeyData.questList.length)
        }
        
    }, [currentQuestIdx])

    useEffect(() => {
        if ((journeyData.questList) && (journeyData.questList.length === 0)) {
            navigate('/');
        }
    }, [journeyData])
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
                    <Row className='p-2'>
                        <Col sm={8}><h3>Quests</h3></Col>
                        <Col><Button className='float-right' variant='light' onClick={toggleQuestForm}>{showQuestForm ? '-' : '+'}</Button></Col>
                    </Row>
                    <Row className = 'p-2'>
                    {showQuestForm &&  <QuestForm addQuest={addQuest}/>}
                    </Row>
                    <hr/>
                    <Row >
                        <ListGroup className="w-100">
                            {(typeof journeyData.questList === "undefined") ? (
                                <p>Loading...</p>
                            ) : (
                                journeyData.questList.map((name, i) => (
                                    <ListGroup.Item 
                                        className={i === currentQuestIdx ? "list-group-item-action active" : "list-group-item-action"}
                                        key={i} 
                                        onClick={() => setCurrentQuestIdx(i)}>
                                            {name}
                                    </ListGroup.Item>
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
                                <Dropdown.Item onClick={removeQuest}>Remove</Dropdown.Item>
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
                    {questData.tasks && questData.tasks.length > 0 ? (
                        questData.tasks.map((name, i) => (
                            <ListGroup.Item key={i} onClick={()=>console.log(i)}>{name}</ListGroup.Item>
                        ))
                    ) : (
                        <Alert variant='light'>
                            No tasks available. Add some to get started.
                        </Alert>
                    )}
                    </ListGroup>
                    
                </Col>
            </Row>

        </Container>    
      )
  }
  
  export {QuestDisplay, QuestForm}