import { AlertTriangle } from 'lucide-react';
import Modal from './Modal';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmLabel?: string;
}

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'تأكيد الحذف',
  message = 'هل أنت متأكد من أنك تريد حذف هذا السجل؟ لا يمكن التراجع عن هذا الإجراء.',
  confirmLabel = 'نعم، احذف',
}: ConfirmDialogProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="max-w-md">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <p className="text-sm text-slate-600 leading-relaxed pt-1">{message}</p>
      </div>

      <div className="flex items-center justify-end gap-2.5 mt-6">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2.5 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
        >
          إلغاء
        </button>
        <button
          type="button"
          onClick={() => {
            onConfirm();
            onClose();
          }}
          className="px-4 py-2.5 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-colors"
        >
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
