import React, { useEffect, useState } from "react";

type ModalProps = {
  show: boolean;
  onClose: () => void;
  onSave?: () => void;
  children: React.ReactNode;
  title: string;
  buttonsFooter: boolean;
};

const Modal: React.FC<ModalProps> = ({
  show,
  onClose,
  onSave,
  children,
  title,
  buttonsFooter,
}) => {
  const [isBrowser, setIsBrowser] = useState(false);

  useEffect(() => {
    setIsBrowser(true);
  }, []);

  const handleCloseClick = (e: any) => {
    e.preventDefault();
    onClose();
  };

  const handleSaveClick = (e: any) => {
    e.preventDefault();
    if (onSave != null) onSave();
    onClose();
  };

  const mainModal = show
    ? "opacity-100 pointer-events-auto"
    : "opacity-0 pointer-events-none";
  const containerModal = show
    ? "opacity-100 translate-y-0"
    : "opacity-0 -translate-y-10";
  const backdropModal = show
    ? "opacity-25 pointer-events-auto"
    : "opacity-0 pointer-events-none";
  const ModalContent = () => (
    <>
      <div
        className={`${mainModal} grid place-items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none transition-all duration-500`}
      >
        <div
          className={`transform ${containerModal} w-auto my-6 mx-auto max-w-sm transition-all duration-500`}
        >
          <div className="border-0 p-6 rounded-lg shadow-lg flex flex-col w-full bg-white outline-none focus:outline-none">
            <div className="flex items-center justify-between mb-6">
              <h5 className="text-gray-900 text-base font-bold mt-0 mb-0">
                {title}
              </h5>

              <button
                onClick={handleCloseClick}
                className="ml-4 relative flex items-center justify-center text-gray-900 text-3xl leading-none outline-none focus:outline-none"
              >
                <span className="text-gray-900 text-3xl mb-1">×</span>
              </button>
            </div>
            <div className="relative flex-auto mb-6">{children}</div>
            {buttonsFooter && (
              <div className="flex items-center justify-end gap-4">
                <button
                  onClick={handleCloseClick}
                  className="overflow-hidden relative false flex items-center justify-center gap-1 font-bold outline-none uppercase tracking-wider focus:outline-none focus:shadow-none transition-all duration-300 rounded-lg py-2.5 px-6 text-xs leading-normal bg-transparent text-red-500 hover:bg-red-50 hover:text-red-700 active:bg-red-100 undefined"
                >
                  Fechar
                </button>
                <button
                  onClick={handleSaveClick}
                  className="overflow-hidden relative false flex items-center justify-center gap-1 font-bold outline-none uppercase tracking-wider focus:outline-none focus:shadow-none transition-all duration-300 rounded-lg py-2.5 px-6 text-xs leading-normal text-white bg-green-500 hover:bg-green-700 focus:bg-green-400 active:bg-green-800 shadow-md-green hover:shadow-lg-green undefined"
                >
                  Salvar
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <div
        className={`${backdropModal} fixed inset-0 z-40 bg-black transition-all duration-500`}
      ></div>
    </>
  );

  if (isBrowser) {
    return <ModalContent />;
  } else {
    return null;
  }
};

export default Modal;
