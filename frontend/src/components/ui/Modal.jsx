import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { AlertTriangle, X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, description, onConfirm, confirmText = 'Confirm', variant = 'danger' }) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-surface p-6 text-left align-middle shadow-xl transition-all border border-border">
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-3 rounded-full ${variant === 'danger' ? 'bg-danger/10 text-danger' : 'bg-primary/10 text-primary'}`}>
                    <AlertTriangle size={24} />
                  </div>
                  <button onClick={onClose} className="text-textMuted hover:text-white transition-colors">
                    <X size={20} />
                  </button>
                </div>
                
                <Dialog.Title as="h3" className="text-lg font-bold leading-6 text-white">
                  {title}
                </Dialog.Title>
                <div className="mt-2">
                  <p className="text-sm text-textMuted">
                    {description}
                  </p>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-lg border border-border bg-transparent px-4 py-2 text-sm font-medium text-white hover:bg-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 transition-colors"
                    onClick={onClose}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className={`inline-flex justify-center rounded-lg border border-transparent px-4 py-2 text-sm font-medium text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 transition-colors ${
                      variant === 'danger' ? 'bg-danger hover:bg-danger/90 focus-visible:ring-danger' : 'bg-primary hover:bg-primary/90 focus-visible:ring-primary'
                    }`}
                    onClick={onConfirm}
                  >
                    {confirmText}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default Modal;
