import Modal from './Modal';
import Button from './Button';

export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title = 'Confirm action',
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  loading,
}) {
  return (
    <Modal open={open} onClose={onClose} title={title} description={description} size="sm">
      <footer className="flex gap-3 justify-end -mt-2">
        <Button variant="secondary" onClick={onClose}>{cancelLabel}</Button>
        <Button variant={variant} onClick={onConfirm} loading={loading}>{confirmLabel}</Button>
      </footer>
    </Modal>
  );
}
