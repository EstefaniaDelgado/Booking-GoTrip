import {
  Dialog,
  DialogBody,
  DialogFooter,
  Button,
} from '@material-tailwind/react';
import {
  deleteCategory,
  getCategories,
} from '../../services/categoryService';
import { useState } from 'react';

const DeleteModal = ({
  open, onClose, setOpenModal, eventId, setEvents
}) => {
 
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteEvent = async () => {
    if (!eventId) return;
    try {
      setIsDeleting(true);
      await deleteCategory(eventId);
      const updateEvents = await getCategories();
      setEvents([...updateEvents]);
      setOpenModal(false);
    } catch (error) {
      console.error('Error al eliminar la categoria:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} handler={onClose} size="xs" className="bg-[#CEE7E2]">
      <DialogBody className="text-center py-5">
        <p>¿Desea eliminar la categoria?</p>
        <p>Al eliminar la categoria se eliminan todos los productos asociados.</p>
      </DialogBody>
      <DialogFooter className="flex justify-center gap-2 font-light">
        <Button
          color="blue"
          className="rounded-md capitalize font-light"
          onClick={handleDeleteEvent}
          disabled={isDeleting} // Deshabilitar mientras elimina
        >
          {isDeleting ? 'Eliminando...' : 'Sí'}
        </Button>
        <Button
          color="red"
          onClick={onClose}
          className="rounded-md capitalize font-light"
          disabled={isDeleting} // Evitar cierre si está eliminando
        >
          No
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default DeleteModal;
