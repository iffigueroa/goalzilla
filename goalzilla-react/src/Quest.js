import React, {useState, useEffect} from 'react'
import { Alert, Badge,Row, Col, ListGroup, Container, Card, Button, Dropdown, ProgressBar, Form, Modal} from 'react-bootstrap';
import { DeletionConfirmation } from './DeletionConfirmation';
import { useLocation, useNavigate } from 'react-router-dom'
import {getJourneyDetails, getQuestDetails, postAddQuest, getTaskDetails, postRemoveQuest, postRemoveTask, postTaskCompletion, postAddTask} from './goalzillaRequests'


function TaskForm({addTask}){
    const [taskName, setTaskName] = useState('')
    const handleSubmit = (e) => {
        e.preventDefault();
        addTask(taskName)
    }
    return (
        <Container className="text-center">
            <Card>
                <Card.Body>
                    <Card.Title>Add a Task!</Card.Title>
                    <Form onSubmit={handleSubmit}>
                      <Form.Group>
                        <Form.Label>Give it a name:</Form.Label>
                        <Form.Control onChange={(e) => setTaskName(e.target.value)} placeholder="Enter name here"/>
                      </Form.Group>
                      <br/>
                      <Button variant="light" type="submit">Submit</Button>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
      )
}


function TaskDialog({show, onHide, removeTask, journeyIdx, questIdx, taskIdx}){
    const [curentTaskIdx, setCurrentTaskIdx] = useState(taskIdx)
    const [currentQuestIdx, setCurrentQuestIdx] = useState(questIdx)
    const [taskDetails, setTaskDetails] = useState({})
    const [deletionModalShow, setDeletionModalShow] = useState(false);

    useEffect(() => {
        getTaskDetails({ journeyIdx, questIdx, taskIdx, setData: setTaskDetails})
        setCurrentTaskIdx(taskIdx)
        setCurrentQuestIdx(questIdx)
    }, [taskIdx, questIdx])

    const markComplete = () => {
        postTaskCompletion({journeyIdx: journeyIdx, questIdx:currentQuestIdx , taskIdx:curentTaskIdx})
        onHide()
    }
    const confirmDeletion = () => {
        setDeletionModalShow(true)
    }

    return(
        <Container>
            <DeletionConfirmation itemType="task" show={deletionModalShow}  onHide={() => setDeletionModalShow(false)} remove={() => removeTask(curentTaskIdx)}/>
            <Modal show={show}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header>
                <Modal.Title id="contained-modal-title-vcenter">
                    {taskDetails.name}
                </Modal.Title>
                <Button onClick={onHide} className='float-right' variant='light'>X</Button>
                </Modal.Header>
                <Modal.Body>
                
                </Modal.Body>
                <Modal.Footer>
                    <Col><Button  className='text-center w-100' onClick={confirmDeletion} variant='light'>Delete</Button></Col>
                    <Col><Button  className='text-center w-100' onClick={markComplete} variant='light'>Mark Complete</Button></Col>
                    <Col><Button  className='text-center w-100' onClick={onHide} variant='light'>Close</Button></Col>
                </Modal.Footer>
            </Modal>
        </Container>
        
    )
}



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
    const [showTaskForm, setShowTaskForm] = useState(false)
    const [modalShow, setModalShow] = useState(false);
    const [deletionModalShow, setDeletionModalShow] = useState(false);
    const [currentTaskIdx, setCurrentTaskIdx] = useState(-1)
    const [currentQuestIdx, setCurrentQuestIdx] = useState(questIdx)
    const [journeyData, setJourneyData] = useState([{}])
    const [questData, setQuestData] = useState([{}])

    
    const toggleQuestForm = () => {
        setShowQuestForm((prev) => !prev);
    };
    const toggleTaskForm = () => {
        setShowTaskForm((prev) => !prev);
    };

    const addQuest = (name, description) => {
        postAddQuest({journeyIdx: journeyIdx, name: name, description: description})
        getJourneyDetails({journeyIdx, setData:setJourneyData})
        toggleQuestForm()
    };

    const addTask = (name) => {
        postAddTask({journeyIdx: journeyIdx, questIdx:currentQuestIdx,  taskName: name})
        getJourneyDetails({journeyIdx, setData:setJourneyData})
        refreshQuestData()
        toggleTaskForm()        
    }   

    const removeTask = (i) => {
        console.log("Remove Quest"+i)
        postRemoveTask({journeyIdx: journeyIdx,questIdx:  currentQuestIdx, taskIdx: i})
        refreshQuestData()
        setModalShow(false)
    }

    const removeQuest = () => {
        postRemoveQuest({journeyIdx: journeyIdx, questIdx: currentQuestIdx})
        setCurrentQuestIdx(currentQuestIdx -1)
        console.log("updated currentQuestIdx "+currentQuestIdx)
    }

    useEffect(() => {
        getJourneyDetails({journeyIdx, setData:setJourneyData})
    }, [currentQuestIdx, modalShow])

    const refreshQuestData = () => {
        console.log("Refreshing Quest data "+currentQuestIdx)
        if(currentQuestIdx !== -1){
            getQuestDetails({journeyIdx: journeyIdx, questIdx: currentQuestIdx, setData: setQuestData})
        }else{
            setCurrentQuestIdx(0);
        }
        if (journeyData.questList){
            console.log("Length "+ journeyData.questList.length)
        }
    }

    useEffect(() => {
        refreshQuestData()
    }, [currentQuestIdx, modalShow])

    useEffect(() => {
        if ((journeyData.questList) && (journeyData.questList.length === 0)) {
            navigate('/');
        }
    }, [journeyData])

    const showTask = (i) => {
        setCurrentTaskIdx(i)
        setModalShow(true)
    }
    const showDeletionConfirmation = () => {
        setDeletionModalShow(true)
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
                                <Dropdown.Item onClick={showDeletionConfirmation}>Remove</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </Col>
                    </Row>
                    <Badge>{questData.status}</Badge>
                        <Card>
                            <Card.Body>
                                {questData.description}
                            </Card.Body>
                        </Card>
                    <hr/>
                    <Row>
                        <Col sm={11}><h3 className='p-2'>Task List</h3></Col>
                        <Col><Button className='float-right' variant='light' onClick={toggleTaskForm}>{showTaskForm ? '-' : '+'}</Button></Col>
                    </Row>
                    <Row>{showTaskForm &&  <TaskForm addTask={addTask}/>}</Row>
                    <ListGroup>
                    {questData.tasks && questData.tasks.length > 0 ? (
                        questData.tasks.map((task, i) => (
                            <ListGroup.Item key={i} onClick={()=>showTask(i)}>
                                <Row className='p-1' style={{ textDecoration: task.status === 'Complete' ? 'line-through' : 'none' }}>
                                {task.name}
                                </Row>
                            </ListGroup.Item>
                        ))
                    ) : (
                        <Alert variant='light'>
                            No tasks available. Add some to get started.
                        </Alert>
                    )}
                    </ListGroup>
                    <Row></Row>
                    <TaskDialog show={modalShow} onHide={() => setModalShow(false)} removeTask={removeTask} journeyIdx={journeyIdx} questIdx={currentQuestIdx} taskIdx={currentTaskIdx}/>
                    <DeletionConfirmation itemType="quest" show={deletionModalShow}  onHide={() => setDeletionModalShow(false)} remove={removeQuest}/>

                </Col>
            </Row>

        </Container>    
      )
  }
  
  export {QuestDisplay, QuestForm}