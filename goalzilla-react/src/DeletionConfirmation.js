import { Button, Modal} from 'react-bootstrap';


function DeletionConfirmation({itemType, show, onHide, remove}) {
    const doRemoval = () => {
        onHide()
        remove()
    }
    return (
        <Modal show={show}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
    >
          <Modal.Header>
            <Modal.Title>Are you sure you want to delete this {itemType}?</Modal.Title>
          </Modal.Header>
  
          <Modal.Body>
            <p>This action cannot be undone.</p>
          </Modal.Body>
  
          <Modal.Footer>
            <Button onClick={doRemoval} variant='light'>Yes</Button>
            <Button onClick={onHide} variant='light'>No</Button>
          </Modal.Footer>
      </Modal>
    );
  }
  

export {DeletionConfirmation}