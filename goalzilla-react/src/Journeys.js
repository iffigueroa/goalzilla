import React, {useState, useEffect, useContext} from 'react'
import { Row, Col, ListGroup, Alert, Container, Card, Button, Form, Dropdown, ProgressBar} from 'react-bootstrap';

import { useNavigate } from 'react-router-dom'

import { QuestForm } from './Quest'
import { DeletionConfirmation } from './DeletionConfirmation';
import {postRemoveJourney, postAddJourney, getJourneyDetails,getJourneys, postRemoveQuest, postAddQuest, getQuestPreview} from './goalzillaRequests'

const DataContext = React.createContext();


function QuestDisplay({journeyIdx}){
  const [showQuestForm, setShowQuestForm] = useState(false)
  const [deletionModalShow, setDeletionModalShow] = useState(false);
  const [questToRemove, setQuestToRemove] = useState(-1);
  const [questData, setQuestData] = useState([{}])
  const navigate = useNavigate()
  useEffect(() => {
    getQuestPreview({journeyIdx, setData: setQuestData})
  }, [journeyIdx])

  const showDeletionConfirmation = (i) => {
    setQuestToRemove(i)
    setDeletionModalShow(true)
  }
  const removeQuest = () => {
    postRemoveQuest({journeyIdx: journeyIdx, questIdx: questToRemove})
    getQuestPreview({journeyIdx, setData: setQuestData})
  }

  const addQuest = (name, description) => {
    postAddQuest({journeyIdx,name,description})
    toggleQuestForm()
    getQuestPreview({journeyIdx, setData: setQuestData})

  };
    const toggleQuestForm = () => {
        setShowQuestForm((prev) => !prev);
    };
  const navigateToQuest = (journeyIdx, questIdx) =>{
    navigate('/quest', { state: {journeyIdx, questIdx}});
  };

  const renderQuestAction = (status) =>  {
    switch(status) {
      case 'Complete':
        return 'View Quest';
      case 'In Progress':
        return 'Continue Quest';
      default:
        return 'Start Quest';
    }
  }

  return (
    <Container fluid>
      <Row>
        <Col sm={10}><h3>Quests</h3></Col>
        <Col><Button className='float-right' variant='light' onClick={toggleQuestForm}>{showQuestForm ? '-' : '+'}</Button></Col>
      </Row>
      {showQuestForm &&  <Row><QuestForm addQuest={addQuest}/></Row>}
      <Row>
        {(questData.length === 0) ? (
            <Alert variant='light'>
              No quests available. Add some to get started.
            </Alert>
          ) : (
              questData.map((q, i) => (
                <Col sm={4} key={i} className="py-2">
                  <Card className="h-100" >
                    <Card.Body>
                      <Button size="sm" className="float-right" variant='light' onClick={()=>showDeletionConfirmation(i)}>X</Button>
                      <Card.Title>{q.name}</Card.Title> 
                      <Card.Text>{q.description}</Card.Text>                      
                    </Card.Body>
                    <Card.Footer><Button onClick={()=>navigateToQuest(journeyIdx, i)}>{renderQuestAction(questData[i].status)}</Button></Card.Footer>
                  </Card>
                </Col>
              ))
        )}
      </Row>
      <DeletionConfirmation itemType="quest" show={deletionModalShow}  onHide={() => setDeletionModalShow(false)} remove={removeQuest}/>
    </Container>
  )
}

function JourneyDisplay({journeyIdx, removeJourney}){
  const [data, setData] = useState([{}])
  const { fetchJourneyData, handleFetchComplete } = useContext(DataContext);

  useEffect(() => {
    getJourneyDetails({journeyIdx, setData})
    if (fetchJourneyData){
      handleFetchComplete()
    }
  }, [fetchJourneyData])

  return (
    <Container fluid="sm">
      <Row >
        <Col sm={11}><h1>{data.name}</h1></Col>
        <Col>
          <Dropdown>
            <Dropdown.Toggle variant="light"></Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item disabled>Edit Details</Dropdown.Item>
              <Dropdown.Item onClick={removeJourney}>Remove</Dropdown.Item>
              <Dropdown.Item disabled>Set Active</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Col>
      </Row>
      <Row><Col><hr/></Col></Row>
      <Row className="d-flex align-items-stretch">        
        <Col sm ={8}>
          <Card className="h-100">
            <Card.Body>
                {data.description}
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card className="h-100">
            <Card.Body className="text-center">
              <Card.Title>Quests Completed</Card.Title>
              <Card.Title>{data.subtasksComplete}/{data.totalSubtasks}</Card.Title>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row><Col className='m-2'><h5>Overall Progress</h5></Col></Row>
      <Row className="p-2">
        <Col><ProgressBar now={data.progress} label={`${data.progress}%`}/></Col>
      </Row>
      <Row><Col><hr/></Col></Row>
      <Row>
        <QuestDisplay journeyIdx={journeyIdx}/>
      </Row>
    </Container>
  )

}


function NewGoalForm({addNewGoal}){
  const [goalName, setGoalName] = useState('')
  const [description, setDescription] = useState('')
  const handleSubmit = (e) => {
    e.preventDefault();
    addNewGoal(goalName, description);
    setGoalName('');
  };
  return (
    <Container className="text-center my-5">
        <Card>
            <Card.Body>
                <Card.Title>New Journey!</Card.Title>
                <Form onSubmit={handleSubmit}>
                  <Form.Group>
                    <Form.Label>Journey Name</Form.Label>
                    <Form.Control onChange={(e) => setGoalName(e.target.value)} placeholder="Enter name here"/>
                    <Form.Label>Journey Description</Form.Label>
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

function Journeys(){
  const [data, setData] = useState([{}])
  const [showNewGoalForm, setShowNewGoalForm] = useState(false)
  const [showGoalTrack, setShowGoalTrack] = useState(false)
  const [goalTrackId, setGoalTrackId] = useState(null)
  const [deletionModalShow, setDeletionModalShow] = useState(false);
  const [fetchJourneyData, setFetchJourneyData] = useState(false);
  
  const showDeletionConfirmation = (i) => {
    setDeletionModalShow(true)
  }

  useEffect(() => {
    getJourneys({setData})
  }, [])

  const toggleGoalForm = () => {
    setShowNewGoalForm((prev) => !prev);
    setShowGoalTrack(false);
  };
  const displayGoalTrack = (index) => {
    setGoalTrackId(index)
    setFetchJourneyData(true);  
    setShowGoalTrack(true);
    setShowNewGoalForm(false);
  };

  const removeJourney = () => {
    postRemoveJourney({journeyIdx: goalTrackId})
    getJourneys({setData})
    //Set activeId & force update journey display
    const nextId = goalTrackId - 1
    setGoalTrackId(nextId  < 0 ? 0 : nextId)
    if (data.goals?.length !== 0){
      console.log("FORCE FETCH DATA")
      setFetchJourneyData(true);  
    }
    
  }
  const handleFetchComplete = () => {
    setFetchJourneyData(false);
  };

  const addNewGoal = (goalName, description) => {
    postAddJourney({name: goalName, description: description})
    toggleGoalForm()
    getJourneys({setData})
  };

  return (
    <Container className='mt-3'>
        <Row>
            <Col sm={3}>
            <Row>
                <Col sm={9}><h3>Journeys</h3></Col>
                <Col><Button variant="light" onClick={toggleGoalForm}>+</Button></Col>
            </Row>
            
            <ListGroup>
                {(typeof data.goals === "undefined") ? (
                    <p>Loading...</p>
                ) : (
                    data.goals.map((name, i) => (
                        <ListGroup.Item key={i} onClick={()=>displayGoalTrack(i)}>{name}</ListGroup.Item>
                    ))
                )}
            </ListGroup>
            </Col>

            <Col>
            {showNewGoalForm && <NewGoalForm addNewGoal={addNewGoal}/>}
            <DataContext.Provider value={{fetchJourneyData, handleFetchComplete}}>
              {data.goals?.length > 0 && showGoalTrack && <JourneyDisplay journeyIdx={goalTrackId} removeJourney={showDeletionConfirmation}/>}
            </DataContext.Provider>
            </Col>
        </Row>
        <DeletionConfirmation itemType="journey" show={deletionModalShow}  onHide={() => setDeletionModalShow(false)} remove={removeJourney}/>

      </Container>   
    )
}

export default Journeys